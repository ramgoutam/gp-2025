import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
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

type FormData = {
  supplier: string;
  order_date: string;
  expected_delivery_date: string;
};

interface OrderDetailsFormProps {
  form: UseFormReturn<FormData>;
}

type Supplier = {
  id: string;
  supplier_name: string;
};

export function OrderDetailsForm({ form }: OrderDetailsFormProps) {
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

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
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
                        {field.value
                          ? suppliers?.find((s) => s.id === field.value)?.supplier_name
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
                              field.onChange(supplier.id);
                              setOpen(false);
                            }}
                            className={cn(
                              "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                              field.value === supplier.id && "bg-accent text-accent-foreground"
                            )}
                          >
                            <span>{supplier.supplier_name}</span>
                            {field.value === supplier.id && (
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="order_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expected_delivery_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Expected Delivery Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <AddSupplierDialog 
        open={showAddSupplier} 
        onOpenChange={setShowAddSupplier} 
      />
    </div>
  );
}