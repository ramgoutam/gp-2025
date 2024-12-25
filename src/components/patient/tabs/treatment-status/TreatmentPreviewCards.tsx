import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TreatmentPreviewCardsProps {
  surgeryDate?: string;
  deliveryDate?: string;
  status?: string;
  upperAppliance?: string;
  lowerAppliance?: string;
  nightguard?: string;
  patientId?: string;
  labScripts?: any[];
  onUpdate: () => void;
}

export const TreatmentPreviewCards = ({
  surgeryDate,
  deliveryDate,
  status,
  upperAppliance,
  lowerAppliance,
  nightguard,
  patientId,
  labScripts,
  onUpdate,
}: TreatmentPreviewCardsProps) => {
  const { toast } = useToast();

  const handleSurgeryDateUpdate = async (date: string) => {
    if (!patientId) return;
    
    const updateData = {
      surgery_date: date,
      id: patientId
    };
    
    try {
      const { error } = await supabase
        .from('patients')
        .update(updateData)
        .eq('id', patientId);

      if (error) throw error;
      
      onUpdate();
      
      toast({
        title: "Success",
        description: "Surgery date updated successfully",
      });
    } catch (error) {
      console.error('Error updating surgery date:', error);
      toast({
        title: "Error",
        description: "Failed to update surgery date",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Treatment Preview</h2>
      <div className="mt-4">
        <p><strong>Surgery Date:</strong> {surgeryDate || "Not set"}</p>
        <p><strong>Delivery Date:</strong> {deliveryDate || "Not set"}</p>
        <p><strong>Status:</strong> {status || "Not available"}</p>
        <p><strong>Upper Appliance:</strong> {upperAppliance || "None"}</p>
        <p><strong>Lower Appliance:</strong> {lowerAppliance || "None"}</p>
        <p><strong>Nightguard:</strong> {nightguard || "No"}</p>
      </div>
      <div className="mt-6">
        <Button onClick={() => handleSurgeryDateUpdate(new Date().toISOString())}>
          Update Surgery Date
        </Button>
      </div>
    </Card>
  );
};
