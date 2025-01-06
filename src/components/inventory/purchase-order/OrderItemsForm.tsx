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
  description: string | null;
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
  const [showSearch, setShowSearch] = useState(false);

  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, product_name, product_id, description, uom, manufacturing_id, manufacturer, price');
      
      if (error) throw error;
      return data as InventoryItem[];
    }
  });

  const filteredItems = inventoryItems?.filter(item => 
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.product_id && item.product_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleItemSelect = (index: number, itemId: string) => {
    const selectedItem = inventoryItems?.find(item => item.id === itemId);
    onUpdateItem(index, 'item_id', itemId);
    if (selectedItem?.price) {
      onUpdateItem(index, 'unit_price', selectedItem.price);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h3 className="text-lg font-medium">Order Items</h3>
        <div className="flex items-center gap-2">
          {showSearch && (
            <Input
              className="w-[300px]"
              placeholder="Search by product name, ID, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <Button 
            type="button" 
            variant="outline" 
            size="icon"
            onClick={() => setShowSearch(!showSearch)}
          >
            <Search className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
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
              <th className="text-left py-2 px-2 w-[100px]">Quantity</th>
              <th className="text-left py-2 px-2 w-[120px]">Unit Price</th>
              <th className="text-left py-2 px-2 w-[120px]">Total Price</th>
              <th className="text-left py-2 px-2 w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item, index) => {
              const selectedItem = inventoryItems?.find(invItem => invItem.id === item.item_id);
              const totalPrice = item.quantity * item.unit_price;
              
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
                      onSelect={(value) => handleItemSelect(index, value)}
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
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(index, 'quantity', parseInt(e.target.value))}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => onUpdateItem(index, 'unit_price', parseFloat(e.target.value))}
                    />
                  </td>
                  <td className="py-2 px-2">
                    <Input
                      value={`$${totalPrice.toFixed(2)}`}
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
        </table>
      </div>
    </div>
  );
}