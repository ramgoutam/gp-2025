import React from "react";
import { DigitalDataSection } from "../DigitalDataSection";
import { TreatmentSection } from "../TreatmentSection";
import { ApplianceSection } from "../ApplianceSection";
import { ScrewSection } from "../ScrewSection";
import { VDOSection } from "../VDOSection";
import { DesignNameSection } from "../DesignNameSection";
import { FormHeader } from "../FormHeader";
import { FormFooter } from "../FormFooter";
import { ManufacturingSection } from "../ManufacturingSection";

interface FormSectionsProps {
  formData: any;
  fileUploads: Record<string, { id: string; files: File[] }>;
  isSubmitting: boolean;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleFileChange: (itemId: string, files: File[]) => void;
  handleManufacturingChange: (source: string, type: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export const FormSections: React.FC<FormSectionsProps> = ({
  formData,
  fileUploads,
  isSubmitting,
  isEditing,
  handleChange,
  handleFileChange,
  handleManufacturingChange,
  setFormData
}) => {
  const shouldShowScrewSection = () => {
    return formData.upperTreatment !== "Denture" && 
           formData.lowerTreatment !== "Denture" && 
           formData.applianceType !== "Nightguard";
  };

  const shouldShowVDOSection = () => {
    return formData.applianceType !== "Nightguard";
  };

  return (
    <>
      <FormHeader
        requestDate={formData.requestDate}
        dueDate={formData.dueDate}
        onChange={handleChange}
      />

      <ApplianceSection
        value={formData.applianceType}
        onChange={(value) => setFormData((prev: any) => ({ ...prev, applianceType: value }))}
        onManufacturingChange={handleManufacturingChange}
      />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Treatment</h3>
        <div className="grid grid-cols-2 gap-8">
          <TreatmentSection
            title="Upper"
            treatment={formData.upperTreatment}
            onTreatmentChange={(value) => 
              setFormData((prev: any) => ({ ...prev, upperTreatment: value }))
            }
            applianceType={formData.applianceType}
          />
          <TreatmentSection
            title="Lower"
            treatment={formData.lowerTreatment}
            onTreatmentChange={(value) =>
              setFormData((prev: any) => ({ ...prev, lowerTreatment: value }))
            }
            applianceType={formData.applianceType}
          />
        </div>
      </div>

      {formData.applianceType && (
        <DesignNameSection
          applianceType={formData.applianceType}
          upperTreatment={formData.upperTreatment}
          lowerTreatment={formData.lowerTreatment}
          upperDesignName={formData.upperDesignName}
          lowerDesignName={formData.lowerDesignName}
          onUpperDesignNameChange={(value) => 
            setFormData((prev: any) => ({ ...prev, upperDesignName: value }))
          }
          onLowerDesignNameChange={(value) =>
            setFormData((prev: any) => ({ ...prev, lowerDesignName: value }))
          }
        />
      )}

      <div className="grid grid-cols-2 gap-8">
        {shouldShowScrewSection() && (
          <ScrewSection
            value={formData.screwType}
            onChange={(value) => setFormData((prev: any) => ({ ...prev, screwType: value }))}
          />
        )}
        {shouldShowVDOSection() && (
          <VDOSection
            value={formData.vdoOption}
            onChange={(value) => setFormData((prev: any) => ({ ...prev, vdoOption: value }))}
          />
        )}
      </div>

      {formData.applianceType && (
        <ManufacturingSection
          manufacturingSource={formData.manufacturingSource}
          manufacturingType={formData.manufacturingType}
          material={formData.material}
          shade={formData.shade}
          onManufacturingSourceChange={(value) => 
            setFormData((prev: any) => ({ ...prev, manufacturingSource: value }))
          }
          onManufacturingTypeChange={(value) =>
            setFormData((prev: any) => ({ ...prev, manufacturingType: value }))
          }
          onMaterialChange={(value) =>
            setFormData((prev: any) => ({ ...prev, material: value }))
          }
          onShadeChange={(value) =>
            setFormData((prev: any) => ({ ...prev, shade: value }))
          }
          isEditable={true}
        />
      )}

      <DigitalDataSection
        uploads={fileUploads}
        onFileChange={handleFileChange}
        applianceType={formData.applianceType}
      />

      <FormFooter
        specificInstructions={formData.specificInstructions}
        onChange={handleChange}
        isSubmitting={isSubmitting}
        isEditing={isEditing}
      />
    </>
  );
};