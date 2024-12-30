import { FormField } from "./FormField";
import { AddressField } from "./AddressField";
import { SexField } from "./SexField";
import { FileUploadField } from "./FileUploadField";
import { MapboxFeature } from "@/utils/mapboxService";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="md:col-span-2">
        <AddressField
          value={formData.address}
          onChange={handleAddressChange}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>

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

      <div className="md:col-span-2">
        <FileUploadField
          id="profilePicture"
          onChange={handleFileChange}
          label="Profile Picture"
          accept="image/*"
        />
      </div>
    </div>
  );
};
