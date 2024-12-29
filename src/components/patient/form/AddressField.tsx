import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { MapboxFeature, searchAddress } from "@/utils/mapboxService";

export interface AddressFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuggestionClick: (suggestion: MapboxFeature) => void;
}

export const AddressField = ({
  value,
  onChange,
  onSuggestionClick,
}: AddressFieldProps) => {
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedValue.length > 2) {
        const results = await searchAddress(debouncedValue);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  return (
    <div className="relative">
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        value={value}
        onChange={onChange}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => {
          // Delay hiding suggestions to allow clicking them
          setTimeout(() => setShowSuggestions(false), 200);
        }}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSuggestionClick(suggestion);
                setShowSuggestions(false);
              }}
            >
              {suggestion.place_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};