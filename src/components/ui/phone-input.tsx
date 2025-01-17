import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COUNTRY_CODES = [
  { value: "1", label: "US", flag: "🇺🇸" },
  { value: "44", label: "GB", flag: "🇬🇧" },
  { value: "91", label: "IN", flag: "🇮🇳" },
  { value: "86", label: "CN", flag: "🇨🇳" },
  { value: "81", label: "JP", flag: "🇯🇵" },
  { value: "49", label: "DE", flag: "🇩🇪" },
  { value: "33", label: "FR", flag: "🇫🇷" },
  { value: "39", label: "IT", flag: "🇮🇹" },
  { value: "7", label: "RU", flag: "🇷🇺" },
  { value: "82", label: "KR", flag: "🇰🇷" },
  { value: "34", label: "ES", flag: "🇪🇸" },
  { value: "55", label: "BR", flag: "🇧🇷" },
  { value: "52", label: "MX", flag: "🇲🇽" },
  { value: "61", label: "AU", flag: "🇦🇺" },
  { value: "31", label: "NL", flag: "🇳🇱" },
] as const;

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PhoneInput({ value, onChange }: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(COUNTRY_CODES[0]);
  const [phoneNumber, setPhoneNumber] = React.useState("");

  // Format phone number based on country code
  const formatPhoneNumber = (number: string, countryCode: string) => {
    // Remove all non-numeric characters
    const cleaned = number.replace(/\D/g, "");

    switch (countryCode) {
      case "1": // US format: (XXX) XXX-XXXX
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6)
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
          6,
          10
        )}`;

      case "44": // UK format: XXXX XXXXXX
        if (cleaned.length <= 4) return cleaned;
        return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 10)}`;

      case "91": // India format: XXXXX XXXXX
        if (cleaned.length <= 5) return cleaned;
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;

      default: // Default format: XXX XXX XXXX
        if (cleaned.length <= 3) return cleaned;
        if (cleaned.length <= 6)
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
        return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
          6,
          10
        )}`;
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, "");
    const formattedNumber = formatPhoneNumber(inputValue, selectedCountry.value);
    setPhoneNumber(formattedNumber);
    onChange(`+${selectedCountry.value}${inputValue}`);
  };

  React.useEffect(() => {
    // Initialize from provided value
    if (value) {
      const match = value.match(/^\+(\d+)(.*)$/);
      if (match) {
        const [, code, number] = match;
        const country = COUNTRY_CODES.find((c) => c.value === code);
        if (country) {
          setSelectedCountry(country);
          setPhoneNumber(formatPhoneNumber(number, code));
        }
      }
    }
  }, [value]);

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex gap-1 w-[110px] justify-between"
          >
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="text-sm">+{selectedCountry.value}</span>
            <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 bg-white shadow-lg">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRY_CODES.map((country) => (
                <CommandItem
                  key={country.value}
                  value={country.label}
                  onSelect={() => {
                    setSelectedCountry(country);
                    setOpen(false);
                    // Reformat the existing number with new country code
                    const cleaned = phoneNumber.replace(/\D/g, "");
                    const formatted = formatPhoneNumber(cleaned, country.value);
                    setPhoneNumber(formatted);
                    onChange(`+${country.value}${cleaned}`);
                  }}
                >
                  <span className="text-base mr-2">{country.flag}</span>
                  <span className="text-sm">
                    {country.label} (+{country.value})
                  </span>
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCountry.value === country.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "flex-1"
        )}
        placeholder="Enter phone number"
      />
    </div>
  );
}