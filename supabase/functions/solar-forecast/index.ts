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
    const { city, roofArea = 10 } = await req.json();
    
    console.log(`Using cached data for: ${city}, roofArea: ${roofArea}m²`);

    // Process cached data with new calculations
    const processedDays = CACHED_ZAGREB_DATA.days.map(day => {
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
      location: CACHED_ZAGREB_DATA.location,
      lat: CACHED_ZAGREB_DATA.lat,
      lon: CACHED_ZAGREB_DATA.lon,
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

    console.log("Forecast generated from cached data:", result);

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
