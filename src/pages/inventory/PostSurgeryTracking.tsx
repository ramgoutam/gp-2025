
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Define the type for our data
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

// Define the columns
const columns: ColumnDef<PostSurgeryItem>[] = [
  {
    accessorKey: "itemName",
    header: "Item Name"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "quantity",
    header: "Quantity"
  },
  {
    accessorKey: "surgeryDate",
    header: "Surgery Date"
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={`
          inline-flex px-2 py-1 rounded-full text-xs font-medium
          ${row.original.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
          ${row.original.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          ${row.original.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
        `}
      >
        {row.original.status}
      </div>
    )
  },
  {
    accessorKey: "notes",
    header: "Notes"
  }
];

// Dummy data
const dummyData: PostSurgeryItem[] = [{
  id: "1",
  itemName: "Titanium Implant",
  category: "Implants",
  quantity: 2,
  surgeryDate: "2024-03-15",
  status: "pending",
  notes: "Standard size required"
}, {
  id: "2",
  itemName: "Surgical Screws",
  category: "Fasteners",
  quantity: 4,
  surgeryDate: "2024-03-16",
  status: "completed",
  notes: "Self-tapping screws"
}, {
  id: "3",
  itemName: "Bone Graft Material",
  category: "Biologics",
  quantity: 1,
  surgeryDate: "2024-03-18",
  status: "pending",
  notes: "Synthetic substitute"
}, {
  id: "4",
  itemName: "Surgical Guide",
  category: "Instruments",
  quantity: 1,
  surgeryDate: "2024-03-20",
  status: "cancelled",
  notes: "Custom-made guide"
}, {
  id: "5",
  itemName: "Healing Abutments",
  category: "Prosthetics",
  quantity: 2,
  surgeryDate: "2024-03-22",
  status: "pending",
  notes: "Regular platform"
}];

const PostSurgeryTracking = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  // Fetch patients from the database
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

  return (
    <main className="container h-[calc(100vh-4rem)] overflow-hidden py-0 my-0 mx-0 px-[4px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="aspect-square max-sm:p-0 text-right py-px my-[18px] text-base px-[19px] mx-[25px]">
            <Plus className="opacity-60 sm:-ms-1 sm:me-2" size={16} strokeWidth={2} aria-hidden="true" />
            <span className="max-sm:sr-only">Add new</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Add Post Surgery Item</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-8rem)]">
            <div className="p-6 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading" disabled>Loading patients...</SelectItem>
                    ) : (
                      patients?.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {`${patient.first_name} ${patient.last_name}`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="surgeryDate">Surgery Date</Label>
                <Input id="surgeryDate" type="date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" />
              </div>
            </div>
          </ScrollArea>
          <div className="p-6 pt-4 border-t">
            <Button className="w-full">Add Item</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Card className="mx-6">
        <div className="p-6">
          <DataTable columns={columns} data={dummyData} />
        </div>
      </Card>
    </main>
  );
};

export default PostSurgeryTracking;
