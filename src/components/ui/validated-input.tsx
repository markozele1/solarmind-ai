import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ValidationRule, validateValue, isNumericInput } from "@/lib/solarValidation";
import { Info } from "lucide-react";

interface ValidatedInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  rule: ValidationRule;
  required?: boolean;
  className?: string;
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ id, value, onChange, rule, required = true, className }, ref) => {
    const [touched, setTouched] = React.useState(false);
    const validation = validateValue(value, rule);
    const showError = touched && !validation.isValid && required;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isNumericInput(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    };

    const handleBlur = () => {
      setTouched(true);
    };

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="flex items-center gap-1">
            {rule.label}
            {required && <span className="text-destructive">*</span>}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{rule.hint}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder={`${rule.default}`}
            className={cn(
              "pr-12",
              showError && "border-destructive focus-visible:ring-destructive"
            )}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
            {rule.unit}
          </span>
        </div>
        
        {showError && (
          <p className="text-sm text-destructive">
            {validation.error}
          </p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";
