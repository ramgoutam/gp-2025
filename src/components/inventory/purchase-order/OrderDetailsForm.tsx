import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Command } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddSupplierDialog } from "../AddSupplierDialog";

interface OrderDetailsFormProps {
  data: {
    supplier: string;
    order_date: string;
    expected_delivery_date?: string;
  };
  onChange: (data: any) => void;
  onSubmit: (data: any) => void;
  isEditing: boolean;
}

type Supplier = {
  id: string;
  supplier_name: string;
};

export function OrderDetailsForm({ data, onChange, onSubmit, isEditing }: OrderDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("id, supplier_name")
        .order("supplier_name");

      if (error) throw error;
      return data as Supplier[];
    },
  });

  const filteredSuppliers = suppliers?.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FormLabel>Supplier</FormLabel>
          <div className="relative">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between bg-white"
                  >
                    {data.supplier
                      ? suppliers?.find((s) => s.id === data.supplier)?.supplier_name
                      : "Select supplier..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <input
                      placeholder="Search suppliers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-auto">
                    {filteredSuppliers?.map((supplier) => (
                      <div
                        key={supplier.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleChange('supplier', supplier.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                          data.supplier === supplier.id && "bg-accent text-accent-foreground"
                        )}
                      >
                        <span>{supplier.supplier_name}</span>
                        {data.supplier === supplier.id && (
                          <Check className="ml-auto h-4 w-4" />
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setShowAddSupplier(true);
                        setOpen(false);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Supplier
                    </Button>
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <FormLabel>Order Date</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              value={data.order_date} 
              onChange={(e) => handleChange('order_date', e.target.value)}
            />
          </FormControl>
        </div>

        <div>
          <FormLabel>Expected Delivery Date</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              value={data.expected_delivery_date} 
              onChange={(e) => handleChange('expected_delivery_date', e.target.value)}
            />
          </FormControl>
        </div>
      </div>

      <AddSupplierDialog 
        open={showAddSupplier} 
        onOpenChange={setShowAddSupplier} 
      />
    </div>
  );
}