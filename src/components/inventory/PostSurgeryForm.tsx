
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PostSurgeryFormProps {
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  "Implants",
  "Fasteners",
  "Biologics",
  "Instruments",
  "Prosthetics"
];

const STATUS_OPTIONS = [
  "pending",
  "completed",
  "cancelled"
] as const;

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

export const PostSurgeryForm = ({ open, onClose }: PostSurgeryFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    quantity: "",
    surgeryDate: "",
    status: "pending" as typeof STATUS_OPTIONS[number],
    notes: "",
    patientId: "",
  });

  const [openCombobox, setOpenCombobox] = useState(false);

  const { data: patients = [], isLoading: isLoadingPatients, error: patientsError } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name')
        .order('last_name', { ascending: true });

      if (error) throw error;
      return (data as Patient[]) || [];
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const selectedPatient = patients?.find(p => p.id === formData.patientId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Post-Surgery Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Patient</Label>
                <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCombobox}
                      className="w-full justify-between"
                      type="button"
                      disabled={isLoadingPatients}
                    >
                      {isLoadingPatients ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          <span>Loading patients...</span>
                        </div>
                      ) : selectedPatient ? (
                        `${selectedPatient.first_name} ${selectedPatient.last_name}`
                      ) : (
                        "Select patient..."
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    {patientsError ? (
                      <div className="p-4 text-sm text-red-500">
                        Error loading patients. Please try again.
                      </div>
                    ) : (
                      <Command>
                        <CommandInput placeholder="Search patient..." />
                        <CommandEmpty>No patient found.</CommandEmpty>
                        <CommandGroup>
                          {patients.map((patient) => (
                            <CommandItem
                              key={patient.id}
                              value={`${patient.first_name} ${patient.last_name}`}
                              onSelect={() => {
                                handleInputChange("patientId", patient.id);
                                setOpenCombobox(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.patientId === patient.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {patient.first_name} {patient.last_name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    )}
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) => handleInputChange("itemName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="surgeryDate">Surgery Date</Label>
                <Input
                  id="surgeryDate"
                  type="date"
                  value={formData.surgeryDate}
                  onChange={(e) => handleInputChange("surgeryDate", e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep < 2 ? (
              <Button 
                type="button" 
                onClick={handleNext} 
                className="ml-auto"
                disabled={!formData.patientId || !formData.itemName || !formData.category}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="ml-auto"
                disabled={!formData.quantity || !formData.surgeryDate}
              >
                Submit
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
