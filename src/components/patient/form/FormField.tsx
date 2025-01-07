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
  const [countryCode, setCountryCode] = useState("+1");

  const formatPhoneNumber = (input: string) => {
    // Remove all non-numeric characters
    const phoneNumber = input.replace(/\D/g, '');
    
    if (countryCode === "+1") {
      // Format for US numbers (XXX) XXX-XXXX
      if (phoneNumber.length <= 3) {
        return phoneNumber;
      } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
      }
    }
    
    // For other countries, just group by 3 digits
    return phoneNumber.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'tel') {
      const rawValue = e.target.value.replace(/\D/g, '');
      const formattedValue = formatPhoneNumber(rawValue);
      
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          name: id,
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
    const syntheticEvent = {
      target: {
        name: id,
        value: '',
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {type === 'tel' ? (
        <div className="flex gap-2">
          <Select defaultValue={countryCode} onValueChange={handleCountryCodeChange}>
            <SelectTrigger className="w-[90px]">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent className="bg-white min-w-[90px]">
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id={id}
            name={id}
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            required={required}
            placeholder={countryCode === "+1" ? "(555) 555-5555" : "123 456 789"}
            autoComplete={autoComplete}
            className="flex-1"
            maxLength={countryCode === "+1" ? 14 : 15}
          />
        </div>
      ) : (
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
      )}
    </div>
  );
};