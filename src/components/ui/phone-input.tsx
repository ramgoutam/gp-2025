import React from "react";
import { Input } from "./input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { cn } from "@/lib/utils";

const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "GB", flag: "🇬🇧" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
];

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PhoneInput({ value, onChange, className, ...props }: PhoneInputProps) {
  const [countryCode, setCountryCode] = React.useState("+1");
  const [phoneNumber, setPhoneNumber] = React.useState("");

  React.useEffect(() => {
    // Initialize from value prop if it exists
    if (value) {
      const code = COUNTRY_CODES.find(c => value.startsWith(c.code));
      if (code) {
        setCountryCode(code.code);
        setPhoneNumber(value.slice(code.code.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d]/g, '');
    setPhoneNumber(newNumber);
    onChange(countryCode + newNumber);
  };

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    onChange(newCode + phoneNumber);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={countryCode} onValueChange={handleCountryCodeChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map(({ code, country, flag }) => (
            <SelectItem key={code} value={code}>
              <span className="flex items-center gap-2">
                <span>{flag}</span>
                <span>{code}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        className="flex-1"
        placeholder="Phone number"
        {...props}
      />
    </div>
  );
}