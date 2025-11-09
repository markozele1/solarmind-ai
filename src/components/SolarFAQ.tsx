import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HelpCircle } from "lucide-react";
import { ForecastData } from "@/pages/Index";

interface SolarFAQProps {
  data: ForecastData;
  electricityRate: number;
}

export const SolarFAQ = ({ data, electricityRate }: SolarFAQProps) => {
  const yearlySavings = data.today.estimatedEnergy * electricityRate * 365;
  const estimatedSystemCost = data.roofArea * 200;
  const paybackYears = estimatedSystemCost / yearlySavings;

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              Why Go Solar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="savings">
                <AccordionTrigger>How much can solar save me annually?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    Based on your location in <strong>{data.location}</strong> and a roof area of <strong>{data.roofArea} m²</strong>, 
                    you could save approximately <strong className="text-accent">${yearlySavings.toFixed(0)} per year</strong> on electricity costs.
                  </p>
                  <p className="text-muted-foreground">
                    This calculation assumes an electricity rate of ${electricityRate.toFixed(2)}/kWh. 
                    Your actual savings may be higher or lower depending on your energy consumption patterns, 
                    local utility rates, and available incentives.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payback">
                <AccordionTrigger>What's the typical payback period?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    For your system, the estimated payback period is approximately <strong className="text-primary">
                    {paybackYears.toFixed(1)} years</strong>.
                  </p>
                  <p className="text-muted-foreground">
                    This is based on an estimated system cost of ${estimatedSystemCost.toLocaleString()} 
                    (roughly $200 per m² of roof area). The actual payback period depends on:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Installation costs in your area</li>
                    <li>Available tax credits and incentives (which can reduce costs by 30% or more)</li>
                    <li>Your electricity rates and usage patterns</li>
                    <li>System efficiency and quality of components</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="lifespan">
                <AccordionTrigger>How long do solar panels last?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    Modern solar panels typically come with <strong>25-30 year warranties</strong> and can last 
                    even longer with proper maintenance.
                  </p>
                  <p className="text-muted-foreground">
                    Most panels maintain 80-90% of their original efficiency after 25 years. Over this period, 
                    based on your forecast, you could save approximately <strong className="text-accent">
                    ${(yearlySavings * 25).toLocaleString()}</strong> in electricity costs.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cloudy">
                <AccordionTrigger>What happens on cloudy days?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    Solar panels still generate electricity on cloudy days, though at reduced efficiency. 
                    Your forecast already accounts for typical cloud coverage in {data.location}.
                  </p>
                  <p className="text-muted-foreground mb-2">
                    Today's sunlight quality is <strong>{data.today.sunlightQuality.toFixed(0)}%</strong> of 
                    clear-sky potential, and you're still expected to generate <strong>
                    {data.today.estimatedEnergy.toFixed(1)} kWh</strong>.
                  </p>
                  <p className="text-muted-foreground">
                    For consistent power supply, most homeowners either:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Stay connected to the grid (net metering)</li>
                    <li>Install battery storage systems</li>
                    <li>Use a hybrid approach</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="grid">
                <AccordionTrigger>Can I sell excess energy back to the grid?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    Yes! Most areas offer <strong>net metering</strong> programs that allow you to sell 
                    excess solar energy back to your utility company.
                  </p>
                  <p className="text-muted-foreground mb-2">
                    When your panels produce more electricity than you use, the excess is fed back into the grid, 
                    and you receive credits on your electricity bill. These credits can offset the cost of power 
                    you draw from the grid at night or on cloudy days.
                  </p>
                  <p className="text-muted-foreground">
                    Check with your local utility company for specific net metering policies and rates in your area, 
                    as programs vary by location.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="maintenance">
                <AccordionTrigger>How much maintenance do solar panels require?</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground mb-2">
                    Solar panels are extremely low-maintenance. They have no moving parts and are designed 
                    to withstand harsh weather conditions.
                  </p>
                  <p className="text-muted-foreground">
                    Typical maintenance includes:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                    <li>Occasional cleaning (rain often does this naturally)</li>
                    <li>Annual inspection to check connections and mounting</li>
                    <li>Monitoring system performance through apps</li>
                    <li>Inverter replacement after 10-15 years (usually under warranty)</li>
                  </ul>
                  <p className="text-muted-foreground mt-2">
                    Most homeowners spend less than $150 per year on solar panel maintenance.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
