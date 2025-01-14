import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type PurchaseOrderItem = {
  id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_id: string;
  uom: string;
  manufacturing_id: string;
  manufacturer: string;
};

const CreatePurchaseOrder = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<PurchaseOrderItem[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const currentDate = format(new Date(), "yyyy-MM-dd");

  // Fetch suppliers with error handling
  const { data: suppliers = [], isError: isSuppliersError } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("suppliers")
          .select("*")
          .order("supplier_name");

        if (error) {
          console.error("Error fetching suppliers:", error);
          toast.error("Failed to load suppliers");
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error("Error in suppliers query:", error);
        throw error;
      }
    },
  });

  // Fetch inventory items with error handling
  const { 
    data: inventoryItems = [], 
    isLoading: isLoadingItems,
    isError: isInventoryError 
  } = useQuery({
    queryKey: ["inventory_items"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("inventory_items")
          .select("*")
          .order("product_name");

        if (error) {
          console.error("Error fetching inventory items:", error);
          toast.error("Failed to load inventory items");
          throw error;
        }
        return data || [];
      } catch (error) {
        console.error("Error in inventory items query:", error);
        throw error;
      }
    },
  });

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: crypto.randomUUID(),
      item_id: "",
      quantity: 1,
      unit_price: 0,
      product_name: "",
      product_id: "",
      uom: "",
      manufacturing_id: "",
      manufacturer: "",
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof PurchaseOrderItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (field === 'item_id' && inventoryItems) {
          const selectedItem = inventoryItems.find(invItem => invItem.id === value);
          return {
            ...item,
            [field]: value,
            product_name: selectedItem?.product_name || '',
            product_id: selectedItem?.product_id || '',
            uom: selectedItem?.uom || '',
            manufacturing_id: selectedItem?.manufacturing_id || '',
            manufacturer: selectedItem?.manufacturer || '',
            unit_price: selectedItem?.price || 0
          };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  };

  if (isSuppliersError || isInventoryError) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-red-500">Error loading data. Please try again later.</p>
        <Button
          variant="outline"
          onClick={() => navigate("/inventory/purchase-orders")}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/inventory/purchase-orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="supplier">Supplier</Label>
            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select supplier" />
              </SelectTrigger>
              <SelectContent className="bg-white border shadow-lg">
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.supplier_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Order Date</Label>
            <Input
              type="date"
              id="date"
              value={currentDate}
              disabled
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Items</h2>
            <Button onClick={addItem} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-4 py-2 text-left">Product ID</th>
                  <th className="px-4 py-2 text-left">Item</th>
                  <th className="px-4 py-2 text-left">UOM</th>
                  <th className="px-4 py-2 text-left">Manf ID</th>
                  <th className="px-4 py-2 text-left">Manufacturer</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Unit Price</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left w-[50px]"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2">{item.product_id}</td>
                    <td className="px-4 py-2">
                      <Popover 
                        open={open[item.id]} 
                        onOpenChange={(isOpen) => setOpen({ ...open, [item.id]: isOpen })}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open[item.id]}
                            className="w-full justify-between"
                          >
                            {item.product_name || "Select item..."}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0" align="start">
                          <Command>
                            <CommandInput placeholder="Search items..." />
                            {isLoadingItems ? (
                              <div className="py-6 text-center text-sm">Loading items...</div>
                            ) : inventoryItems.length === 0 ? (
                              <div className="py-6 text-center text-sm">No items available</div>
                            ) : (
                              <>
                                <CommandEmpty>No items found.</CommandEmpty>
                                <CommandGroup>
                                  {inventoryItems.map((invItem) => (
                                    <CommandItem
                                      key={invItem.id}
                                      onSelect={() => {
                                        updateItem(item.id, 'item_id', invItem.id);
                                        setOpen({ ...open, [item.id]: false });
                                      }}
                                    >
                                      {invItem.product_name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            )}
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td className="px-4 py-2">{item.uom}</td>
                    <td className="px-4 py-2">{item.manufacturing_id}</td>
                    <td className="px-4 py-2">{item.manufacturer}</td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))}
                        className="w-[100px]"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => updateItem(item.id, 'unit_price', parseFloat(e.target.value))}
                        className="w-[100px]"
                      />
                    </td>
                    <td className="px-4 py-2">
                      ${(item.quantity * item.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No items added. Click "Add Item" to start building your purchase order.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t bg-gray-50 font-medium">
                  <td colSpan={7} className="px-4 py-2 text-right">
                    Total:
                  </td>
                  <td colSpan={2} className="px-4 py-2">
                    ${calculateTotal().toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/inventory/purchase-orders")}
          >
            Cancel
          </Button>
          <Button>
            Create Purchase Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
