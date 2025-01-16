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
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowUpDown, MapPin, ArrowLeftRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AddLocationDialog } from "@/components/inventory/AddLocationDialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type StockWithRelations = {
  id: string;
  quantity: number;
  item_id: string;
  location_id: string;
  inventory_items: {
    product_name: string;
    sku: string;
    min_stock: number;
  };
  inventory_locations: {
    name: string;
  };
};

type LocationTotals = {
  [key: string]: {
    total_items: number;
    total_quantity: number;
  };
};

const StockManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof StockWithRelations>("quantity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [transferringItem, setTransferringItem] = useState<StockWithRelations | null>(null);
  const [transferQuantity, setTransferQuantity] = useState<number>(0);
  const [targetLocationId, setTargetLocationId] = useState<string>("");
  const { toast } = useToast();

  const { data: stock, isLoading, refetch } = useQuery({
    queryKey: ['inventory-stock'],
    queryFn: async () => {
      console.log("Fetching inventory stock data");
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items (product_name, sku, min_stock),
          inventory_locations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching stock:", error);
        throw error;
      }
      return data as StockWithRelations[];
    }
  });

  const { data: locations } = useQuery({
    queryKey: ['inventory-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_locations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const locationTotals: LocationTotals = stock?.reduce((acc: LocationTotals, item) => {
    const locationName = item.inventory_locations.name;
    if (!acc[locationName]) {
      acc[locationName] = { total_items: 0, total_quantity: 0 };
    }
    acc[locationName].total_items += 1;
    acc[locationName].total_quantity += item.quantity;
    return acc;
  }, {}) || {};

  const handleSort = (field: keyof StockWithRelations) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredStock = stock?.filter(item => {
    const matchesSearch = 
      item.inventory_items.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inventory_items.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || item.inventory_locations.name === locationFilter;
    
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "asc" ? 
      (aValue > bValue ? 1 : -1) : 
      (bValue > aValue ? 1 : -1);
  });

  const handleAdjustStock = async (stockId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('inventory_stock')
        .update({ quantity: newQuantity })
        .eq('id', stockId);

      if (error) throw error;

      toast({
        title: "Stock Updated",
        description: "The stock quantity has been successfully updated.",
      });

      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock quantity.",
        variant: "destructive",
      });
    }
  };

  const handleAddStock = async () => {
    try {
      if (!selectedItemId || !selectedLocationId || quantity <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please fill in all fields with valid values.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('inventory_stock')
        .upsert({
          item_id: selectedItemId,
          location_id: selectedLocationId,
          quantity: quantity,
        }, {
          onConflict: 'item_id,location_id'
        });

      if (error) throw error;

      toast({
        title: "Stock Added",
        description: "The stock has been successfully added.",
      });

      setIsAddStockOpen(false);
      setSelectedItemId("");
      setSelectedLocationId("");
      setQuantity(0);
      refetch();
    } catch (error) {
      console.error('Error adding stock:', error);
      toast({
        title: "Error",
        description: "Failed to add stock. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTransferClick = (item: StockWithRelations) => {
    setTransferringItem(item);
    setIsTransferDialogOpen(true);
    setTransferQuantity(0);
    setTargetLocationId("");
  };

  const handleTransferStock = async () => {
    if (!transferringItem || !targetLocationId || transferQuantity <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Transferring stock:", {
        itemId: transferringItem.item_id,
        sourceLocationId: transferringItem.location_id,
        targetLocationId,
        quantity: transferQuantity
      });

      // First, check if we have enough stock in the source location
      if (transferringItem.quantity < transferQuantity) {
        toast({
          title: "Error",
          description: "Insufficient stock in source location",
          variant: "destructive",
        });
        return;
      }

      // Begin the transfer
      // 1. Reduce stock in source location
      const { error: sourceError } = await supabase
        .from('inventory_stock')
        .update({ 
          quantity: transferringItem.quantity - transferQuantity 
        })
        .eq('id', transferringItem.id);

      if (sourceError) throw sourceError;

      // 2. Check if target location already has stock of this item
      const { data: targetStock } = await supabase
        .from('inventory_stock')
        .select('quantity')
        .eq('item_id', transferringItem.item_id)
        .eq('location_id', targetLocationId)
        .maybeSingle();

      if (targetStock) {
        // Update existing stock
        const { error: targetError } = await supabase
          .from('inventory_stock')
          .update({ 
            quantity: targetStock.quantity + transferQuantity 
          })
          .eq('item_id', transferringItem.item_id)
          .eq('location_id', targetLocationId);

        if (targetError) throw targetError;
      } else {
        // Create new stock entry
        const { error: insertError } = await supabase
          .from('inventory_stock')
          .insert({
            item_id: transferringItem.item_id,
            location_id: targetLocationId,
            quantity: transferQuantity
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Stock transferred successfully",
      });
      
      setIsTransferDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast({
        title: "Error",
        description: "Failed to transfer stock",
        variant: "destructive",
      });
    }
  };

  const { data: availableItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('product_name');

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stock Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage inventory stock levels across different locations
            </p>
          </div>
          <div className="flex gap-4">
            <AddLocationDialog onLocationAdded={refetch} />
            <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Stock</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.product_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select value={selectedLocationId} onValueChange={setSelectedLocationId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations?.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <Button onClick={handleAddStock} className="w-full">
                    Add Stock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(locationTotals).map(([location, totals]) => (
            <Card key={location} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">{location}</h3>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-semibold">{totals.total_items}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Quantity</p>
                  <p className="text-2xl font-semibold">{totals.total_quantity}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Table section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("quantity")}>
                    <div className="flex items-center gap-2">
                      Quantity
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Min. Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock?.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-mono text-sm">
                      {item.inventory_items.sku}
                    </TableCell>
                    <TableCell>{item.inventory_items.product_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <MapPin className="h-3 w-3" />
                        {item.inventory_locations.name}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      item.quantity < (item.inventory_items.min_stock || 0)
                        ? "text-yellow-600 font-medium"
                        : ""
                    )}>
                      {item.quantity}
                    </TableCell>
                    <TableCell>{item.inventory_items.min_stock || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTransferClick(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2"
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                          Transfer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredStock?.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Transfer Stock Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Transfer Stock</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From Location</Label>
              <Input 
                value={transferringItem?.inventory_locations.name || ''} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label>To Location</Label>
              <Select value={targetLocationId} onValueChange={setTargetLocationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target location" />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem 
                      key={location.id} 
                      value={location.id}
                      disabled={location.id === transferringItem?.location_id}
                    >
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                max={transferringItem?.quantity || 0}
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferStock}
              disabled={!targetLocationId || transferQuantity <= 0}
            >
              Transfer Stock
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockManagement;