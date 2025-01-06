import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type OrderItem = {
  item_id: string;
  quantity: number;
  unit_price: number;
};

type InventoryItem = {
  id: string;
  product_name: string;
  price: number | null;
};

interface OrderItemsFormProps {
  orderItems: OrderItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (index: number, field: keyof OrderItem, value: string | number) => void;
}

export function OrderItemsForm({ 
  orderItems, 
  onAddItem, 
  onRemoveItem, 
  onUpdateItem 
}: OrderItemsFormProps) {
  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, product_name, price');
      
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Items</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {orderItems.map((item, index) => (
        <div key={index} className="flex gap-4 items-end">
          <div className="flex-1">
            <FormLabel>Product</FormLabel>
            <Select
              value={item.item_id}
              onValueChange={(value) => onUpdateItem(index, 'item_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItems?.map((invItem) => (
                  <SelectItem key={invItem.id} value={invItem.id}>
                    {invItem.product_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-24">
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
            />
          </div>

          <div className="w-32">
            <FormLabel>Unit Price</FormLabel>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => onUpdateItem(index, 'unit_price', parseFloat(e.target.value))}
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mb-2"
            onClick={() => onRemoveItem(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}