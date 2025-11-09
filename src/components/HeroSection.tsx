import { useState } from "react";
import { Sun, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { AnimatedSolarBackground } from "./AnimatedSolarBackground";
import { CityAutocomplete } from "./CityAutocomplete";
import { CityOption } from "@/hooks/useCityAutocomplete";
import { ValidatedInput } from "./ui/validated-input";
import { SOLAR_VALIDATION_RULES, validateValue } from "@/lib/solarValidation";

interface HeroSectionProps {
  onSubmit: (city: string, roofArea: number, systemSize: number) => void;
  isLoading: boolean;
  useMockData: boolean;
  onToggleMockData: (value: boolean) => void;
}

export const HeroSection = ({ onSubmit, isLoading, useMockData, onToggleMockData }: HeroSectionProps) => {
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [roofArea, setRoofArea] = useState(String(SOLAR_VALIDATION_RULES.roofArea.default));
  const [systemSize, setSystemSize] = useState(String(SOLAR_VALIDATION_RULES.systemSize.default));
  const [panelEfficiency, setPanelEfficiency] = useState(String(SOLAR_VALIDATION_RULES.panelEfficiency.default));
  const [systemCost, setSystemCost] = useState(String(SOLAR_VALIDATION_RULES.systemCost.default));
  const [monthlyBill, setMonthlyBill] = useState(String(SOLAR_VALIDATION_RULES.monthlyBill.default));
  const [electricityRate, setElectricityRate] = useState(String(SOLAR_VALIDATION_RULES.electricityRate.default));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCity) return;

    // Store additional data in sessionStorage for use in other components
    sessionStorage.setItem('monthlyBill', monthlyBill);
    sessionStorage.setItem('electricityRate', electricityRate);
    sessionStorage.setItem('panelEfficiency', panelEfficiency);
    sessionStorage.setItem('systemCost', systemCost);
    
    onSubmit(selectedCity.name, parseFloat(roofArea), parseFloat(systemSize));
  };

  const isFormValid = 
    selectedCity && 
    validateValue(roofArea, SOLAR_VALIDATION_RULES.roofArea).isValid &&
    validateValue(systemSize, SOLAR_VALIDATION_RULES.systemSize).isValid &&
    validateValue(panelEfficiency, SOLAR_VALIDATION_RULES.panelEfficiency).isValid &&
    validateValue(systemCost, SOLAR_VALIDATION_RULES.systemCost).isValid &&
    validateValue(electricityRate, SOLAR_VALIDATION_RULES.electricityRate).isValid &&
    validateValue(monthlyBill, SOLAR_VALIDATION_RULES.monthlyBill).isValid;

  return (
    <section className="relative container mx-auto px-4 py-16 md:py-24">
      <AnimatedSolarBackground />
      <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary to-solar-glow shadow-[0_0_40px_hsl(var(--solar-glow)/0.3)] animate-[spin_8s_linear_infinite]">
            <Sun className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-primary animate-[fade-in_0.6s_ease-out_0.2s_both]">
          Discover Your Solar Potential
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-[fade-in_0.6s_ease-out_0.4s_both]">
          Harness the power of AI and real-time solar data to understand how much clean energy your roof can generate
        </p>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-[var(--shadow-card)] p-8 space-y-6 border border-border animate-[fade-in_0.6s_ease-out_0.6s_both]">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ValidatedInput
              id="roofArea"
              value={roofArea}
              onChange={setRoofArea}
              rule={SOLAR_VALIDATION_RULES.roofArea}
            />

            <ValidatedInput
              id="systemSize"
              value={systemSize}
              onChange={setSystemSize}
              rule={SOLAR_VALIDATION_RULES.systemSize}
            />

            <ValidatedInput
              id="panelEfficiency"
              value={panelEfficiency}
              onChange={setPanelEfficiency}
              rule={SOLAR_VALIDATION_RULES.panelEfficiency}
            />

            <ValidatedInput
              id="systemCost"
              value={systemCost}
              onChange={setSystemCost}
              rule={SOLAR_VALIDATION_RULES.systemCost}
            />

            <ValidatedInput
              id="monthlyBill"
              value={monthlyBill}
              onChange={setMonthlyBill}
              rule={SOLAR_VALIDATION_RULES.monthlyBill}
            />

            <ValidatedInput
              id="electricityRate"
              value={electricityRate}
              onChange={setElectricityRate}
              rule={SOLAR_VALIDATION_RULES.electricityRate}
            />
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
