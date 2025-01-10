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
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
  onTotalChange: (total: number) => void;
}

export function OrderItemsForm({ 
  items, 
  onChange, 
  onTotalChange 
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

  const handleAddItem = () => {
    onChange([...items, { item_id: "", quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
    calculateTotal(newItems);
  };

  const handleUpdateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // If item_id is updated, also update the unit_price
    if (field === 'item_id') {
      const selectedItem = inventoryItems?.find(item => item.id === value);
      if (selectedItem?.price) {
        newItems[index].unit_price = selectedItem.price;
      }
    }
    
    onChange(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (currentItems: OrderItem[]) => {
    const total = currentItems.reduce((sum, item) => {
      const selectedItem = inventoryItems?.find(invItem => invItem.id === item.item_id);
      const itemPrice = selectedItem?.price || 0;
      const itemTotal = parseFloat((item.quantity * itemPrice).toFixed(2));
      return sum + itemTotal;
    }, 0);
    onTotalChange(total);
  };

  // Calculate totals
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const selectedItem = inventoryItems?.find(invItem => invItem.id === item.item_id);
    const itemPrice = selectedItem?.price || 0;
    const itemTotal = parseFloat((item.quantity * itemPrice).toFixed(2));
    return sum + itemTotal;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Order Items</h3>
        <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
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
            {items.map((item, index) => {
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
                      onSelect={(value) => handleUpdateItem(index, 'item_id', value)}
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
                      onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
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
                      onClick={() => handleRemoveItem(index)}
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