import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const currentDate = format(new Date(), "yyyy-MM-dd");
  const { toast } = useToast();

  // Fetch suppliers
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("supplier_name");

      if (error) throw error;
      return data;
    },
  });

  // Fetch inventory items
  const { data: inventoryItems } = useQuery({
    queryKey: ["inventory_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_items")
        .select("*")
        .order("product_name");

      if (error) throw error;
      return data;
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

  const handleSubmit = async () => {
    if (!selectedSupplier) {
      toast({
        title: "Error",
        description: "Please select a supplier",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate PO number (you might want to implement a more sophisticated system)
      const poNumber = `PO-${Date.now()}`;

      // Insert purchase order
      const { data: orderData, error: orderError } = await supabase
        .from("purchase_orders")
        .insert({
          po_number: poNumber,
          supplier: selectedSupplier,
          order_date: currentDate,
          status: "draft",
          total_amount: calculateTotal(),
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert purchase order items
      const { error: itemsError } = await supabase
        .from("purchase_order_items")
        .insert(
          items.map((item) => ({
            purchase_order_id: orderData.id,
            item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            product_id: item.product_id,
            product_name: item.product_name,
            uom: item.uom,
            manufacturing_id: item.manufacturing_id,
            manufacturer: item.manufacturer,
          }))
        );

      if (itemsError) throw itemsError;

      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });

      navigate("/inventory/purchase-orders");
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    }
  };

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
                {suppliers?.map((supplier) => (
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
                      <Select
                        value={item.item_id}
                        onValueChange={(value) => updateItem(item.id, 'item_id', value)}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {inventoryItems?.map((invItem) => (
                            <SelectItem key={invItem.id} value={invItem.id}>
                              {invItem.product_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
          <Button onClick={handleSubmit}>
            Create Purchase Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;