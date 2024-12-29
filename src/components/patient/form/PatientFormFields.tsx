import { FormField } from "./FormField";
import { AddressField } from "./AddressField";
import { SexField } from "./SexField";
import { FileUploadField } from "./FileUploadField";
import { MapboxFeature } from "@/utils/mapboxService";
import { Card } from "@/components/ui/card";

interface PatientFormFieldsProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    emergencyContactName?: string;
    emergencyPhone?: string;
    sex: string;
    dob: string;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (file: File) => void;
  handleSuggestionClick: (suggestion: MapboxFeature) => void;
  setSex: (value: string) => void;
}

export const PatientFormFields = ({
  formData,
  handleInputChange,
  handleAddressChange,
  handleFileChange,
  handleSuggestionClick,
  setSex,
}: PatientFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <FileUploadField
          id="profilePicture"
          onChange={handleFileChange}
          label=""
          accept="image/*"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
            <FormField
              id="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FormField
              id="phone"
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <h3 className="text-lg font-medium">Additional Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <SexField
              value={formData.sex}
              onChange={(value) => setSex(value)}
            />
            <FormField
              id="dob"
              label="Date of Birth"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
            <div className="col-span-2">
              <AddressField
                value={formData.address}
                onChange={handleAddressChange}
                onSuggestionClick={handleSuggestionClick}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-4 lg:col-span-2">
          <h3 className="text-lg font-medium">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              id="emergencyContactName"
              label="Emergency Contact Name"
              value={formData.emergencyContactName || ''}
              onChange={handleInputChange}
            />
            <FormField
              id="emergencyPhone"
              label="Emergency Phone"
              type="tel"
              value={formData.emergencyPhone || ''}
              onChange={handleInputChange}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};