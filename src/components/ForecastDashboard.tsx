import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ForecastData } from "@/pages/Index";
import { Sun, CloudSun, Cloud, CloudDrizzle, Sunrise, Sunset, RefreshCw, Settings, LucideIcon } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { SettingsDialog } from "./SettingsDialog";

interface ForecastDashboardProps {
  data: ForecastData;
  onRefresh: () => void;
  onUpdateSettings: (city: string, roofArea: number, systemSize: number) => void;
  isLoading: boolean;
  useMockData: boolean;
  onToggleMockData: (value: boolean) => void;
  currentCity: string;
  currentRoofArea: number;
  currentSystemSize: number;
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
        />

        {/* Today's Summary Card */}
        <Card className="border-primary/20 shadow-[var(--shadow-card)] bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-primary" />
              Today's Solar Potential
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sunlight Quality</p>
                <p className="text-2xl font-bold text-primary">{data.today.sunlightQuality.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">of clear-sky potential</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peak Sun Hours</p>
                <p className="text-2xl font-bold">{data.today.peakSunHours.toFixed(1)} h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Energy Output</p>
                <p className="text-2xl font-bold">{data.today.estimatedEnergy.toFixed(1)} kWh</p>
                <p className="text-xs text-muted-foreground">for {data.roofArea} m² roof, 20% efficiency</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CO₂ Avoided</p>
                <p className="text-2xl font-bold text-accent">{data.today.co2Savings.toFixed(1)} kg</p>
              </div>
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
          </CardContent>
        </Card>

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>7-Day Solar Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {data.days.map((day) => {
                  const date = new Date(day.date);
                  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
                  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  const intensity = getSunIntensity(day.ghi_cloudy_kwh, day.ghi_clear_kwh);
                  const IconComponent = intensity.icon;
                  
                  return (
                    <UITooltip key={day.date}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors cursor-pointer">
                          <p className="text-sm font-medium text-foreground mb-1">{dayName}</p>
                          <p className="text-xs text-muted-foreground mb-3">{dateStr}</p>
                          <IconComponent 
                            className="h-12 w-12 mb-2 text-primary transition-all" 
                            strokeWidth={2.5}
                            fill={intensity.fill ? "currentColor" : "none"}
                          />
                          <p className="text-xs font-medium text-muted-foreground">{intensity.label}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-sm space-y-1">
                          <p className="font-semibold">GHI: {day.ghi_cloudy_kwh.toFixed(1)} kWh/m²</p>
                          <p className="text-xs text-muted-foreground">Clear sky: {day.ghi_clear_kwh.toFixed(1)} kWh/m²</p>
                          <p className="text-xs text-muted-foreground">Quality: {intensity.label}</p>
                        </div>
                      </TooltipContent>
                    </UITooltip>
                  );
                })}
              </div>
            </TooltipProvider>
            <p className="text-xs text-muted-foreground text-center italic mt-4">
              Demo data based on last real London measurement.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
