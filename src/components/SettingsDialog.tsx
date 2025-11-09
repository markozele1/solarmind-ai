import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";

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
  const [city, setCity] = useState(currentCity);
  const [roofArea, setRoofArea] = useState(currentRoofArea.toString());
  const [systemSize, setSystemSize] = useState(currentSystemSize.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(city, parseFloat(roofArea), parseFloat(systemSize));
    onOpenChange(false);
  };

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
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              placeholder="e.g., Zagreb"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roofArea">Roof Area (m²)</Label>
            <Input
              id="roofArea"
              type="number"
              placeholder="e.g., 50"
              value={roofArea}
              onChange={(e) => setRoofArea(e.target.value)}
              required
              min="1"
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="systemSize">System Size (kW)</Label>
            <Input
              id="systemSize"
              type="number"
              placeholder="e.g., 5"
              value={systemSize}
              onChange={(e) => setSystemSize(e.target.value)}
              required
              min="0.1"
              step="0.1"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="mockData" className="cursor-pointer">
              Use Mock Data
            </Label>
            <Switch
              id="mockData"
              checked={useMockData}
              onCheckedChange={onToggleMockData}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : "Update Forecast"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
