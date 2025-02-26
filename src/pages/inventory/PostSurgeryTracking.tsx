import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProgressBar } from "@/components/patient/ProgressBar";
type PostSurgeryItem = {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  surgeryDate: string;
  status: "pending" | "completed" | "cancelled";
  notes: string;
};
type Patient = {
  id: string;
  first_name: string;
  last_name: string;
};
const columns: ColumnDef<PostSurgeryItem>[] = [{
  accessorKey: "itemName",
  header: "Item Name"
}, {
  accessorKey: "category",
  header: "Category"
}, {
  accessorKey: "quantity",
  header: "Quantity"
}, {
  accessorKey: "surgeryDate",
  header: "Surgery Date"
}, {
  accessorKey: "status",
  header: "Status",
  cell: ({
    row
  }) => <div className={`
          inline-flex px-2 py-1 rounded-full text-xs font-medium
          ${row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
        `}>
        {row.original.status}
      </div>
}, {
  accessorKey: "notes",
  header: "Notes"
}];
const formSteps = [{
  title: "Patient Selection",
  fields: ["patient"]
}, {
  title: "Item Details",
  fields: ["itemName", "category", "quantity"]
}, {
  title: "Surgery Information",
  fields: ["surgeryDate", "notes"]
}];

// Initial empty data array
const initialData: PostSurgeryItem[] = [];

const PostSurgeryTracking = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    patient: "",
    itemName: "",
    category: "",
    quantity: "",
    surgeryDate: "",
    notes: ""
  });
  const {
    data: patients,
    isLoading
  } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('patients').select('id, first_name, last_name').order('last_name');
      if (error) throw error;
      return data as Patient[];
    }
  });
  const handleNext = () => {
    if (currentStep < formSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const canProceed = () => {
    const currentFields = formSteps[currentStep].fields;
    return currentFields.every(field => formData[field as keyof typeof formData]);
  };
  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed" as const;
    if (index === currentStep) return "current" as const;
    return "upcoming" as const;
  };
  const progressSteps = formSteps.map((step, index) => ({
    label: step.title,
    status: getStepStatus(index)
  }));
  const renderFormStep = () => {
    switch (currentStep) {
      case 0:
        return <div className="space-y-4">
            <Label htmlFor="patient">Patient</Label>
            <Select value={formData.patient} onValueChange={value => handleInputChange("patient", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? <SelectItem value="loading" disabled>Loading patients...</SelectItem> : patients?.map(patient => <SelectItem key={patient.id} value={patient.id}>
                      {`${patient.first_name} ${patient.last_name}`}
                    </SelectItem>)}
              </SelectContent>
            </Select>
          </div>;
      case 1:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input id="itemName" value={formData.itemName} onChange={e => handleInputChange("itemName", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" value={formData.category} onChange={e => handleInputChange("category", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" value={formData.quantity} onChange={e => handleInputChange("quantity", e.target.value)} />
            </div>
          </div>;
      case 2:
        return <div className="space-y-4">
            <div>
              <Label htmlFor="surgeryDate">Surgery Date</Label>
              <Input id="surgeryDate" type="date" value={formData.surgeryDate} onChange={e => handleInputChange("surgeryDate", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={formData.notes} onChange={e => handleInputChange("notes", e.target.value)} />
            </div>
          </div>;
      default:
        return null;
    }
  };
  return <main className="container h-[calc(100vh-4rem)] overflow-hidden py-0 my-0 mx-0 px-[4px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="aspect-square max-sm:p-0 text-right py-px my-[18px] text-base px-[19px] mx-[25px]">
            <Plus className="opacity-60 sm:-ms-1 sm:me-2" size={16} strokeWidth={2} aria-hidden="true" />
            <span className="max-sm:sr-only">Add new</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-[800px] h-[calc(100vh-2rem)] overflow-hidden p-0 flex flex-col">
          <div className="p-6 flex-1 overflow-hidden">
            <DialogHeader className="px-0 pb-6">
              <DialogTitle>Add Post Surgery Item</DialogTitle>
            </DialogHeader>
            <ProgressBar steps={progressSteps} activeStep={currentStep} />
            <div className="text-sm text-muted-foreground mb-4">
              Step {currentStep + 1} of {formSteps.length}: {formSteps[currentStep].title}
            </div>
            <ScrollArea className="flex-1">
              <div className="space-y-4 py-4">
                {renderFormStep()}
              </div>
            </ScrollArea>
          </div>
          <div className="border-t p-6 flex justify-between py-[10px]">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="bg-black text-white hover:bg-black/90 flex flex-row-reverse gap-2"
            >
              <span>Previous</span>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {currentStep === formSteps.length - 1 ? (
              <Button
                type="submit"
                disabled={!canProceed()}
                className="bg-black text-white hover:bg-black/90"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-black text-white hover:bg-black/90 flex gap-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <Card className="mx-6">
        <div className="p-6">
          <DataTable columns={columns} data={initialData} />
        </div>
      </Card>
    </main>;
};

export default PostSurgeryTracking;
