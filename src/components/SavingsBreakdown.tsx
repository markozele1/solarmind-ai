import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ForecastData } from "@/pages/Index";
import { DollarSign, TrendingUp, Leaf } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface SavingsBreakdownProps {
  data: ForecastData;
  electricityRate: number; // $/kWh
}

export const SavingsBreakdown = ({ data, electricityRate }: SavingsBreakdownProps) => {
  const dailyEnergy = data.today.estimatedEnergy;
  const dailySavings = dailyEnergy * electricityRate;
  const monthlySavings = dailySavings * 30;
  const yearlySavings = dailySavings * 365;
  const twentyFiveYearSavings = yearlySavings * 25;

  const estimatedSystemCost = data.roofArea * 200; // Rough estimate: $200/m²
  const paybackYears = estimatedSystemCost / yearlySavings;

  const yearlyCO2 = data.today.co2Savings * 365;
  const treesEquivalent = (yearlyCO2 / 21).toFixed(0); // A tree absorbs ~21kg CO2/year

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-accent/20 shadow-[var(--shadow-card)] bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Your Savings Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="money" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="money">Financial Savings</TabsTrigger>
                <TabsTrigger value="environmental">Environmental Impact</TabsTrigger>
              </TabsList>

              <TabsContent value="money" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Daily</p>
                    <p className="text-2xl font-bold text-accent">${dailySavings.toFixed(2)}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Monthly</p>
                    <p className="text-2xl font-bold text-accent">${monthlySavings.toFixed(0)}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Yearly</p>
                    <p className="text-2xl font-bold text-accent">${yearlySavings.toFixed(0)}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">25-Year Total</p>
                    <p className="text-2xl font-bold text-accent">${twentyFiveYearSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <TrendingUp className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Estimated Payback Period</p>
                    <p className="text-2xl font-bold text-primary">{paybackYears.toFixed(1)} years</p>
                    <p className="text-sm text-muted-foreground">
                      Based on estimated system cost of ${estimatedSystemCost.toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Calculations based on ${electricityRate.toFixed(2)}/kWh electricity rate. 
                  Actual savings may vary based on your location, energy usage, and system specifications.
                </p>
              </TabsContent>

              <TabsContent value="environmental" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <Leaf className="h-12 w-12 text-accent mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-1">Annual CO₂ Savings</p>
                    <p className="text-3xl font-bold text-accent">{yearlyCO2.toFixed(0)} kg</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-muted/50">
                    <p className="text-4xl mb-3">🌳</p>
                    <p className="text-sm text-muted-foreground mb-1">Equivalent Trees Planted</p>
                    <p className="text-3xl font-bold text-accent">{treesEquivalent}</p>
                    <p className="text-xs text-muted-foreground mt-2">per year</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <span className="text-2xl">🚗</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Miles Not Driven</p>
                      <p className="text-lg text-accent font-bold">
                        {(yearlyCO2 / 0.404).toLocaleString(undefined, { maximumFractionDigits: 0 })} miles/year
                      </p>
                      <p className="text-sm text-muted-foreground">
                        That's like driving from coast to coast {((yearlyCO2 / 0.404) / 3000).toFixed(1)} times!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <span className="text-2xl">♻️</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Plastic Bottles Recycled Equivalent</p>
                      <p className="text-lg text-accent font-bold">
                        {(yearlyCO2 * 55).toLocaleString(undefined, { maximumFractionDigits: 0 })} bottles/year
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Based on CO₂ savings from recycling vs. landfill
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
