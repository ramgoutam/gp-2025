import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { validateGoogleApiKey, getPlaceSuggestions, PlaceSuggestion } from "@/utils/googlePlaces";
import { PatientFormFields } from "@/components/patient/form/PatientFormFields";
import { PatientFormData } from "@/types/patient";

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
    emergencyPhone: "",
    sex: "",
    dob: "",
    address: "",
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
        emergencyPhone: "",
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
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <PatientFormFields
        formData={formData}
        handleChange={handleChange}
        handleAddressChange={handleAddressChange}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSuggestionClick={handleSuggestionClick}
        setSex={(value) => setFormData((prev) => ({ ...prev, sex: value }))}
      />

      <Button type="submit" className="w-full">
        {initialData ? "Update Patient Information" : "Create"}
      </Button>
    </form>
  );
};