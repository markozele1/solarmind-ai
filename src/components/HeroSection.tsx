import { useState } from "react";
import { Sun, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface HeroSectionProps {
  onSubmit: (city: string, roofArea: number, systemSize: number) => void;
  isLoading: boolean;
  useMockData: boolean;
  onToggleMockData: (value: boolean) => void;
}

export const HeroSection = ({ onSubmit, isLoading, useMockData, onToggleMockData }: HeroSectionProps) => {
  const [city, setCity] = useState("");
  const [roofArea, setRoofArea] = useState("10");
  const [systemSize, setSystemSize] = useState("5");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSubmit(city, parseFloat(roofArea), parseFloat(systemSize));
    }
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary to-solar-glow shadow-[0_0_40px_hsl(var(--solar-glow)/0.3)]">
            <Sun className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-solar-glow bg-clip-text text-transparent">
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
                  {useMockData ? "Using cached Zagreb data" : "Fetching from OpenWeather API"}
                </p>
              </div>
            </div>
            <Switch
              id="data-mode"
              checked={!useMockData}
              onCheckedChange={(checked) => onToggleMockData(!checked)}
            />
          </div>

          <div className="space-y-2 text-left">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 text-left">
              <Label htmlFor="roofArea">Roof Area (m²)</Label>
              <Input
                id="roofArea"
                type="number"
                min="1"
                step="0.1"
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="systemSize">System Size (kW)</Label>
              <Input
                id="systemSize"
                type="number"
                min="0.1"
                step="0.1"
                value={systemSize}
                onChange={(e) => setSystemSize(e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-solar-glow hover:opacity-90 transition-opacity"
          >
            {isLoading ? "Analyzing Sunlight..." : "Show My Sunlight"}
          </Button>
        </form>
      </div>
    </section>
  );
};
