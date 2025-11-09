import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
  display: string;
}

export const useCityAutocomplete = () => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<{ query: string; options: CityOption[]; timestamp: number } | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setOptions([]);
      setError(null);
      return;
    }

    // Check cache (10 seconds)
    if (cacheRef.current && 
        cacheRef.current.query === searchQuery && 
        Date.now() - cacheRef.current.timestamp < 10000) {
      setOptions(cacheRef.current.options);
      return;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('geocoding', {
        body: { query: searchQuery },
        signal: abortControllerRef.current.signal,
      });

      if (fnError) throw fnError;

      const cities: CityOption[] = (data || []).map((city: any) => ({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        display: `${city.name}, ${city.country}`,
      }));

      setOptions(cities);
      
      // Update cache
      cacheRef.current = {
        query: searchQuery,
        options: cities,
        timestamp: Date.now(),
      };

      if (cities.length === 0) {
        setError("City not found. Please select from the list.");
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Geocoding error:', err);
        setError("Failed to fetch cities. Please try again.");
        setOptions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCities(query);
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [query, fetchCities]);

  return {
    query,
    setQuery,
    options,
    isLoading,
    error,
  };
};
