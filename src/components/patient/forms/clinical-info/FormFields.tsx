import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldsProps {
  formData: {
    insertion_date: string;
    appliance_fit: string;
    design_feedback: string;
    occlusion: string;
    esthetics: string;
    adjustments_made: string;
    material: string;
    shade: string;
  };
  onFieldChange: (field: string, value: string) => void;
  isSubmitting?: boolean;
}

export const FormFields = ({ formData, onFieldChange, isSubmitting }: FormFieldsProps) => {
  return (
    <>
      <div className="space-y-4">
        <div>
          <label htmlFor="insertion_date" className="block text-sm font-medium text-gray-700">
            Insertion Date
          </label>
          <Input
            id="insertion_date"
            type="date"
            value={formData.insertion_date}
            onChange={(e) => onFieldChange("insertion_date", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="appliance_fit" className="block text-sm font-medium text-gray-700">
            Appliance Fit
          </label>
          <Textarea
            id="appliance_fit"
            value={formData.appliance_fit}
            onChange={(e) => onFieldChange("appliance_fit", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="design_feedback" className="block text-sm font-medium text-gray-700">
            Design Feedback
          </label>
          <Textarea
            id="design_feedback"
            value={formData.design_feedback}
            onChange={(e) => onFieldChange("design_feedback", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="occlusion" className="block text-sm font-medium text-gray-700">
            Occlusion
          </label>
          <Textarea
            id="occlusion"
            value={formData.occlusion}
            onChange={(e) => onFieldChange("occlusion", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="esthetics" className="block text-sm font-medium text-gray-700">
            Esthetics
          </label>
          <Textarea
            id="esthetics"
            value={formData.esthetics}
            onChange={(e) => onFieldChange("esthetics", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="adjustments_made" className="block text-sm font-medium text-gray-700">
            Adjustments Made
          </label>
          <Textarea
            id="adjustments_made"
            value={formData.adjustments_made}
            onChange={(e) => onFieldChange("adjustments_made", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => onFieldChange("material", e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="shade" className="block text-sm font-medium text-gray-700">
            Shade
          </label>
          <Input
            id="shade"
            value={formData.shade}
            onChange={(e) => onFieldChange("shade", e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </>
  );
};