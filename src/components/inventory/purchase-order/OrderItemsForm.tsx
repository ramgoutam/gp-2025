import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ProductSelector } from "./ProductSelector";

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
  manufacturer: string;
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
  const [searchTerm, setSearchTerm] = useState("");

  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, product_name, product_id, uom, manufacturing_id, manufacturer, price');
      
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  const filteredItems = inventoryItems?.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.product_id && item.product_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate totals
  const totalUnits = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = orderItems.reduce((sum, item) => {
    const selectedItem = inventoryItems?.find(invItem => invItem.id === item.item_id);
    const itemPrice = selectedItem?.price || 0;
    const itemTotal = parseFloat((item.quantity * itemPrice).toFixed(2));
    return sum + itemTotal;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Items</h3>
        <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search by product name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead>
            <tr className="border-b text-sm">
              <th className="text-left py-2 px-2 w-[120px]">Product ID</th>
              <th className="text-left py-2 px-2 w-[300px]">Product Name</th>
              <th className="text-left py-2 px-2 w-[100px]">UOM</th>
              <th className="text-left py-2 px-2 w-[150px]">Manufacturing ID</th>
              <th className="text-left py-2 px-2 w-[200px]">Manufacturer</th>
              <th className="text-left py-2 px-2 w-[100px]">Unit Price</th>
              <th className="text-left py-2 px-2 w-[100px]">Quantity</th>
              <th className="text-left py-2 px-2 w-[100px]">Total Cost</th>
              <th className="text-left py-2 px-2 w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => {
              const selectedItem = inventoryItems?.find(invItem => invItem.id === item.item_id);
              const itemPrice = selectedItem?.price || 0;
              const totalCost = parseFloat((item.quantity * itemPrice).toFixed(2));
              
              return (
                <tr key={index} className="border-b align-top">
                  <td className="py-2 px-2">
                    <Input
                      value={selectedItem?.product_id || ''}
                      readOnly
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <ProductSelector
                      items={filteredItems || []}
                      value={item.item_id}
                      onSelect={(value) => onUpdateItem(index, 'item_id', value)}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={selectedItem?.uom || ''}
                      readOnly
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={selectedItem?.manufacturing_id || ''}
                      readOnly
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={selectedItem?.manufacturer || ''}
                      readOnly
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={itemPrice.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={totalCost.toFixed(2)}
                      readOnly
                      className="bg-gray-50"
                    />
                  </td>
                  <td className="py-2 px-2">
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
              <td colSpan={6} className="py-2 px-2 text-right font-medium">Total Units:</td>
              <td className="py-2 px-2 font-medium">{totalUnits}</td>
              <td className="py-2 px-2 font-medium">${totalAmount.toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}