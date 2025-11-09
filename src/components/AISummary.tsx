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
  const { toast } = useToast();

  const generateSummary = async () => {
    setIsLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke("ai-summary", {
        body: {
          location: data.location,
          date: data.days[0].date,
          avgGhiClear: data.days.reduce((sum, d) => sum + d.ghi_clear, 0) / data.days.length,
          avgGhiCloudy: data.days.reduce((sum, d) => sum + d.ghi_cloudy, 0) / data.days.length,
          sunrise: data.days[0].sunrise,
          sunset: data.days[0].sunset,
          estimatedEnergy: data.estimatedEnergy,
          co2Savings: data.co2Savings,
        },
      });

      if (error) throw error;

      setSummary(result.summary);
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
