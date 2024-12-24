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
    insertion_date: new Date().toISOString().split('T')[0],
    appliance_fit: "",
    design_feedback: "",
    occlusion: "",
    esthetics: "",
    adjustments_made: "",
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
            clinical_info_status: 'completed',
            design_info_status: existingReport?.design_info_status || 'pending'
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
            insertion_date: formData.insertion_date,
            appliance_fit: formData.appliance_fit,
            design_feedback: formData.design_feedback,
            occlusion: formData.occlusion,
            esthetics: formData.esthetics,
            adjustments_made: formData.adjustments_made,
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
            insertion_date: formData.insertion_date,
            appliance_fit: formData.appliance_fit,
            design_feedback: formData.design_feedback,
            occlusion: formData.occlusion,
            esthetics: formData.esthetics,
            adjustments_made: formData.adjustments_made,
            material: formData.material,
            shade: formData.shade,
          });
      }

      const { error: saveError } = await clinicalInfoOperation;
      if (saveError) throw saveError;

      // Update report card status
      const { error: updateError } = await supabase
        .from('report_cards')
        .update({ clinical_info_status: 'completed' })
        .eq('id', reportCardId);

      if (updateError) throw updateError;

      const updatedScript: LabScript = {
        ...script,
        clinicalInfo: {
          report_card_id: reportCardId,
          ...formData
        }
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
              <Label htmlFor="insertion_date">Insertion Date</Label>
              <Input
                id="insertion_date"
                type="date"
                value={formData.insertion_date}
                onChange={(e) => setFormData(prev => ({ ...prev, insertion_date: e.target.value }))}
                required
              />
            </div>
            {renderSelect("Appliance Fit", "appliance_fit", FIT_OPTIONS)}
            {renderSelect("Design Feedback", "design_feedback", DESIGN_FEEDBACK_OPTIONS)}
            {renderSelect("Occlusion", "occlusion", OCCLUSION_OPTIONS)}
            {renderSelect("Esthetics", "esthetics", ESTHETICS_OPTIONS)}
            {renderSelect("Adjustments Made", "adjustments_made", ADJUSTMENTS_OPTIONS)}
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