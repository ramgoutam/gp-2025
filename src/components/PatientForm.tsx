import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { validateGoogleApiKey, getPlaceSuggestions, PlaceSuggestion } from "@/utils/googlePlaces";
import { FormField } from "@/components/patient/form/FormField";
import { AddressField } from "@/components/patient/form/AddressField";
import { SexField } from "@/components/patient/form/SexField";

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
  const [googleApiKey, setGoogleApiKey] = useState<string>("");

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

  const validateAndSetKey = async (key: string) => {
    try {
      const isValid = await validateGoogleApiKey(key);
      if (isValid) {
        localStorage.setItem('GOOGLE_MAPS_API_KEY', key);
        setGoogleApiKey(key);
        return true;
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
    }
  };

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, address: value }));

    if (!googleApiKey && value.length > 2) {
      const key = prompt("Please enter your Google Maps API key with Places API enabled");
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
    onClose?.();
    
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
        surgeryDate: "",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <FormField
        id="firstName"
        label="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      <FormField
        id="lastName"
        label="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />

      <FormField
        id="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <FormField
        id="phone"
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <AddressField
        value={formData.address}
        onChange={handleAddressChange}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      <FormField
        id="surgeryDate"
        label="Surgery Date"
        type="date"
        value={formData.surgeryDate || ""}
        onChange={handleChange}
      />

      <SexField
        value={formData.sex}
        onChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
      />

      <FormField
        id="dob"
        label="Date of Birth"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        required
      />

      <Button type="submit" className="w-full">
        {initialData ? "Update Patient Information" : "Create"}
      </Button>
    </form>
  );
};