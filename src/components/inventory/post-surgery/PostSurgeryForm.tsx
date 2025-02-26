
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Patient, treatmentOptions } from "@/types/postSurgeryTracking";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PostSurgeryFormProps {
  currentStep: number;
  formData: {
    patient: string;
    itemName: string;
    category: string;
    quantity: string;
    surgeryDate: string;
    notes: string;
    treatments: string[];
  };
  selectedTreatments: string[];
  handleInputChange: (field: string, value: string | string[]) => void;
  toggleTreatment: (treatment: string) => void;
}

export const PostSurgeryForm = ({
  currentStep,
  formData,
  selectedTreatments,
  handleInputChange,
  toggleTreatment
}: PostSurgeryFormProps) => {
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .order('last_name');
      if (error) throw error;
      return data as Patient[];
    }
  });

  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-4 px-0 mx-[10px] my-0">
              <Label htmlFor="patient">Patient Name:</Label>
              <Select value={formData.patient} onValueChange={value => handleInputChange("patient", value)}>
                <SelectTrigger className="px-[10px] my-0 mx-0">
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Loading patients...</SelectItem>
                  ) : (
                    patients?.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {`${patient.first_name} ${patient.last_name}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6">
              <Label>Select Treatments:</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {treatmentOptions.map((treatment) => (
                  <Button
                    key={treatment}
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start gap-2 h-auto py-2 px-3 text-xs",
                      selectedTreatments.includes(treatment) && "bg-primary/10 border-primary"
                    )}
                    onClick={() => toggleTreatment(treatment)}
                  >
                    <div className="flex items-center gap-1.5">
                      {selectedTreatments.includes(treatment) && (
                        <Check className="h-3 w-3 text-primary shrink-0" />
                      )}
                      <span>{treatment}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input 
                id="itemName" 
                value={formData.itemName} 
                onChange={e => handleInputChange("itemName", e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                value={formData.category} 
                onChange={e => handleInputChange("category", e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number" 
                value={formData.quantity} 
                onChange={e => handleInputChange("quantity", e.target.value)} 
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="surgeryDate">Surgery Date</Label>
              <Input 
                id="surgeryDate" 
                type="date" 
                value={formData.surgeryDate} 
                onChange={e => handleInputChange("surgeryDate", e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                value={formData.notes} 
                onChange={e => handleInputChange("notes", e.target.value)} 
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollArea className="h-[calc(100%-2rem)]">
      {renderFormStep()}
    </ScrollArea>
  );
};
