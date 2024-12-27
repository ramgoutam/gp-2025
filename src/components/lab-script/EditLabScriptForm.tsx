import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LabScript } from "@/types/labScript";

interface EditLabScriptFormProps {
  script: LabScript;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedScript: LabScript) => void;
}

export const EditLabScriptForm = ({ 
  script, 
  isOpen, 
  onClose,
  onUpdate 
}: EditLabScriptFormProps) => {
  const [formData, setFormData] = React.useState({
    doctorName: script.doctorName,
    clinicName: script.clinicName,
    requestDate: script.requestDate,
    dueDate: script.dueDate,
    applianceType: script.applianceType || "",
    upperTreatment: script.upperTreatment || "",
    lowerTreatment: script.lowerTreatment || "",
    specificInstructions: script.specificInstructions || "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Updating lab script:", script.id, formData);
      const { data, error } = await supabase
        .from("lab_scripts")
        .update({
          doctor_name: formData.doctorName,
          clinic_name: formData.clinicName,
          request_date: formData.requestDate,
          due_date: formData.dueDate,
          appliance_type: formData.applianceType,
          upper_treatment: formData.upperTreatment,
          lower_treatment: formData.lowerTreatment,
          specific_instructions: formData.specificInstructions,
        })
        .eq("id", script.id)
        .select()
        .single();

      if (error) throw error;

      console.log("Lab script updated successfully:", data);
      
      // Map database response to LabScript type
      const updatedScript: LabScript = {
        ...script,
        doctorName: data.doctor_name,
        clinicName: data.clinic_name,
        requestDate: data.request_date,
        dueDate: data.due_date,
        applianceType: data.appliance_type,
        upperTreatment: data.upper_treatment,
        lowerTreatment: data.lower_treatment,
        specificInstructions: data.specific_instructions,
      };

      toast({
        title: "Success",
        description: "Lab script updated successfully",
      });

      onUpdate(updatedScript);
      onClose();
    } catch (error) {
      console.error("Error updating lab script:", error);
      toast({
        title: "Error",
        description: "Failed to update lab script",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Lab Script</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                name="clinicName"
                value={formData.clinicName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requestDate">Request Date</Label>
              <Input
                id="requestDate"
                name="requestDate"
                type="date"
                value={formData.requestDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="applianceType">Appliance Type</Label>
            <Input
              id="applianceType"
              name="applianceType"
              value={formData.applianceType}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="upperTreatment">Upper Treatment</Label>
              <Input
                id="upperTreatment"
                name="upperTreatment"
                value={formData.upperTreatment}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowerTreatment">Lower Treatment</Label>
              <Input
                id="lowerTreatment"
                name="lowerTreatment"
                value={formData.lowerTreatment}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specificInstructions">Specific Instructions</Label>
            <Textarea
              id="specificInstructions"
              name="specificInstructions"
              value={formData.specificInstructions}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Lab Script"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};