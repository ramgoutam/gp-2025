import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";
import { useToast } from "@/hooks/use-toast";

export const useClinicalInfo = (
  script: LabScript,
  onSave: (updatedScript: LabScript) => void,
  onClose: () => void
) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    insertion_date: script.clinicalInfo?.insertion_date || null,
    appliance_fit: script.clinicalInfo?.appliance_fit || "",
    design_feedback: script.clinicalInfo?.design_feedback || "",
    occlusion: script.clinicalInfo?.occlusion || "",
    esthetics: script.clinicalInfo?.esthetics || "",
    adjustments_made: script.clinicalInfo?.adjustments_made || "",
    material: script.clinicalInfo?.material || "",
    shade: script.clinicalInfo?.shade || "",
  });

  // Fetch latest clinical info data when form opens
  useEffect(() => {
    const fetchClinicalInfo = async () => {
      if (!script.id) return;

      console.log("Fetching clinical info for script:", script.id);

      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select(`
          *,
          clinical_info:clinical_info_id(*)
        `)
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (reportCardError) {
        console.error("Error fetching clinical info:", reportCardError);
        return;
      }

      if (reportCard?.clinical_info) {
        console.log("Found clinical info:", reportCard.clinical_info);
        setFormData(prev => ({
          ...prev,
          ...reportCard.clinical_info
        }));
      }
    };

    fetchClinicalInfo();
  }, [script.id]);

  const handleFieldChange = (field: string, value: string) => {
    console.log(`Updating ${field} to:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting clinical info:", formData);

    try {
      setIsSubmitting(true);
      
      // First get or create report card
      const { data: reportCard, error: reportCardError } = await supabase
        .from('report_cards')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (reportCardError) throw reportCardError;

      let reportCardId;
      if (reportCard) {
        reportCardId = reportCard.id;
      } else {
        const { data: newReportCard, error: createError } = await supabase
          .from('report_cards')
          .insert({
            lab_script_id: script.id,
            patient_id: script.patientId,
            design_info_status: 'pending',
            clinical_info_status: 'completed'
          })
          .select()
          .single();

        if (createError) throw createError;
        reportCardId = newReportCard.id;
      }

      // Save clinical info
      const clinicalInfoData = {
        ...formData,
        report_card_id: reportCardId
      };

      let clinicalInfo;
      if (reportCard?.clinical_info_id) {
        console.log("Updating existing clinical info:", reportCard.clinical_info_id);
        const { data: updatedInfo, error: updateError } = await supabase
          .from('clinical_info')
          .update(clinicalInfoData)
          .eq('id', reportCard.clinical_info_id)
          .select()
          .single();

        if (updateError) throw updateError;
        clinicalInfo = updatedInfo;
      } else {
        console.log("Creating new clinical info");
        const { data: newInfo, error: createError } = await supabase
          .from('clinical_info')
          .insert(clinicalInfoData)
          .select()
          .single();

        if (createError) throw createError;

        // Update report card with clinical_info_id
        const { error: updateError } = await supabase
          .from('report_cards')
          .update({ 
            clinical_info_id: newInfo.id,
            clinical_info_status: 'completed'
          })
          .eq('id', reportCardId);

        if (updateError) throw updateError;
        clinicalInfo = newInfo;
      }

      const updatedScript: LabScript = {
        ...script,
        clinicalInfo: clinicalInfo
      };

      console.log("Successfully saved clinical info:", clinicalInfo);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    handleFieldChange,
    handleSubmit,
    isSubmitting
  };
};