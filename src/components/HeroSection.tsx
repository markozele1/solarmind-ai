import { useState } from "react";
import { Sun, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { AnimatedSolarBackground } from "./AnimatedSolarBackground";
import { CityAutocomplete } from "./CityAutocomplete";
import { CityOption } from "@/hooks/useCityAutocomplete";

interface HeroSectionProps {
  onSubmit: (city: string, roofArea: number, systemSize: number) => void;
  isLoading: boolean;
  useMockData: boolean;
  onToggleMockData: (value: boolean) => void;
}

const MIN_ROOF_AREA = 1;
const MAX_ROOF_AREA = 100;
const MIN_SYSTEM_SIZE = 1;
const MAX_SYSTEM_SIZE = 20;

export const HeroSection = ({ onSubmit, isLoading, useMockData, onToggleMockData }: HeroSectionProps) => {
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [roofArea, setRoofArea] = useState("10");
  const [systemSize, setSystemSize] = useState("5");
  const [roofAreaError, setRoofAreaError] = useState<string | null>(null);
  const [systemSizeError, setSystemSizeError] = useState<string | null>(null);

  const validateRoofArea = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < MIN_ROOF_AREA || num > MAX_ROOF_AREA) {
      setRoofAreaError(`Roof area must be between ${MIN_ROOF_AREA} m² and ${MAX_ROOF_AREA} m².`);
      return false;
    }
    setRoofAreaError(null);
    return true;
  };

  const validateSystemSize = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < MIN_SYSTEM_SIZE || num > MAX_SYSTEM_SIZE) {
      setSystemSizeError(`System size must be between ${MIN_SYSTEM_SIZE} kW and ${MAX_SYSTEM_SIZE} kW.`);
      return false;
    }
    setSystemSizeError(null);
    return true;
  };

  const handleRoofAreaChange = (value: string) => {
    setRoofArea(value);
    if (value) validateRoofArea(value);
  };

  const handleSystemSizeChange = (value: string) => {
    setSystemSize(value);
    if (value) validateSystemSize(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const isRoofAreaValid = validateRoofArea(roofArea);
    const isSystemSizeValid = validateSystemSize(systemSize);
    
    if (selectedCity && isRoofAreaValid && isSystemSizeValid) {
      onSubmit(selectedCity.name, parseFloat(roofArea), parseFloat(systemSize));
    }
  };

  const isFormValid = selectedCity !== null && 
                      roofArea !== "" && 
                      systemSize !== "" && 
                      !roofAreaError && 
                      !systemSizeError;

  return (
    <section className="relative container mx-auto px-4 py-16 md:py-24">
      <AnimatedSolarBackground />
      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary to-solar-glow shadow-[0_0_40px_hsl(var(--solar-glow)/0.3)]">
            <Sun className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-primary">
          Discover Your Solar Potential
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Harness the power of AI and real-time solar data to understand how much clean energy your roof can generate
        </p>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-[var(--shadow-card)] p-8 space-y-6 border border-border">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <Label htmlFor="data-mode" className="text-sm font-semibold">
                  {useMockData ? "Mock Data" : "Live API Data"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {useMockData ? "Using cached London data" : "Fetching from OpenWeather API"}
                </p>
              </div>
            </div>
            <Switch
              id="data-mode"
              checked={!useMockData}
              onCheckedChange={(checked) => onToggleMockData(!checked)}
            />
          </div>

          <CityAutocomplete
            selectedCity={selectedCity}
            onCitySelect={setSelectedCity}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="roofArea">Roof Area (m²)</Label>
              <Input
                id="roofArea"
                type="number"
                min={MIN_ROOF_AREA}
                max={MAX_ROOF_AREA}
                step="0.1"
                value={roofArea}
                onChange={(e) => handleRoofAreaChange(e.target.value)}
                className={`h-12 text-base ${roofAreaError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {roofAreaError && (
                <p className="text-sm text-destructive">{roofAreaError}</p>
              )}
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="systemSize">System Size (kW)</Label>
              <Input
                id="systemSize"
                type="number"
                min={MIN_SYSTEM_SIZE}
                max={MAX_SYSTEM_SIZE}
                step="0.1"
                value={systemSize}
                onChange={(e) => handleSystemSizeChange(e.target.value)}
                className={`h-12 text-base ${systemSizeError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {systemSizeError && (
                <p className="text-sm text-destructive">{systemSizeError}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-solar-glow hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? "Analyzing Sunlight..." : "Show My Sunlight"}
          </Button>
        </form>
      </div>
    </section>
  );
};
