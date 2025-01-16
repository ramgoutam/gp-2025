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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InventoryTableProps {
  data: any[];
  locations: { id: string; name: string }[];
}

export function InventoryTable({ data, locations }: InventoryTableProps) {
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.location_name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent className="sm:max-w-[425px]">
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