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
    const { location, date, avgGhiClear, avgGhiCloudy, sunrise, sunset, estimatedEnergy, co2Savings } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Generating AI summary for:", location);

    const prompt = `Location: ${location}
Date: ${date}
Average GHI (clear sky): ${avgGhiClear.toFixed(0)} W/m²
Average GHI (cloudy): ${avgGhiCloudy.toFixed(0)} W/m²
Sunrise: ${sunrise}
Sunset: ${sunset}
Estimated daily energy: ${estimatedEnergy.toFixed(1)} kWh
Estimated CO₂ savings: ${co2Savings.toFixed(1)} kg

Explain this solar forecast in 2-3 sentences for a non-technical user. Mention today's sunlight quality, energy output, and CO₂ impact in an encouraging tone.`;

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
