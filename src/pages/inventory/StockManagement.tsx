import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const StockManagement = () => {
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferringItem, setTransferringItem] = useState<{
    item_id: string;
    location_id: string;
    quantity: number;
  } | null>(null);
  const [toLocationId, setToLocationId] = useState<string>("");
  const [transferQuantity, setTransferQuantity] = useState<number>(0);

  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("items").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: locations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("locations").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: stock } = useQuery({
    queryKey: ["stock"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stock").select("*");
      if (error) throw error;
      return data;
    },
  });

  const getStockQuantity = (itemId: string, locationId: string) => {
    return stock?.find(
      (s) => s.item_id === itemId && s.location_id === locationId
    )?.quantity;
  };

  const handleTransfer = async () => {
    if (!transferringItem || !toLocationId || transferQuantity <= 0) {
      toast.error("Please fill in all fields");
      return;
    }

    const fromLocationQuantity = getStockQuantity(
      transferringItem.item_id,
      transferringItem.location_id
    );

    if (!fromLocationQuantity || fromLocationQuantity < transferQuantity) {
      toast.error("Insufficient stock in source location");
      return;
    }

    try {
      // Update source location stock
      await supabase
        .from("stock")
        .update({
          quantity: fromLocationQuantity - transferQuantity,
        })
        .match({
          item_id: transferringItem.item_id,
          location_id: transferringItem.location_id,
        });

      // Update or insert destination location stock
      const toLocationStock = getStockQuantity(
        transferringItem.item_id,
        toLocationId
      );

      if (toLocationStock !== undefined) {
        await supabase
          .from("stock")
          .update({
            quantity: toLocationStock + transferQuantity,
          })
          .match({
            item_id: transferringItem.item_id,
            location_id: toLocationId,
          });
      } else {
        await supabase.from("stock").insert({
          item_id: transferringItem.item_id,
          location_id: toLocationId,
          quantity: transferQuantity,
        });
      }

      toast.success("Stock transferred successfully");
      setIsTransferDialogOpen(false);
      setTransferringItem(null);
      setToLocationId("");
      setTransferQuantity(0);
    } catch (error) {
      console.error("Error transferring stock:", error);
      toast.error("Failed to transfer stock");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Stock Management</h1>
          <p className="text-gray-500">Manage your inventory across locations</p>
        </div>
      </div>

      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Location</label>
              <Select
                value={transferringItem?.location_id || ""}
                onValueChange={(locationId) => {
                  const location = locations?.find((l) => l.id === locationId);
                  if (location) {
                    setTransferringItem((prev) => ({
                      ...prev!,
                      location_id: locationId,
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {locations?.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.id}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{location.name}</span>
                        <span className="text-gray-500">
                          Qty: {getStockQuantity(transferringItem?.item_id || "", location.id) || 0}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Location</label>
              <Select
                value={toLocationId || ""}
                onValueChange={setToLocationId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  {locations?.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.id}
                      disabled={location.id === transferringItem?.location_id}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span>{location.name}</span>
                        <span className="text-gray-500">
                          Qty: {getStockQuantity(transferringItem?.item_id || "", location.id) || 0}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min="1"
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(Number(e.target.value))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsTransferDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleTransfer}>Transfer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Total Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => {
            const totalStock = stock
              ?.filter((s) => s.item_id === item.id)
              .reduce((sum, s) => sum + s.quantity, 0);

            return (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{totalStock || 0}</TableCell>
                <TableCell>
                  <Badge
                    variant={totalStock === 0 ? "destructive" : "default"}
                  >
                    {totalStock === 0 ? "Out of Stock" : "In Stock"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const locationId = stock?.find(
                        (s) => s.item_id === item.id
                      )?.location_id;
                      setTransferringItem({
                        item_id: item.id,
                        location_id: locationId || "",
                        quantity: 0,
                      });
                      setIsTransferDialogOpen(true);
                    }}
                  >
                    Transfer
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default StockManagement;