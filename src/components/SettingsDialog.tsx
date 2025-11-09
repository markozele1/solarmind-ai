import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Database } from "lucide-react";
import { CityAutocomplete } from "./CityAutocomplete";
import { CityOption } from "@/hooks/useCityAutocomplete";

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

const MIN_ROOF_AREA = 1;
const MAX_ROOF_AREA = 100;
const MIN_SYSTEM_SIZE = 1;
const MAX_SYSTEM_SIZE = 20;

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
  const [roofAreaError, setRoofAreaError] = useState<string | null>(null);
  const [systemSizeError, setSystemSizeError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setRoofArea(currentRoofArea.toString());
      setSystemSize(currentSystemSize.toString());
      setMonthlyBill(currentMonthlyBill.toString());
      setElectricityRate(currentElectricityRate.toString());
      setPanelEfficiency(currentPanelEfficiency.toString());
      setSystemCost(currentSystemCost.toString());
      setRoofAreaError(null);
      setSystemSizeError(null);
      // Reset city to show current city name (without full location data)
      setSelectedCity(null);
    }
  }, [open, currentRoofArea, currentSystemSize, currentMonthlyBill, currentElectricityRate, currentPanelEfficiency, currentSystemCost]);

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
    
    if (!isRoofAreaValid || !isSystemSizeValid) {
      return;
    }

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

  const isFormValid = roofArea !== "" && 
                      systemSize !== "" && 
                      !roofAreaError && 
                      !systemSizeError;

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
          
          <div className="space-y-2">
            <Label htmlFor="roofArea">Roof Area (m²)</Label>
            <Input
              id="roofArea"
              type="number"
              min={MIN_ROOF_AREA}
              max={MAX_ROOF_AREA}
              step="0.1"
              value={roofArea}
              onChange={(e) => handleRoofAreaChange(e.target.value)}
              className={roofAreaError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {roofAreaError && (
              <p className="text-sm text-destructive">{roofAreaError}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="systemSize">System Size (kW)</Label>
            <Input
              id="systemSize"
              type="number"
              min={MIN_SYSTEM_SIZE}
              max={MAX_SYSTEM_SIZE}
              step="0.1"
              value={systemSize}
              onChange={(e) => handleSystemSizeChange(e.target.value)}
              className={systemSizeError ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {systemSizeError && (
              <p className="text-sm text-destructive">{systemSizeError}</p>
            )}
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <p className="text-sm text-muted-foreground">Optional: For more accurate savings estimates</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyBill">Monthly Electricity Bill (€)</Label>
                <Input
                  id="monthlyBill"
                  type="number"
                  min={0}
                  step={10}
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="electricityRate">Electricity Rate (€/kWh)</Label>
                <Input
                  id="electricityRate"
                  type="number"
                  min={0}
                  step={0.01}
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(e.target.value)}
                  placeholder="0.15"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="panelEfficiency">Panel Efficiency (%)</Label>
                <Input
                  id="panelEfficiency"
                  type="number"
                  min={10}
                  max={30}
                  step={0.1}
                  value={panelEfficiency}
                  onChange={(e) => setPanelEfficiency(e.target.value)}
                  placeholder="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemCost">Est. System Cost (€)</Label>
                <Input
                  id="systemCost"
                  type="number"
                  min={0}
                  step={100}
                  value={systemCost}
                  onChange={(e) => setSystemCost(e.target.value)}
                  placeholder="2000"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
            {isLoading ? "Loading..." : selectedCity ? "Update Forecast" : "Update Settings"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
