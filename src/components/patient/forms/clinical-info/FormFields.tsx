import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <Select
            value={formData.appliance_fit}
            onValueChange={(value) => onFieldChange("appliance_fit", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select appliance fit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="design_feedback" className="block text-sm font-medium text-gray-700">
            Design Feedback
          </label>
          <Select
            value={formData.design_feedback}
            onValueChange={(value) => onFieldChange("design_feedback", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select design feedback" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="occlusion" className="block text-sm font-medium text-gray-700">
            Occlusion
          </label>
          <Select
            value={formData.occlusion}
            onValueChange={(value) => onFieldChange("occlusion", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select occlusion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="esthetics" className="block text-sm font-medium text-gray-700">
            Esthetics
          </label>
          <Select
            value={formData.esthetics}
            onValueChange={(value) => onFieldChange("esthetics", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select esthetics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="adjustments_made" className="block text-sm font-medium text-gray-700">
            Adjustments Made
          </label>
          <Select
            value={formData.adjustments_made}
            onValueChange={(value) => onFieldChange("adjustments_made", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select adjustments made" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              <SelectItem value="Minor">Minor</SelectItem>
              <SelectItem value="Moderate">Moderate</SelectItem>
              <SelectItem value="Major">Major</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <Select
            value={formData.material}
            onValueChange={(value) => onFieldChange("material", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Acrylic">Acrylic</SelectItem>
              <SelectItem value="Metal">Metal</SelectItem>
              <SelectItem value="Composite">Composite</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="shade" className="block text-sm font-medium text-gray-700">
            Shade
          </label>
          <Select
            value={formData.shade}
            onValueChange={(value) => onFieldChange("shade", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select shade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A1">A1</SelectItem>
              <SelectItem value="A2">A2</SelectItem>
              <SelectItem value="A3">A3</SelectItem>
              <SelectItem value="A3.5">A3.5</SelectItem>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="B1">B1</SelectItem>
              <SelectItem value="B2">B2</SelectItem>
              <SelectItem value="B3">B3</SelectItem>
              <SelectItem value="B4">B4</SelectItem>
              <SelectItem value="C1">C1</SelectItem>
              <SelectItem value="C2">C2</SelectItem>
              <SelectItem value="C3">C3</SelectItem>
              <SelectItem value="C4">C4</SelectItem>
              <SelectItem value="D2">D2</SelectItem>
              <SelectItem value="D3">D3</SelectItem>
              <SelectItem value="D4">D4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};