import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InventoryTableProps {
  data: any[];
  locations: { id: string; name: string }[];
  onUpdate?: () => void;
}

export function InventoryTable({ data = [], locations = [], onUpdate }: InventoryTableProps) {
  const { toast } = useToast();
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleTransfer = async () => {
    if (!selectedItem || !fromLocation || !toLocation || !quantity) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.rpc("transfer_stock", {
        p_item_id: selectedItem.id,
        p_from_location: fromLocation,
        p_to_location: toLocation,
        p_quantity: quantityNum,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock transferred successfully",
      });

      setShowTransferDialog(false);
      setSelectedItem(null);
      setFromLocation("");
      setToLocation("");
      setQuantity("");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error transferring stock:", error);
      toast({
        title: "Error",
        description: "Failed to transfer stock",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.location_name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedItem(item);
                    setFromLocation(item.location_id);
                    setShowTransferDialog(true);
                  }}
                >
                  Transfer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Location</label>
              <Select
                value={fromLocation}
                onValueChange={setFromLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source location" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  {locations.map((location) => (
                    <SelectItem
                      key={location.id}
                      value={location.id}
                      className="hover:bg-gray-100"
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Location</label>
              <Select
                value={toLocation}
                onValueChange={setToLocation}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select destination location" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  {locations.map((location) => (
                    <SelectItem
                      key={location.id}
                      value={location.id}
                      className="hover:bg-gray-100"
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTransferDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleTransfer}>Transfer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}