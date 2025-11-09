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
    "Clear Sky": day.ghi_clear,
    Cloudy: day.ghi_cloudy,
  }));

  const todayData = data.days[0];

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

        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardHeader>
            <CardTitle>Global Horizontal Irradiance (GHI)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis label={{ value: "W/m²", angle: -90, position: "insideLeft" }} />
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
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" />
                Peak Sun Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.peakSunHours.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">hours/day</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sunrise className="h-4 w-4 text-primary" />
                Sunrise / Sunset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold flex items-center gap-2">
                <Sunrise className="h-4 w-4" />
                {todayData.sunrise}
              </div>
              <div className="text-lg font-bold flex items-center gap-2 mt-1">
                <Sunset className="h-4 w-4" />
                {todayData.sunset}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Energy Output
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.estimatedEnergy.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">kWh/day</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[var(--shadow-soft)] bg-gradient-to-br from-accent/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Leaf className="h-4 w-4 text-accent" />
                CO₂ Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{data.co2Savings.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">kg/day</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
