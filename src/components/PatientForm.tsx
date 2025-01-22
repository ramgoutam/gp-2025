import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientFormFields } from "@/components/patient/form/PatientFormFields";
import { MapboxFeature } from "@/utils/mapboxService";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

interface PatientFormProps {
  onSubmit: (data: any) => Promise<void>;
  onClose?: () => void;
  initialData?: {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emergencyContactName?: string;
    emergencyPhone?: string;
    dob: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    sex: string;
  };
}

export const PatientForm = ({ onSubmit, onClose, initialData }: PatientFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(
    initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      emergencyContactName: "",
      emergencyPhone: "",
      dob: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      sex: "",
    }
  );
  const [profileImage, setProfileImage] = useState<File | null>(null);

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

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file: File) => {
    setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Form submission started with data:", { formData, initialData });

    try {
      // Validate required fields
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.sex || !formData.dob) {
        throw new Error("Please fill in all required fields");
      }

      let profileImageUrl = null;

      // Only handle image upload if a file was selected
      if (profileImage) {
        try {
          const fileExt = profileImage.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('profile-images')
            .upload(filePath, profileImage);

          if (uploadError) {
            console.error('Error uploading profile image:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('profile-images')
              .getPublicUrl(filePath);
            profileImageUrl = publicUrl;
          }
        } catch (uploadError) {
          console.error('Error handling profile image:', uploadError);
        }
      }

      const address = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

      // Prepare patient data
      const patientData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        emergency_contact_name: formData.emergencyContactName,
        emergency_phone: formData.emergencyPhone,
        dob: formData.dob,
        address: address,
        sex: formData.sex,
        ...(profileImageUrl && { profile_image_url: profileImageUrl }),
      };

      let result;
      
      // If we have an initialData.id, we're updating an existing patient
      if (initialData?.id) {
        console.log("Updating existing patient:", initialData.id);
        const { data, error } = await supabase
          .from('patients')
          .update(patientData)
          .eq('id', initialData.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating patient:", error);
          throw error;
        }
        result = data;
        console.log("Patient updated successfully:", result);
      } else {
        // Creating a new patient
        console.log("Creating new patient");
        const { data, error } = await supabase
          .from('patients')
          .insert([patientData])
          .select()
          .single();

        if (error) {
          console.error("Error creating patient:", error);
          throw error;
        }
        result = data;
        console.log("New patient created successfully:", result);
      }

      toast({
        title: "Success",
        description: `Patient ${initialData?.id ? "updated" : "created"} successfully`,
      });

      if (onSubmit) {
        await onSubmit(result);
      }

      // Navigate to the patients page after successful submission
      navigate('/patients');
    } catch (error: any) {
      console.error('Error saving patient:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save patient information",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <ScrollArea className="flex-1 px-6 py-4">
        <CardContent className="space-y-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <PatientFormFields
              formData={formData}
              handleInputChange={handleInputChange}
              handleFileChange={handleFileChange}
              handleAddressChange={handleAddressChange}
              handleSuggestionClick={(suggestion: MapboxFeature) => {
                const addressParts = suggestion.place_name.split(',');
                setFormData(prev => ({
                  ...prev,
                  street: addressParts[0]?.trim() || '',
                  city: addressParts[1]?.trim() || '',
                  state: addressParts[2]?.trim() || '',
                  zipCode: addressParts[3]?.trim() || ''
                }));
              }}
              setSex={setSex}
            />
          </form>
        </CardContent>
      </ScrollArea>
      <div className="p-4 border-t mt-auto bg-white">
        <div className="flex justify-end space-x-2">
          {onClose && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData?.id ? "Update Patient" : "Create Patient"}
          </Button>
        </div>
      </div>
    </Card>
  );
};