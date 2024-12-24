import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { validateGoogleApiKey, getPlaceSuggestions, PlaceSuggestion } from "@/utils/googlePlaces";

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address: string;
  surgeryDate?: string;
}

interface PatientFormProps {
  initialData?: PatientFormData;
  onSubmitSuccess?: (data: PatientFormData) => void;
  onClose?: () => void;
}

export const PatientForm = ({ initialData, onSubmitSuccess, onClose }: PatientFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    sex: "",
    dob: "",
    address: "",
    surgeryDate: "",
  });

  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [googleApiKey, setGoogleApiKey] = useState<string>("");
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('GOOGLE_MAPS_API_KEY');
    if (key) {
      validateAndSetKey(key);
    }
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateAndSetKey = async (key: string) => {
    setIsValidatingKey(true);
    try {
      const isValid = await validateGoogleApiKey(key);
      if (isValid) {
        localStorage.setItem('GOOGLE_MAPS_API_KEY', key);
        setGoogleApiKey(key);
        return true;
      } else {
        throw new Error('Invalid key');
      }
    } catch (error) {
      console.error('Key validation failed:', error);
      toast({
        title: "Invalid API Key",
        description: "Please provide a valid Google Maps API key with Places API enabled",
        variant: "destructive",
      });
      localStorage.removeItem('GOOGLE_MAPS_API_KEY');
      return false;
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (!googleApiKey && value.length > 2) {
      const key = prompt(
        "Please enter your Google Maps API key with Places API enabled"
      );
      if (key) {
        const isValid = await validateAndSetKey(key);
        if (!isValid) return;
      } else {
        return;
      }
    }

    if (value.length > 2 && googleApiKey) {
      try {
        const suggestions = await getPlaceSuggestions(value);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        if (error instanceof Error && error.message.includes('InvalidKeyMapError')) {
          localStorage.removeItem('GOOGLE_MAPS_API_KEY');
          setGoogleApiKey("");
        }
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: PlaceSuggestion) => {
    setFormData(prev => ({ ...prev, address: suggestion.description }));
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient data:", formData);
    
    onSubmitSuccess?.(formData);
    onClose?.(); // Close the dialog after successful submission
    
    if (!onSubmitSuccess) {
      toast({
        title: "Success",
        description: "Patient information saved successfully",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        sex: "",
        dob: "",
        address: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleAddressChange}
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
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.description}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="surgeryDate">Surgery Date</Label>
        <Input
          id="surgeryDate"
          name="surgeryDate"
          type="date"
          value={formData.surgeryDate}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2 relative">
        <Label htmlFor="sex">Sex</Label>
        <Select
          value={formData.sex}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select sex" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full">
        {initialData ? "Update Patient Information" : "Create"}
      </Button>
    </form>
  );
};