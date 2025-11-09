export interface EnergyAnalogy {
  text: string;
  icon: string;
}

export const getEnergyAnalogies = (kWh: number): EnergyAnalogy[] => {
  const analogies: EnergyAnalogy[] = [];

  // Refrigerator analogy
  const fridgeDays = Math.floor(kWh / 1.2);
  if (fridgeDays > 0) {
    analogies.push({
      text: `Power a refrigerator for ${fridgeDays} ${fridgeDays === 1 ? 'day' : 'days'}`,
      icon: "🧊"
    });
  }

  // Laptop analogy
  const laptopHours = Math.floor(kWh / 0.1);
  if (laptopHours > 0) {
    analogies.push({
      text: `Run your laptop for ${laptopHours} hours`,
      icon: "💻"
    });
  }

  // Phone charging analogy
  const phoneCharges = Math.floor(kWh / 0.02);
  if (phoneCharges > 0) {
    analogies.push({
      text: `Charge ${phoneCharges} smartphones fully`,
      icon: "📱"
    });
  }

  // WiFi router analogy
  const routerDays = Math.floor(kWh / 0.24);
  if (routerDays > 0) {
    analogies.push({
      text: `Power your WiFi router for ${routerDays} ${routerDays === 1 ? 'day' : 'days'}`,
      icon: "📡"
    });
  }

  // LED bulb analogy
  const ledHours = Math.floor(kWh / 0.01);
  if (ledHours > 0) {
    analogies.push({
      text: `Light an LED bulb for ${ledHours} hours`,
      icon: "💡"
    });
  }

  // TV analogy
  const tvHours = Math.floor(kWh / 0.15);
  if (tvHours > 0) {
    analogies.push({
      text: `Watch TV for ${tvHours} hours`,
      icon: "📺"
    });
  }

  // Return up to 3 most relatable analogies
  return analogies.slice(0, 3);
};

export const getCO2Analogies = (co2Kg: number): EnergyAnalogy[] => {
  const analogies: EnergyAnalogy[] = [];

  // Trees planted analogy
  const trees = (co2Kg / 21).toFixed(1); // A tree absorbs ~21kg CO2/year
  analogies.push({
    text: `Equivalent to ${trees} ${parseFloat(trees) === 1 ? 'tree' : 'trees'} planted`,
    icon: "🌳"
  });

  // Miles driven analogy
  const miles = (co2Kg / 0.404).toFixed(0); // Average car emits ~0.404 kg CO2/mile
  if (parseFloat(miles) > 0) {
    analogies.push({
      text: `Same as not driving ${miles} miles`,
      icon: "🚗"
    });
  }

  // Cars off road analogy
  const carsPerDay = (co2Kg / 10.6).toFixed(1); // Average car emits ~10.6 kg CO2/day
  if (parseFloat(carsPerDay) > 0) {
    analogies.push({
      text: `Like taking ${carsPerDay} ${parseFloat(carsPerDay) === 1 ? 'car' : 'cars'} off the road for a day`,
      icon: "🚙"
    });
  }

  return analogies;
};

export const getHouseholdComparison = (kWh: number): string => {
  const avgDailyHouseholdUse = 30; // kWh
  const percentage = ((kWh / avgDailyHouseholdUse) * 100).toFixed(0);
  const hours = ((kWh / avgDailyHouseholdUse) * 24).toFixed(1);
  
  if (parseFloat(percentage) >= 100) {
    return `This could power an average home for ${(kWh / avgDailyHouseholdUse).toFixed(1)} days! ⚡`;
  } else {
    return `This can power an average home for ${hours} hours ⚡`;
  }
};
