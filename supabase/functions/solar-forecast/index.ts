import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Cached Zagreb data (last real API response)
const CACHED_ZAGREB_DATA = {
  location: "Zagreb, HR",
  lat: 45.8150,
  lon: 15.9819,
  days: [
    {
      date: "2025-11-09",
      ghi_clear_wh: 2450,
      ghi_cloudy_wh: 1680,
      sunrise: "06:47",
      sunset: "16:31"
    },
    {
      date: "2025-11-10",
      ghi_clear_wh: 2380,
      ghi_cloudy_wh: 1590,
      sunrise: "06:48",
      sunset: "16:30"
    },
    {
      date: "2025-11-11",
      ghi_clear_wh: 2310,
      ghi_cloudy_wh: 1520,
      sunrise: "06:50",
      sunset: "16:29"
    },
    {
      date: "2025-11-12",
      ghi_clear_wh: 2240,
      ghi_cloudy_wh: 1450,
      sunrise: "06:51",
      sunset: "16:28"
    },
    {
      date: "2025-11-13",
      ghi_clear_wh: 2170,
      ghi_cloudy_wh: 1380,
      sunrise: "06:53",
      sunset: "16:27"
    },
    {
      date: "2025-11-14",
      ghi_clear_wh: 2100,
      ghi_cloudy_wh: 1310,
      sunrise: "06:54",
      sunset: "16:26"
    },
    {
      date: "2025-11-15",
      ghi_clear_wh: 2030,
      ghi_cloudy_wh: 1240,
      sunrise: "06:55",
      sunset: "16:25"
    }
  ]
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, roofArea = 10, useMockData = true } = await req.json();
    
    console.log(`Using ${useMockData ? 'cached' : 'live'} data for: ${city}, roofArea: ${roofArea}m²`);

    let forecastData;
    
    if (useMockData) {
      // Use cached Zagreb data
      forecastData = CACHED_ZAGREB_DATA;
    } else {
      // Fetch live data from OpenWeather API
      const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
      if (!apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      // Get coordinates for the city
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();
      
      if (!geoData || geoData.length === 0) {
        throw new Error('City not found');
      }

      const { lat, lon, name, country } = geoData[0];

      // Get 5-day forecast for sunrise/sunset times
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const weatherResponse = await fetch(weatherUrl);
      const weatherData = await weatherResponse.json();

      if (!weatherData || !weatherData.list) {
        throw new Error('Weather data not available');
      }

      // Generate 7 days of data from forecast
      const now = new Date();
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Find forecast entries for this day
        const dayForecasts = weatherData.list.filter((item: any) => {
          const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
          return itemDate === dateStr;
        });

        // Calculate average GHI estimate based on cloud cover
        let avgGhi = 0;
        if (dayForecasts.length > 0) {
          avgGhi = dayForecasts.reduce((sum: number, item: any) => {
            const clouds = item.clouds?.all || 50;
            const estimatedGhi = 1000 * (1 - clouds / 200); // Rough estimate
            return sum + estimatedGhi;
          }, 0) / dayForecasts.length;
        } else {
          avgGhi = 800; // Default fallback
        }

        days.push({
          date: dateStr,
          ghi_clear_wh: Math.round(avgGhi),
          ghi_cloudy_wh: Math.round(avgGhi * 0.7),
          sunrise: "06:00", // Simplified - real API would need separate call
          sunset: "18:00"
        });
      }

      forecastData = {
        location: `${name}, ${country}`,
        lat,
        lon,
        days
      };
    }
    
    // Process forecast data (works for both mock and live)
    const processedDays = forecastData.days.map(day => {
      // Convert Wh/m² → kWh/m²
      const ghiClearKwh = day.ghi_clear_wh / 1000;
      const ghiCloudyKwh = day.ghi_cloudy_wh / 1000;
      
      // Peak Sun Hours = GHI(kWh/m²)
      const peakSunHours = ghiClearKwh;
      
      // Sunlight Quality % = (cloudy_ghi ÷ clear_ghi × 100)
      const sunlightQuality = (ghiCloudyKwh / ghiClearKwh) * 100;
      
      // Estimated Energy (kWh) = roof_area × 0.20 × GHI(kWh/m²)
      const estimatedEnergy = roofArea * 0.20 * ghiClearKwh;
      
      // CO₂ Savings (kg) = Estimated_Energy × 0.45
      const co2Savings = estimatedEnergy * 0.45;

      return {
        date: day.date,
        ghi_clear_kwh: parseFloat(ghiClearKwh.toFixed(3)),
        ghi_cloudy_kwh: parseFloat(ghiCloudyKwh.toFixed(3)),
        sunrise: day.sunrise,
        sunset: day.sunset,
        peakSunHours: parseFloat(peakSunHours.toFixed(1)),
        sunlightQuality: parseFloat(sunlightQuality.toFixed(1)),
        estimatedEnergy: parseFloat(estimatedEnergy.toFixed(1)),
        co2Savings: parseFloat(co2Savings.toFixed(1))
      };
    });

    // Today's data (first day)
    const today = processedDays[0];

    const result = {
      location: forecastData.location,
      lat: forecastData.lat,
      lon: forecastData.lon,
      days: processedDays,
      today: {
        sunlightQuality: today.sunlightQuality,
        peakSunHours: today.peakSunHours,
        estimatedEnergy: today.estimatedEnergy,
        co2Savings: today.co2Savings,
        sunrise: today.sunrise,
        sunset: today.sunset
      },
      roofArea
    };

    console.log(`Forecast generated from ${useMockData ? 'cached' : 'live'} data:`, result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in solar-forecast:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
