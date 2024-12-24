import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LabScript } from "@/types/labScript";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FIT_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const DESIGN_FEEDBACK_OPTIONS = ["Neutral", "Positive", "Negative"];
const OCCLUSION_OPTIONS = ["Perfect", "Slight Adjustment Needed", "Major Adjustment Needed"];
const ESTHETICS_OPTIONS = ["Excellent", "Good", "Fair", "Poor"];
const ADJUSTMENTS_OPTIONS = ["None", "Minor", "Major"];
const MATERIAL_OPTIONS = ["PMMA", "Zirconia", "Metal", "Other"];
const SHADE_OPTIONS = ["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2"];

interface ClinicalInfoFormProps {
  onClose: () => void;
  script: LabScript;
  onSave: (updatedScript: LabScript) => void;
}

export const ClinicalInfoForm = ({ onClose, script, onSave }: ClinicalInfoFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    insertionDate: new Date().toISOString().split('T')[0],
    applianceFit: "",
    designFeedback: "",
    occlusion: "",
    esthetics: "",
    adjustmentsMade: "",
    material: "",
    shade: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting clinical info:", formData);

    try {
      // First, check if a report card exists for this lab script
      const { data: existingReport } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      let reportCardId;
      
      if (existingReport) {
        reportCardId = existingReport.id;
      } else {
        // Create new report card
        const { data: newReport, error: createError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: script.id,
            patient_id: script.patientId,
            report_status: 'in_progress'
          })
          .select()
          .single();

        if (createError) throw createError;
        reportCardId = newReport.id;
      }

      // Now handle the clinical info
      const { data: existingClinicalInfo } = await supabase
        .from('clinical_info')
        .select('*')
        .eq('report_card_id', reportCardId)
        .maybeSingle();

      let clinicalInfoOperation;
      if (existingClinicalInfo) {
        // Update existing clinical info
        clinicalInfoOperation = supabase
          .from('clinical_info')
          .update({
            insertion_date: formData.insertionDate,
            appliance_fit: formData.applianceFit,
            design_feedback: formData.designFeedback,
            occlusion: formData.occlusion,
            esthetics: formData.esthetics,
            adjustments_made: formData.adjustmentsMade,
            material: formData.material,
            shade: formData.shade,
          })
          .eq('id', existingClinicalInfo.id);
      } else {
        // Create new clinical info
        clinicalInfoOperation = supabase
          .from('clinical_info')
          .insert({
            report_card_id: reportCardId,
            insertion_date: formData.insertionDate,
            appliance_fit: formData.applianceFit,
            design_feedback: formData.designFeedback,
            occlusion: formData.occlusion,
            esthetics: formData.esthetics,
            adjustments_made: formData.adjustmentsMade,
            material: formData.material,
            shade: formData.shade,
          });
      }

      const { error: saveError } = await clinicalInfoOperation;
      if (saveError) throw saveError;

      const updatedScript: LabScript = {
        ...script,
        clinicalInfo: formData
      };

      onSave(updatedScript);
      
      toast({
        title: "Success",
        description: "Clinical information saved successfully",
      });

      onClose();
    } catch (error) {
      console.error("Error saving clinical info:", error);
      toast({
        title: "Error",
        description: "Failed to save clinical information",
        variant: "destructive"
      });
    }
  };

  const renderSelect = (
    label: string,
    id: keyof typeof formData,
    options: string[]
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={formData[id]}
        onValueChange={(value) => setFormData(prev => ({ ...prev, [id]: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-white z-[200]">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="w-full">
      <ScrollArea className="h-full pr-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="insertionDate">Insertion Date</Label>
              <Input
                id="insertionDate"
                type="date"
                value={formData.insertionDate}
                onChange={(e) => setFormData(prev => ({ ...prev, insertionDate: e.target.value }))}
                required
              />
            </div>
            {renderSelect("Appliance Fit", "applianceFit", FIT_OPTIONS)}
            {renderSelect("Design Feedback", "designFeedback", DESIGN_FEEDBACK_OPTIONS)}
            {renderSelect("Occlusion", "occlusion", OCCLUSION_OPTIONS)}
            {renderSelect("Esthetics", "esthetics", ESTHETICS_OPTIONS)}
            {renderSelect("Adjustments Made", "adjustmentsMade", ADJUSTMENTS_OPTIONS)}
            {renderSelect("Material", "material", MATERIAL_OPTIONS)}
            {renderSelect("Shade", "shade", SHADE_OPTIONS)}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Clinical Info
            </Button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
};