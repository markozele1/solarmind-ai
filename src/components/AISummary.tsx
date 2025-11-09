import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ForecastData } from "@/pages/Index";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AISummaryProps {
  data: ForecastData;
}

export const AISummary = ({ data }: AISummaryProps) => {
  const [summary, setSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerateTime, setLastGenerateTime] = useState<number>(0);
  const { toast } = useToast();

  const generateSummary = async () => {
    const now = Date.now();
    const timeSinceLastGenerate = now - lastGenerateTime;
    
    if (timeSinceLastGenerate < 60000) {
      const remainingSeconds = Math.ceil((60000 - timeSinceLastGenerate) / 1000);
      toast({
        title: "Rate limit",
        description: `Please wait ${remainingSeconds}s before generating AI insight`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const today = data.days[0];
      
      const { data: result, error } = await supabase.functions.invoke("ai-summary", {
        body: {
          city: data.location,
          date: today.date,
          clear_ghi_kwh_m2: today.ghi_clear_kwh,
          cloudy_ghi_kwh_m2: today.ghi_cloudy_kwh,
          sunlight_quality_pct: today.sunlightQuality,
          peak_sun_hours: today.peakSunHours,
          energy_kwh: today.estimatedEnergy,
          co2_saved_kg: today.co2Savings,
          sunrise: today.sunrise,
          sunset: today.sunset,
        },
      });

      if (error) throw error;

      setSummary(result.summary);
      setLastGenerateTime(now);
    } catch (error: any) {
      toast({
        title: "Error generating summary",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-primary/20 shadow-[var(--shadow-card)] bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!summary ? (
              <Button
                onClick={generateSummary}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-solar-glow hover:opacity-90"
              >
                {isLoading ? "Generating..." : "Generate AI Summary"}
              </Button>
            ) : (
              <div className="prose prose-sm max-w-none">
                <p className="text-base leading-relaxed">{summary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
