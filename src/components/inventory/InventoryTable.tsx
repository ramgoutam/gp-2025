import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Package, Pencil, ArrowUpDown, Search, Trash2, Eye, ArrowLeftRight, AlertTriangle, Info, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type InventoryTableProps = {
  data: any[];
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onView: (item: any) => void;
  onTransfer: (item: any) => void;
};

export function InventoryTable({ data, onEdit, onDelete, onView, onTransfer }: InventoryTableProps) {
  const queryClient = useQueryClient();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const locations = []; // Assume this is populated with location data

  return (
    <div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">
                <button onClick={() => onView(item)}><Eye /></button>
                <button onClick={() => onEdit(item)}><Pencil /></button>
                <button onClick={() => onDelete(item)}><Trash2 /></button>
                <Select onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Transfer" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-[200]">
                    {locations.map((location) => (
                      <SelectItem 
                        key={location.id} 
                        value={location.id}
                        className="hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {location.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
