import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}

// Country codes data
const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+33", country: "FR" },
  { code: "+49", country: "DE" },
  { code: "+81", country: "JP" },
  { code: "+86", country: "CN" },
  { code: "+91", country: "IN" },
  { code: "+52", country: "MX" },
  { code: "+55", country: "BR" },
  { code: "+61", country: "AU" },
];

export const FormField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  autoComplete,
}: FormFieldProps) => {
  const [countryCode, setCountryCode] = useState("+1"); // Default to US

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format to (XXX) XXX-XXXX for US numbers
    if (countryCode === "+1") {
      if (phoneNumber.length >= 10) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      } else if (phoneNumber.length > 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
      } else if (phoneNumber.length > 3) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else if (phoneNumber.length > 0) {
        return `(${phoneNumber}`;
      }
    } else {
      // For other country codes, just group by 3 digits
      return phoneNumber.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'tel') {
      const formattedValue = formatPhoneNumber(e.target.value);
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: formattedValue,
        },
      };
      onChange(syntheticEvent);
    } else {
      onChange(e);
    }
  };

  const handleCountryCodeChange = (newCode: string) => {
    setCountryCode(newCode);
    // Clear the current phone number when changing country code
    if (type === 'tel') {
      const syntheticEvent = {
        target: {
          name: id,
          value: '',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {type === 'tel' ? (
        <div className="flex gap-2">
          <Select defaultValue={countryCode} onValueChange={handleCountryCodeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code} ({country.country})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={handlePhoneChange}
            required={required}
            placeholder={countryCode === "+1" ? "(555) 555-5555" : "123 456 789"}
            autoComplete={autoComplete}
            className="flex-1"
          />
        </div>
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={handlePhoneChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
    </div>
  );
};