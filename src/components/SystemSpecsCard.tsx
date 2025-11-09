import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SystemSpecsCardProps {
  roofArea: number;
  systemSize: number;
  electricityRate: number;
  monthlyBill?: number;
}

export const SystemSpecsCard = ({ 
  roofArea, 
  systemSize, 
  electricityRate, 
  monthlyBill 
}: SystemSpecsCardProps) => {
  const estimatedCost = roofArea * 200;
  const panelEfficiency = 18;
  
  return (
    <Card className="border-border bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Your System Overview</CardTitle>
        </div>
        <CardDescription>
          Assumptions used for calculations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Roof Area</p>
            <p className="font-semibold text-foreground">{roofArea} m²</p>
          </div>
          <div>
            <p className="text-muted-foreground">System Size</p>
            <p className="font-semibold text-foreground">{systemSize} kW</p>
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-muted-foreground">Panel Efficiency</p>
                    <p className="font-semibold text-foreground">{panelEfficiency}%</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Industry standard for modern solar panels</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div>
            <p className="text-muted-foreground">Electricity Rate</p>
            <p className="font-semibold text-foreground">${electricityRate.toFixed(2)}/kWh</p>
          </div>
          {monthlyBill && (
            <div>
              <p className="text-muted-foreground">Monthly Bill</p>
              <p className="font-semibold text-foreground">${monthlyBill}</p>
            </div>
          )}
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <p className="text-muted-foreground">Est. System Cost</p>
                    <p className="font-semibold text-foreground">${estimatedCost.toLocaleString()}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">Based on $200/m² industry average. Actual costs vary by location and installer.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-2 border-t border-border">
          * Estimates based on industry averages. Consult local installers for precise quotes.
        </p>
      </CardContent>
    </Card>
  );
};