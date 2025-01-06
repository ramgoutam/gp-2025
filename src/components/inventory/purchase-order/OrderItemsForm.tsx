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
  product_id: string;
  uom: string;
  manufacturing_id: string;
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
        .select('id, product_name, product_id, uom, manufacturing_id, price');
      
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  const totalUnits = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Items</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-sm">
              <th className="text-left py-2">Product ID</th>
              <th className="text-left py-2">Product Name</th>
              <th className="text-left py-2">UOM</th>
              <th className="text-left py-2">Manufacturing ID</th>
              <th className="text-left py-2">Quantity</th>
              <th className="text-left py-2">Unit Price</th>
              <th className="text-left py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => {
              const selectedItem = inventoryItems?.find(invItem => invItem.id === item.item_id);
              
              return (
                <tr key={index} className="border-b">
                  <td className="py-2">
                    <div className="w-32">
                      <Input
                        value={selectedItem?.product_id || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="w-48">
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
                  </td>
                  <td className="py-2">
                    <div className="w-24">
                      <Input
                        value={selectedItem?.uom || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="w-32">
                      <Input
                        value={selectedItem?.manufacturing_id || ''}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="w-24">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="w-32">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(e) => onUpdateItem(index, 'unit_price', parseFloat(e.target.value))}
                      />
                    </div>
                  </td>
                  <td className="py-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="py-2 text-right font-medium">Total Units:</td>
              <td className="py-2 font-medium">{totalUnits}</td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}