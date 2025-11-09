import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, roofArea = 10, systemSize = 5 } = await req.json();
    const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");

    if (!OPENWEATHER_API_KEY) {
      throw new Error("OpenWeather API key not configured");
    }

    console.log(`Fetching forecast for city: ${city}, roofArea: ${roofArea}, systemSize: ${systemSize}`);

    // Step 1: Geocoding to get lat/lon
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      throw new Error(`Geocoding failed: ${geoResponse.statusText}`);
    }

    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      throw new Error(`City "${city}" not found`);
    }

    const { lat, lon, name, country } = geoData[0];
    console.log(`Found location: ${name}, ${country} (${lat}, ${lon})`);

    // Step 2: Get Solar Irradiance data for 7 days
    const days = [];
    const now = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      
      // Call Solar Irradiance API
      const solarUrl = `https://api.openweathermap.org/energy/1.0/solar/data?lat=${lat}&lon=${lon}&date=${dateStr}&appid=${OPENWEATHER_API_KEY}`;
      const solarResponse = await fetch(solarUrl);
      
      if (!solarResponse.ok) {
        console.error(`Solar API failed for ${dateStr}: ${solarResponse.statusText}`);
        // Use fallback values if API fails
        days.push({
          date: dateStr,
          ghi_clear: 800,
          ghi_cloudy: 400,
          sunrise: "06:00",
          sunset: "18:00",
        });
        continue;
      }

      const solarData = await solarResponse.json();
      
      // Extract GHI values (Global Horizontal Irradiance)
      const ghiClear = solarData.irradiance?.daily?.clear_sky || 800;
      const ghiCloudy = solarData.irradiance?.daily?.cloudy || 400;
      
      days.push({
        date: dateStr,
        ghi_clear: Math.round(ghiClear),
        ghi_cloudy: Math.round(ghiCloudy),
        sunrise: solarData.sunrise || "06:00",
        sunset: solarData.sunset || "18:00",
      });
    }

    // Calculate metrics
    const avgGhiClear = days.reduce((sum, d) => sum + d.ghi_clear, 0) / days.length;
    
    // Peak sun hours ≈ GHI in kWh/m²/day
    const peakSunHours = avgGhiClear / 1000 * 5; // Approximate conversion
    
    // Estimated energy = system size (kW) × peak sun hours × efficiency (0.75)
    const estimatedEnergy = systemSize * peakSunHours * 0.75;
    
    // CO₂ savings = energy × 0.45 kg CO₂ per kWh
    const co2Savings = estimatedEnergy * 0.45;

    const result = {
      location: `${name}, ${country}`,
      lat,
      lon,
      days,
      peakSunHours,
      estimatedEnergy,
      co2Savings,
    };

    console.log("Forecast generated successfully:", result);

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
