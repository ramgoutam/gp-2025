import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PatientFormFields } from "@/components/patient/form/PatientFormFields";
import { MapboxFeature } from "@/utils/mapboxService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    address: string;
    sex: string;
  };
}

export const PatientForm = ({ onSubmit, onClose, initialData }: PatientFormProps) => {
  const { toast } = useToast();
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
      address: "",
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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));
  };

  const handleFileChange = (file: File) => {
    setProfileImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let profileImageUrl = null;

      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, profileImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);

        profileImageUrl = publicUrl;
      }

      const patientData = {
        id: initialData?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        emergencyContactName: formData.emergencyContactName,
        emergencyPhone: formData.emergencyPhone,
        dob: formData.dob,
        address: formData.address,
        sex: formData.sex,
        profileImageUrl: profileImageUrl,
      };

      await onSubmit(patientData);

      toast({
        title: "Success",
        description: `Patient ${initialData ? "updated" : "created"} successfully`,
      });

      if (onClose) {
        onClose();
      }
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

  return (
    <Card className="w-full max-w-[1200px] mx-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-semibold text-gray-900">
          {initialData ? "Edit Patient" : "New Patient Registration"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PatientFormFields
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={setProfileImage}
            handleAddressChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            handleSuggestionClick={(suggestion: MapboxFeature) => {
              setFormData(prev => ({
                ...prev,
                address: suggestion.place_name
              }));
            }}
            setSex={(value) => setFormData(prev => ({ ...prev, sex: value }))}
          />
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update Patient" : "Create Patient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};