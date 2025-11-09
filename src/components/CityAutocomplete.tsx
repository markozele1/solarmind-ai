import { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useCityAutocomplete, CityOption } from "@/hooks/useCityAutocomplete";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CityAutocompleteProps {
  onCitySelect: (city: CityOption | null) => void;
  selectedCity: CityOption | null;
}

export const CityAutocomplete = ({ onCitySelect, selectedCity }: CityAutocompleteProps) => {
  const { query, setQuery, options, isLoading, error } = useCityAutocomplete();
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowDropdown(true);
    setFocusedIndex(-1);
    if (!value) {
      onCitySelect(null);
    }
  };

  const handleSelectCity = (city: CityOption) => {
    onCitySelect(city);
    setQuery(city.display);
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || options.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < options.length) {
          handleSelectCity(options[focusedIndex]);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const displayValue = selectedCity ? selectedCity.display : query;
  const hasError = error && query.length >= 2 && !selectedCity;

  return (
    <div className="space-y-2 text-left relative" ref={dropdownRef}>
      <Label htmlFor="city">City</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id="city"
          type="text"
          placeholder="Start typing a city name..."
          value={displayValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-12 text-base pr-10",
            hasError && "border-destructive focus-visible:ring-destructive"
          )}
          autoComplete="off"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${city.lat}-${city.lon}`}
              type="button"
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setFocusedIndex(index)}
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
                focusedIndex === index && "bg-accent text-accent-foreground"
              )}
            >
              <div className="text-sm font-medium">{city.name}</div>
              <div className="text-xs text-muted-foreground">{city.country}</div>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {hasError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};
