import { useState, useRef, useEffect } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ForecastDashboard } from "@/components/ForecastDashboard";
import { AISummary } from "@/components/AISummary";
import { ChatSection } from "@/components/ChatSection";
import { SavingsBreakdown } from "@/components/SavingsBreakdown";
import { SolarFAQ } from "@/components/SolarFAQ";
import { SystemSpecsCard } from "@/components/SystemSpecsCard";
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
  const [electricityRate, setElectricityRate] = useState(0.15);
  const [monthlyBill, setMonthlyBill] = useState(150);
  const { toast } = useToast();
  const forecastRef = useRef<HTMLDivElement>(null);

  // Load electricity rate and monthly bill from sessionStorage when forecast data is available
  useEffect(() => {
    if (forecastData) {
      const storedRate = sessionStorage.getItem('electricityRate');
      const storedBill = sessionStorage.getItem('monthlyBill');
      if (storedRate) {
        setElectricityRate(parseFloat(storedRate));
      }
      if (storedBill) {
        setMonthlyBill(parseFloat(storedBill));
      }
    }
  }, [forecastData]);

  useEffect(() => {
    if (forecastData && forecastRef.current) {
      forecastRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [forecastData]);

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
    <div className="min-h-screen bg-gradient-to-b from-sky-blue to-background">
      {!forecastData ? (
        <HeroSection 
          onSubmit={handleGetForecast} 
          isLoading={isLoading}
          useMockData={useMockData}
          onToggleMockData={setUseMockData}
        />
      ) : (
        <div ref={forecastRef}>
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
            currentMonthlyBill={monthlyBill}
            currentElectricityRate={electricityRate}
          />
          <div className="container mx-auto px-4 py-6">
            <SystemSpecsCard 
              roofArea={forecastData.roofArea} 
              systemSize={currentSystemSize}
              electricityRate={electricityRate}
              monthlyBill={monthlyBill}
            />
          </div>
          <SavingsBreakdown data={forecastData} electricityRate={electricityRate} />
          <AISummary data={forecastData} />
          <SolarFAQ data={forecastData} electricityRate={electricityRate} />
          <ChatSection />
        </div>
      )}
    </div>
  );
};

export default Index;
