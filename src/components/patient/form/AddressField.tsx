import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PlaceSuggestion } from "@/utils/googlePlaces";

interface AddressFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  suggestions: PlaceSuggestion[];
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: PlaceSuggestion) => void;
}

export const AddressField = ({
  value,
  onChange,
  suggestions,
  showSuggestions,
  onSuggestionClick,
}: AddressFieldProps) => {
  const suggestionsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-2 relative">
      <Label htmlFor="address">Address</Label>
      <Input
        id="address"
        name="address"
        value={value}
        onChange={onChange}
        placeholder="Start typing to search address..."
        required
        autoComplete="off"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};