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
import mapboxgl from 'mapbox-gl';

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sex: string;
  dob: string;
  address: string;
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
  });

  const [suggestions, setSuggestions] = useState<Array<{ place_name: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");

  useEffect(() => {
    // Get the Mapbox token from localStorage if user hasn't set it in Supabase
    const token = localStorage.getItem('MAPBOX_TOKEN');
    if (token) {
      setMapboxToken(token);
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

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (!mapboxToken) {
      const token = prompt("Please enter your Mapbox public access token. You can find it at https://account.mapbox.com/access-tokens/");
      if (token) {
        localStorage.setItem('MAPBOX_TOKEN', token);
        setMapboxToken(token);
      }
      return;
    }

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${mapboxToken}&types=address`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch address suggestions. Please check your Mapbox token.",
          variant: "destructive",
        });
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: { place_name: string }) => {
    setFormData(prev => ({ ...prev, address: suggestion.place_name }));
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
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.place_name}
              </div>
            ))}
          </div>
        )}
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