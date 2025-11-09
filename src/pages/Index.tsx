import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ForecastDashboard } from "@/components/ForecastDashboard";
import { AISummary } from "@/components/AISummary";
import { ChatSection } from "@/components/ChatSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ForecastData {
  location: string;
  lat: number;
  lon: number;
  days: Array<{
    date: string;
    ghi_clear: number;
    ghi_cloudy: number;
    sunrise: string;
    sunset: string;
  }>;
  peakSunHours: number;
  estimatedEnergy: number;
  co2Savings: number;
}

const Index = () => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetForecast = async (city: string, roofArea: number, systemSize: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("solar-forecast", {
        body: { city, roofArea, systemSize },
      });

      if (error) throw error;

      setForecastData(data);
      toast({
        title: "Forecast loaded successfully",
        description: `Solar data for ${data.location} is ready`,
      });
    } catch (error: any) {
      toast({
        title: "Error loading forecast",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (forecastData) {
      toast({
        title: "Refreshing data",
        description: "Fetching latest solar irradiance data...",
      });
      // Re-fetch with same parameters
      handleGetForecast(forecastData.location, 10, 5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-blue to-background">
      <HeroSection onSubmit={handleGetForecast} isLoading={isLoading} />
      
      {forecastData && (
        <>
          <ForecastDashboard data={forecastData} onRefresh={handleRefresh} />
          <AISummary data={forecastData} />
          <ChatSection />
        </>
      )}
    </div>
  );
};

export default Index;
