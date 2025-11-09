import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ForecastData } from "@/pages/Index";
import { Sun, Sunrise, Sunset, Zap, Leaf, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ForecastDashboardProps {
  data: ForecastData;
  onRefresh: () => void;
}

export const ForecastDashboard = ({ data, onRefresh }: ForecastDashboardProps) => {
  const chartData = data.days.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    "Clear Sky": day.ghi_clear_kwh,
    Cloudy: day.ghi_cloudy_kwh,
  }));

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">{data.location}</h2>
            <p className="text-muted-foreground">7-Day Solar Forecast</p>
          </div>
          <Button onClick={onRefresh} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

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
            <CardTitle>Global Horizontal Irradiance (GHI) - 7 Days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis label={{ value: "kWh/m²", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Clear Sky"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="Cloudy"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--muted-foreground))" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center italic mt-2">
              Demo data based on last real Zagreb measurement.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
