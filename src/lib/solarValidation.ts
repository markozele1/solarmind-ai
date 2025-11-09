export interface ValidationRule {
  min: number;
  max: number;
  default: number;
  unit: string;
  hint: string;
  label: string;
}

export const SOLAR_VALIDATION_RULES: Record<string, ValidationRule> = {
  roofArea: {
    min: 5,
    max: 300,
    default: 40,
    unit: "m²",
    hint: "Typical home roof 20–60 m²",
    label: "Roof Area"
  },
  systemSize: {
    min: 1,
    max: 100,
    default: 5,
    unit: "kW",
    hint: "Typical system 3–10 kW",
    label: "System Size"
  },
  monthlyBill: {
    min: 10,
    max: 1000,
    default: 60,
    unit: "€",
    hint: "Average household ≈ 60 €/month",
    label: "Monthly Electricity Bill"
  },
  electricityRate: {
    min: 0.05,
    max: 1.00,
    default: 0.20,
    unit: "€/kWh",
    hint: "Typical rate 0.10–0.30 €/kWh",
    label: "Electricity Rate"
  },
  panelEfficiency: {
    min: 10,
    max: 30,
    default: 20,
    unit: "%",
    hint: "Modern panels 18–22% efficiency",
    label: "Panel Efficiency"
  },
  systemCost: {
    min: 500,
    max: 200000,
    default: 7000,
    unit: "€",
    hint: "Approx. 800–1500 €/kW installed",
    label: "Estimated System Cost"
  }
};

export function validateValue(value: string, rule: ValidationRule): { isValid: boolean; error?: string } {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue) || value.trim() === '') {
    return { isValid: false, error: `Please enter a valid number` };
  }
  
  if (numValue < rule.min || numValue > rule.max) {
    return { isValid: false, error: `Value must be between ${rule.min} and ${rule.max}` };
  }
  
  return { isValid: true };
}

export function isNumericInput(key: string): boolean {
  // Allow: numbers, decimal point, backspace, delete, tab, escape, enter, arrows
  return /^[0-9.]$/.test(key) || 
         ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key);
}
