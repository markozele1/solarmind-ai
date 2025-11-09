import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ForecastData } from "@/pages/Index";
import { Sun, CloudSun, Cloud, CloudDrizzle, Sunrise, Sunset, RefreshCw, Settings, LucideIcon, Lightbulb } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { SettingsDialog } from "./SettingsDialog";
import { getEnergyAnalogies, getCO2Analogies, getHouseholdComparison } from "@/lib/energyAnalogies";

interface ForecastDashboardProps {
  data: ForecastData;
  onRefresh: () => void;
  onUpdateSettings: (city: string, roofArea: number, systemSize: number, panelEfficiency: number, systemCost: number) => void;
  isLoading: boolean;
  useMockData: boolean;
  onToggleMockData: (value: boolean) => void;
  currentCity: string;
  currentRoofArea: number;
  currentSystemSize: number;
  currentMonthlyBill: number;
  currentElectricityRate: number;
  currentPanelEfficiency: number;
  currentSystemCost: number;
}

export const ForecastDashboard = ({ 
  data, 
  onRefresh, 
  onUpdateSettings, 
  isLoading,
  useMockData,
  onToggleMockData,
  currentCity,
  currentRoofArea,
  currentSystemSize,
  currentMonthlyBill,
  currentElectricityRate,
  currentPanelEfficiency,
  currentSystemCost,
}: ForecastDashboardProps) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const getSunIntensity = (ghiCloudy: number, ghiClear: number) => {
    const percentage = (ghiCloudy / ghiClear) * 100;
    if (percentage >= 80) return { icon: Sun, label: "Excellent", fill: true };
    if (percentage >= 60) return { icon: CloudSun, label: "Very Good", fill: false };
    if (percentage >= 40) return { icon: CloudSun, label: "Good", fill: false };
    if (percentage >= 20) return { icon: Cloud, label: "Fair", fill: false };
    return { icon: CloudDrizzle, label: "Poor", fill: false };
  };

  const energyAnalogies = getEnergyAnalogies(data.today.estimatedEnergy);
  const co2Analogies = getCO2Analogies(data.today.co2Savings);
  const householdComparison = getHouseholdComparison(data.today.estimatedEnergy);

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with SolarMind branding */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SolarMind
            </h1>
            <p className="text-lg text-muted-foreground mt-1">{data.location}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={onRefresh} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setSettingsOpen(true)} variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          onSubmit={onUpdateSettings}
          isLoading={isLoading}
          useMockData={useMockData}
          onToggleMockData={onToggleMockData}
          currentCity={currentCity}
          currentRoofArea={currentRoofArea}
          currentSystemSize={currentSystemSize}
          currentMonthlyBill={currentMonthlyBill}
          currentElectricityRate={currentElectricityRate}
          currentPanelEfficiency={currentPanelEfficiency}
          currentSystemCost={currentSystemCost}
        />

        {/* Today's Summary Card */}
        <Card className="border-primary/20 shadow-[var(--shadow-card)] bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              Today's Solar Potential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <p className="text-sm text-muted-foreground">Location Rating</p>
                      <p className="text-2xl font-bold text-primary">{data.today.sunlightQuality >= 80 ? 'Excellent' : data.today.sunlightQuality >= 60 ? 'Very Good' : data.today.sunlightQuality >= 40 ? 'Good' : 'Fair'}</p>
                      <p className="text-xs text-muted-foreground">{data.today.sunlightQuality.toFixed(0)}% of ideal</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">How good this location is for solar energy based on today's conditions compared to perfect clear-sky conditions.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <p className="text-sm text-muted-foreground">Today's Efficiency</p>
                      <p className="text-2xl font-bold text-primary">{data.today.sunlightQuality.toFixed(1)}%</p>
                      <p className="text-xs text-muted-foreground">vs. clear sky</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">The percentage of maximum possible solar irradiance reaching your panels today, accounting for cloud cover and atmospheric conditions.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <p className="text-sm text-muted-foreground">Energy Output</p>
                      <p className="text-2xl font-bold">{data.today.estimatedEnergy.toFixed(1)} kWh</p>
                      <p className="text-xs text-muted-foreground">for {data.roofArea} m² roof, 20% efficiency</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Kilowatt-hour (kWh): The amount of energy used by a 1000-watt appliance running for 1 hour. Your expected daily solar energy generation.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <p className="text-sm text-muted-foreground">CO₂ Avoided</p>
                      <p className="text-2xl font-bold text-accent">{data.today.co2Savings.toFixed(1)} kg</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Carbon dioxide emissions prevented by using solar energy instead of grid electricity (typically from fossil fuels).</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-help">
                      <p className="text-sm text-muted-foreground">Peak Sun Hours</p>
                      <p className="text-2xl font-bold">{data.today.peakSunHours.toFixed(1)} h</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Hours of maximum solar intensity (1000 W/m²) your panels receive. This is the industry standard for comparing solar potential.</p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>

              <div>
                <p className="text-sm text-muted-foreground">Sunrise</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <Sunrise className="h-4 w-4" />
                  {data.today.sunrise}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sunset</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <Sunset className="h-4 w-4" />
                  {data.today.sunset}
                </p>
              </div>
            </div>

            {/* What This Means For You Section */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold">What This Means For You</h3>
              </div>
              
              <div className="space-y-4">
                {/* Household Comparison */}
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-base font-medium text-foreground">{householdComparison}</p>
                </div>

                {/* Energy Analogies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {energyAnalogies.map((analogy, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                      <span className="text-2xl">{analogy.icon}</span>
                      <p className="text-sm text-foreground pt-1">{analogy.text}</p>
                    </div>
                  ))}
                </div>

                {/* CO2 Analogies */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Environmental Impact:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {co2Analogies.map((analogy, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <span className="text-2xl">{analogy.icon}</span>
                        <p className="text-sm text-foreground pt-1">{analogy.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>7-Day Solar Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {data.days.map((day) => {
                const date = new Date(day.date);
                const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const intensity = getSunIntensity(day.ghi_cloudy_kwh, day.ghi_clear_kwh);
                const IconComponent = intensity.icon;
                
                return (
                  <div key={day.date} className="flex flex-col items-center p-4 rounded-lg border border-border">
                    <p className="text-sm font-medium text-foreground mb-1">{dayName}</p>
                    <p className="text-xs text-muted-foreground mb-3">{dateStr}</p>
                    <IconComponent 
                      className="h-12 w-12 mb-2 text-primary" 
                      strokeWidth={2.5}
                      fill={intensity.fill ? "currentColor" : "none"}
                    />
                    <p className="text-xs font-medium text-muted-foreground mb-2">{intensity.label}</p>
                    <p className="text-xs font-semibold text-foreground">{day.ghi_cloudy_kwh.toFixed(1)} kWh/m²</p>
                  </div>
                );
              })}
            </div>
            {useMockData && (
              <p className="text-xs text-muted-foreground text-center italic mt-4">
                Demo data based on last real London measurement.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
