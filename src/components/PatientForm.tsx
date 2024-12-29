import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientFormFields } from "./form/PatientFormFields";
import { MapboxFeature } from "@/utils/mapboxService";
import { Patient } from "@/types/patient";

interface PatientFormProps {
  onSubmit: () => void;
  initialData?: Patient;
}

export const PatientForm = ({ onSubmit, initialData }: PatientFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Patient>(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      sex: "",
      profileImage: null,
    }
  );

  const setSex = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      sex: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profileImage: file,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profileImageUrl = initialData?.profileImageUrl;

      if (formData.profileImage) {
        const fileExt = formData.profileImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, formData.profileImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        profileImageUrl = publicUrl;
      }

      const { error } = await supabase.from('patients').upsert({
        id: initialData?.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        sex: formData.sex,
        profile_image_url: profileImageUrl,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Patient ${initialData ? "updated" : "created"} successfully`,
      });

      onSubmit();
    } catch (error) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: "Failed to save patient information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = (suggestion: MapboxFeature) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.place_name
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PatientFormFields
        formData={formData}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleAddressChange={handleAddressChange}
        handleSuggestionClick={handleSuggestionClick}
        suggestions={[]}
        showSuggestions={false}
        setSex={setSex}
      />
      
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Patient"}
        </Button>
      </div>
    </form>
  );
};