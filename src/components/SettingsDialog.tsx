import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Database } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import { CityOption } from "@/hooks/useCityAutocomplete";
import { ValidatedInput } from "./ui/validated-input";
import { SOLAR_VALIDATION_RULES, validateValue } from "@/lib/solarValidation";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (city: string, roofArea: number, systemSize: number, panelEfficiency: number, systemCost: number) => void;
  onUpdateHomeParams?: (roofArea: number, systemSize: number, panelEfficiency: number, systemCost: number) => void;
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

export const SettingsDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onUpdateHomeParams,
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
}: SettingsDialogProps) => {
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [roofArea, setRoofArea] = useState(currentRoofArea.toString());
  const [systemSize, setSystemSize] = useState(currentSystemSize.toString());
  const [monthlyBill, setMonthlyBill] = useState(currentMonthlyBill.toString());
  const [electricityRate, setElectricityRate] = useState(currentElectricityRate.toString());
  const [panelEfficiency, setPanelEfficiency] = useState(currentPanelEfficiency.toString());
  const [systemCost, setSystemCost] = useState(currentSystemCost.toString());

  useEffect(() => {
    if (open) {
      setRoofArea(currentRoofArea.toString());
      setSystemSize(currentSystemSize.toString());
      setMonthlyBill(currentMonthlyBill.toString());
      setElectricityRate(currentElectricityRate.toString());
      setPanelEfficiency(currentPanelEfficiency.toString());
      setSystemCost(currentSystemCost.toString());
      setSelectedCity(null);
    }
  }, [open, currentRoofArea, currentSystemSize, currentMonthlyBill, currentElectricityRate, currentPanelEfficiency, currentSystemCost]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Store updated values in sessionStorage
    sessionStorage.setItem('monthlyBill', monthlyBill);
    sessionStorage.setItem('electricityRate', electricityRate);
    sessionStorage.setItem('panelEfficiency', panelEfficiency);
    sessionStorage.setItem('systemCost', systemCost);

    if (selectedCity) {
      // Full update with new location (triggers weather API)
      onSubmit(selectedCity.name, parseFloat(roofArea), parseFloat(systemSize), parseFloat(panelEfficiency), parseFloat(systemCost));
    } else if (onUpdateHomeParams) {
      // Update only home parameters (no weather API call)
      onUpdateHomeParams(parseFloat(roofArea), parseFloat(systemSize), parseFloat(panelEfficiency), parseFloat(systemCost));
    }
    
    onOpenChange(false);
  };

  const isFormValid = 
    validateValue(roofArea, SOLAR_VALIDATION_RULES.roofArea).isValid &&
    validateValue(systemSize, SOLAR_VALIDATION_RULES.systemSize).isValid &&
    validateValue(panelEfficiency, SOLAR_VALIDATION_RULES.panelEfficiency).isValid &&
    validateValue(systemCost, SOLAR_VALIDATION_RULES.systemCost).isValid &&
    validateValue(electricityRate, SOLAR_VALIDATION_RULES.electricityRate).isValid &&
    validateValue(monthlyBill, SOLAR_VALIDATION_RULES.monthlyBill).isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Update your location and solar system parameters
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div className="text-left">
                <Label htmlFor="data-mode-settings" className="text-sm font-semibold">
                  {useMockData ? "Mock Data" : "Live API Data"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {useMockData ? "Using cached London data" : "Fetching from OpenWeather API"}
                </p>
              </div>
            </div>
            <Switch
              id="data-mode-settings"
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
              id="settings-roofArea"
              value={roofArea}
              onChange={setRoofArea}
              rule={SOLAR_VALIDATION_RULES.roofArea}
            />

            <ValidatedInput
              id="settings-systemSize"
              value={systemSize}
              onChange={setSystemSize}
              rule={SOLAR_VALIDATION_RULES.systemSize}
            />

            <ValidatedInput
              id="settings-panelEfficiency"
              value={panelEfficiency}
              onChange={setPanelEfficiency}
              rule={SOLAR_VALIDATION_RULES.panelEfficiency}
            />

            <ValidatedInput
              id="settings-systemCost"
              value={systemCost}
              onChange={setSystemCost}
              rule={SOLAR_VALIDATION_RULES.systemCost}
            />

            <ValidatedInput
              id="settings-monthlyBill"
              value={monthlyBill}
              onChange={setMonthlyBill}
              rule={SOLAR_VALIDATION_RULES.monthlyBill}
            />

            <ValidatedInput
              id="settings-electricityRate"
              value={electricityRate}
              onChange={setElectricityRate}
              rule={SOLAR_VALIDATION_RULES.electricityRate}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
            {isLoading ? "Loading..." : selectedCity ? "Update Forecast" : "Update Settings"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
