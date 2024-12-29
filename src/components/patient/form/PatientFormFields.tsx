import { FormField } from "./FormField";
import { AddressField } from "./AddressField";
import { SexField } from "./SexField";
import { FileUploadField } from "./FileUploadField";
import { PatientFormData } from "@/types/patient";

interface PatientFormFieldsProps {
  formData: PatientFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileChange: (fieldName: string, file: File) => void;
  suggestions: any[];
  showSuggestions: boolean;
  onSuggestionClick: (suggestion: any) => void;
  setSex: (value: string) => void;
}

export const PatientFormFields = ({
  formData,
  handleChange,
  handleAddressChange,
  handleFileChange,
  suggestions,
  showSuggestions,
  onSuggestionClick,
  setSex,
}: PatientFormFieldsProps) => {
  return (
    <>
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

      <FormField
        id="emergencyContactName"
        label="Emergency Contact Name"
        value={formData.emergencyContactName}
        onChange={handleChange}
        required
      />

      <FormField
        id="emergencyPhone"
        label="Emergency Phone"
        type="tel"
        value={formData.emergencyPhone}
        onChange={handleChange}
        required
      />

      <AddressField
        value={formData.address}
        onChange={handleAddressChange}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        onSuggestionClick={onSuggestionClick}
      />

      <SexField
        value={formData.sex}
        onChange={(value) => setSex(value)}
      />

      <FormField
        id="dob"
        label="Date of Birth"
        type="date"
        value={formData.dob}
        onChange={handleChange}
        required
      />

      <FileUploadField
        id="patientPicture"
        label="Patient Picture"
        onChange={(file) => handleFileChange('patientPicture', file)}
      />

      <FileUploadField
        id="insuranceCardPicture"
        label="Insurance Card Picture"
        onChange={(file) => handleFileChange('insuranceCardPicture', file)}
      />
    </>
  );
};