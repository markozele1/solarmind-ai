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

    const avgHouseholdDailyUse = 30; // kWh per day
    const householdHours = ((energy_kwh / avgHouseholdDailyUse) * 24).toFixed(1);
    const monthlyValue = (energy_kwh * 0.15 * 30).toFixed(0); // Assuming $0.15/kWh
    const yearlyValue = (energy_kwh * 0.15 * 365).toFixed(0);

    const prompt = `You are a solar energy advisor helping homeowners understand their solar investment potential in simple, relatable terms.

Based on this data for ${city} on ${date}:
- Energy output: ${energy_kwh} kWh today
- CO₂ savings: ${co2_saved_kg} kg today
- Sunlight quality: ${sunlight_quality_pct}% of clear-sky potential
- Peak sun hours: ${peak_sun_hours} hours
- Sunrise: ${sunrise}, Sunset: ${sunset}

Write a compelling 3-4 sentence insight that:
1. Interprets what ${energy_kwh} kWh means for a homeowner's daily life (hint: average home uses ${avgHouseholdDailyUse} kWh/day, so this can power a home for ${householdHours} hours)
2. Translates the environmental impact into something meaningful (${co2_saved_kg} kg CO₂ saved)
3. Explains the financial value - estimated $${monthlyValue}/month or $${yearlyValue}/year in electricity savings (at $0.15/kWh)
4. Provides actionable insight: is this a good solar day? What does this mean for their investment?

Make it conversational, encouraging, and focused on "what this means for YOUR wallet and the planet." Avoid just listing numbers - interpret them. Use relatable comparisons when possible.`;

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
            content: "You are SolarMind, a friendly solar energy advisor who helps homeowners understand the real-world value of solar energy. You translate technical data into meaningful insights about savings, environmental impact, and smart investment decisions. Always be encouraging and focus on practical benefits.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
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
