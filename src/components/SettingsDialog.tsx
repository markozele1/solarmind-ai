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
  onSubmit: (city: string, roofArea: number, systemSize: number) => void;
  isLoading: boolean;
  useMockData: boolean;
  onToggleMockData: (value: boolean) => void;
  currentCity: string;
  currentRoofArea: number;
  currentSystemSize: number;
}

const MIN_ROOF_AREA = 1;
const MAX_ROOF_AREA = 100;
const MIN_SYSTEM_SIZE = 1;
const MAX_SYSTEM_SIZE = 20;

export const SettingsDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  useMockData,
  onToggleMockData,
  currentCity,
  currentRoofArea,
  currentSystemSize,
}: SettingsDialogProps) => {
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [roofArea, setRoofArea] = useState(currentRoofArea.toString());
  const [systemSize, setSystemSize] = useState(currentSystemSize.toString());
  const [roofAreaError, setRoofAreaError] = useState<string | null>(null);
  const [systemSizeError, setSystemSizeError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setRoofArea(currentRoofArea.toString());
      setSystemSize(currentSystemSize.toString());
      setRoofAreaError(null);
      setSystemSizeError(null);
      // Reset city to show current city name (without full location data)
      setSelectedCity(null);
    }
  }, [open, currentRoofArea, currentSystemSize]);

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
      onOpenChange(false);
    }
  };

  const isFormValid = selectedCity !== null && 
                      roofArea !== "" && 
                      systemSize !== "" && 
                      !roofAreaError && 
                      !systemSizeError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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

          <Button type="submit" className="w-full" disabled={isLoading || !isFormValid}>
            {isLoading ? "Loading..." : "Update Forecast"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
