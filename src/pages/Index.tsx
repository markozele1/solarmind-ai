import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ForecastDashboard } from "@/components/ForecastDashboard";
import { AISummary } from "@/components/AISummary";
import { ChatSection } from "@/components/ChatSection";
import { AnimatedSolarBackground } from "@/components/AnimatedSolarBackground";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ForecastData {
  location: string;
  lat: number;
  lon: number;
  days: Array<{
    date: string;
    ghi_clear_kwh: number;
    ghi_cloudy_kwh: number;
    sunrise: string;
    sunset: string;
    peakSunHours: number;
    sunlightQuality: number;
    estimatedEnergy: number;
    co2Savings: number;
  }>;
  today: {
    sunlightQuality: number;
    peakSunHours: number;
    estimatedEnergy: number;
    co2Savings: number;
    sunrise: string;
    sunset: string;
  };
  roofArea: number;
}

const Index = () => {
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  const [lastForecastTime, setLastForecastTime] = useState<number>(0);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);
  const [currentCity, setCurrentCity] = useState("London");
  const [currentRoofArea, setCurrentRoofArea] = useState(10);
  const [currentSystemSize, setCurrentSystemSize] = useState(5);
  const { toast } = useToast();

  const handleGetForecast = async (city: string, roofArea: number, systemSize: number) => {
    const now = Date.now();
    const timeSinceLastForecast = now - lastForecastTime;
    
    if (timeSinceLastForecast < 60000) {
      const remainingSeconds = Math.ceil((60000 - timeSinceLastForecast) / 1000);
      toast({
        title: "Rate limit",
        description: `Please wait ${remainingSeconds}s before requesting forecast`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("solar-forecast", {
        body: { city, roofArea, systemSize, useMockData },
      });

      if (error) throw error;

      setForecastData(data);
      setCurrentCity(city);
      setCurrentRoofArea(roofArea);
      setCurrentSystemSize(systemSize);
      setLastForecastTime(now);
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
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshTime;
    
    if (timeSinceLastRefresh < 60000) {
      const remainingSeconds = Math.ceil((60000 - timeSinceLastRefresh) / 1000);
      toast({
        title: "Rate limit",
        description: `Please wait ${remainingSeconds}s before refreshing`,
        variant: "destructive",
      });
      return;
    }

    if (forecastData) {
      setLastRefreshTime(now);
      handleGetForecast(forecastData.location, forecastData.roofArea, 5);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-blue to-background relative">
      <AnimatedSolarBackground />
      {!forecastData ? (
        <HeroSection
          onSubmit={handleGetForecast} 
          isLoading={isLoading}
          useMockData={useMockData}
          onToggleMockData={setUseMockData}
        />
      ) : (
        <>
          <ForecastDashboard 
            data={forecastData} 
            onRefresh={handleRefresh}
            onUpdateSettings={handleGetForecast}
            isLoading={isLoading}
            useMockData={useMockData}
            onToggleMockData={setUseMockData}
            currentCity={currentCity}
            currentRoofArea={currentRoofArea}
            currentSystemSize={currentSystemSize}
          />
          <AISummary data={forecastData} />
          <ChatSection />
        </>
      )}
    </div>
  );
};

export default Index;
