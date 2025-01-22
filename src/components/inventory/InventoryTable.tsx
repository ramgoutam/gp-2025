import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InventoryTableProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onBulkDelete: () => void;
  isLoading: boolean;
  selectedLocation: string;
  locations: any[];
  onLocationChange: (value: string) => void;
  onAddItem: () => void;
}

export const InventoryTable = ({ 
  items,
  onEdit,
  onDelete,
  onBulkDelete,
  isLoading,
  selectedLocation,
  locations,
  onLocationChange,
  onAddItem,
}: InventoryTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredItems = items.filter(item => 
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected = selectedItems.length === filteredItems.length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleItemSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleBulkDelete = () => {
    onBulkDelete();
    setSelectedItems([]);
  };

  const getStockStatus = (item: any) => {
    if (item.currentStock < item.min_stock) {
      return "low";
    }
    return "normal";
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="relative">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px]"
                />
                <Select value={selectedLocation} onValueChange={onLocationChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                {selectedItems.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Selected
                  </Button>
                )}
                <Button onClick={onAddItem} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="max-h-[600px] overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  <th className="w-[40px] p-4">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 font-medium text-gray-500">Name</th>
                  <th className="text-left p-4 font-medium text-gray-500">Category</th>
                  <th className="text-left p-4 font-medium text-gray-500">SKU</th>
                  <th className="text-left p-4 font-medium text-gray-500">Stock</th>
                  <th className="text-left p-4 font-medium text-gray-500">Min Stock</th>
                  <th className="text-left p-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className={`border-t border-gray-100 ${
                      selectedItems.includes(item.id)
                        ? "bg-primary/5"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleItemSelect(item.id, !!checked)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.product_name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {item.category ? (
                        <Badge variant="secondary">{item.category}</Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm">
                        {item.sku || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            getStockStatus(item) === "low"
                              ? "text-red-600"
                              : "text-gray-900"
                          }`}
                        >
                          {item.currentStock || 0}
                        </span>
                        <span className="text-gray-400">{item.uom}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-500">
                        {item.min_stock || 0}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
