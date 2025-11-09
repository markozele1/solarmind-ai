import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { city, date, clear_ghi_kwh_m2, cloudy_ghi_kwh_m2, sunlight_quality_pct, peak_sun_hours, energy_kwh, co2_saved_kg, sunrise, sunset } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Generating AI summary for:", city);

    const prompt = `Solar Data Summary:
City: ${city}
Date: ${date}
Clear-sky GHI: ${clear_ghi_kwh_m2} kWh/m²
Cloudy-sky GHI: ${cloudy_ghi_kwh_m2} kWh/m²
Sunlight Quality: ${sunlight_quality_pct}% of clear-sky potential
Peak Sun Hours: ${peak_sun_hours} hours
Estimated Energy Output: ${energy_kwh} kWh
CO₂ Savings: ${co2_saved_kg} kg
Sunrise: ${sunrise}, Sunset: ${sunset}

Explain this solar data in 2-3 sentences for a non-technical reader. Mention today's sunlight quality, estimated energy output, and CO₂ savings.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are SolarMind, an AI assistant that explains solar energy data in simple, encouraging terms.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", response.status, errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content;

    console.log("Summary generated successfully");

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-summary:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
