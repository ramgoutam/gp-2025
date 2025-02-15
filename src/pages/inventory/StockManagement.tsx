
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowUpDown, MapPin, ArrowLeftRight, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddLocationDialog } from "@/components/inventory/AddLocationDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { usePagination } from "@/hooks/use-pagination";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem
} from "@/components/ui/pagination";

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const { toast } = useToast();

  const {
    data: stock,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['inventory-stock'],
    queryFn: async () => {
      console.log("Fetching inventory stock data");
      const {
        data,
        error
      } = await supabase.from('inventory_stock').select(`
          *,
          inventory_items!inventory_stock_item_id_fkey (
            product_name,
            sku,
            min_stock
          ),
          inventory_locations (name)
        `).order('created_at', {
        ascending: false
      });
      if (error) {
        console.error("Error fetching stock:", error);
        throw error;
      }
      return data as StockWithRelations[];
    }
  });
  const {
    data: locations
  } = useQuery({
    queryKey: ['inventory-locations'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('inventory_locations').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });
  const locationTotals: LocationTotals = stock?.reduce((acc: LocationTotals, item) => {
    const locationName = item.inventory_locations.name;
    if (!acc[locationName]) {
      acc[locationName] = {
        total_items: 0,
        total_quantity: 0
      };
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
    const matchesSearch = item.inventory_items.product_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.inventory_items.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || item.inventory_locations.name === locationFilter;
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "asc" ? aValue > bValue ? 1 : -1 : bValue > aValue ? 1 : -1;
  });

  const paginatedStock = filteredStock?.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize
  );

  const totalPages = Math.ceil((filteredStock?.length || 0) / pagination.pageSize);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: pagination.pageIndex + 1,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  const handleAdjustStock = async (stockId: string, newQuantity: number) => {
    try {
      const {
        error
      } = await supabase.from('inventory_stock').update({
        quantity: newQuantity
      }).eq('id', stockId);
      if (error) throw error;
      toast({
        title: "Stock Updated",
        description: "The stock quantity has been successfully updated."
      });
      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock quantity.",
        variant: "destructive"
      });
    }
  };
  const handleAddStock = async () => {
    try {
      if (!selectedItemId || !selectedLocationId || quantity <= 0) {
        toast({
          title: "Invalid Input",
          description: "Please fill in all fields with valid values.",
          variant: "destructive"
        });
        return;
      }
      const {
        error
      } = await supabase.from('inventory_stock').upsert({
        item_id: selectedItemId,
        location_id: selectedLocationId,
        quantity: quantity
      }, {
        onConflict: 'item_id,location_id'
      });
      if (error) throw error;
      toast({
        title: "Stock Added",
        description: "The stock has been successfully added."
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
        variant: "destructive"
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
        variant: "destructive"
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
          variant: "destructive"
        });
        return;
      }

      // Begin the transfer
      // 1. Reduce stock in source location
      const {
        error: sourceError
      } = await supabase.from('inventory_stock').update({
        quantity: transferringItem.quantity - transferQuantity
      }).eq('id', transferringItem.id);
      if (sourceError) throw sourceError;

      // 2. Check if target location already has stock of this item
      const {
        data: targetStock
      } = await supabase.from('inventory_stock').select('quantity').eq('item_id', transferringItem.item_id).eq('location_id', targetLocationId).maybeSingle();
      if (targetStock) {
        // Update existing stock
        const {
          error: targetError
        } = await supabase.from('inventory_stock').update({
          quantity: targetStock.quantity + transferQuantity
        }).eq('item_id', transferringItem.item_id).eq('location_id', targetLocationId);
        if (targetError) throw targetError;
      } else {
        // Create new stock entry
        const {
          error: insertError
        } = await supabase.from('inventory_stock').insert({
          item_id: transferringItem.item_id,
          location_id: targetLocationId,
          quantity: transferQuantity
        });
        if (insertError) throw insertError;
      }
      toast({
        title: "Success",
        description: "Stock transferred successfully"
      });
      setIsTransferDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast({
        title: "Error",
        description: "Failed to transfer stock",
        variant: "destructive"
      });
    }
  };
  const {
    data: availableItems
  } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('inventory_items').select('*').order('product_name');
      if (error) throw error;
      return data;
    }
  });

  // Add this helper function to get stock quantity for a specific item and location
  const getStockQuantity = (itemId: string, locationId: string) => {
    return stock?.find(s => s.item_id === itemId && s.location_id === locationId)?.quantity || 0;
  };
  return (
    <div className="h-[calc(100vh-80px)] pb-6 space-y-4 my-px py-0">
      <div className="max-w-7xl space-y-8 mx-0 py-0 px-0 my-0">
        {/* Header section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stock Management</h1>
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
                        {availableItems?.map(item => (
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
                        {locations?.map(location => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input type="number" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)} />
                  </div>
                  <Button onClick={handleAddStock} className="w-full">
                    Add Stock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Table section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Search items..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
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
                  {locations?.map(location => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg border border-border bg-background overflow-hidden">
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => handleSort("quantity")}
                    >
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
                  {paginatedStock?.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-gray-50/50">
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
                      <TableCell 
                        className={cn(
                          item.quantity < (item.inventory_items.min_stock || 0) 
                            ? "text-yellow-600 font-medium" 
                            : ""
                        )}
                      >
                        {item.quantity}
                      </TableCell>
                      <TableCell>{item.inventory_items.min_stock || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTransferClick(item)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-[#000a00]/0 text-slate-800"
                          >
                            <ArrowLeftRight className="h-4 w-4" />
                            Transfer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!paginatedStock?.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-3 max-sm:flex-col">
              <p className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
                Page <span className="text-foreground">{pagination.pageIndex + 1}</span> of{" "}
                <span className="text-foreground">{totalPages}</span>
              </p>

              <div className="grow">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        size="icon"
                        variant="outline"
                        className="disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
                        disabled={pagination.pageIndex === 0}
                      >
                        <ChevronLeft size={16} strokeWidth={2} />
                      </Button>
                    </PaginationItem>

                    {showLeftEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {pages.map((page) => {
                      const isActive = page === pagination.pageIndex + 1;
                      return (
                        <PaginationItem key={page}>
                          <Button
                            size="icon"
                            variant={isActive ? "outline" : "ghost"}
                            onClick={() => setPagination(prev => ({ ...prev, pageIndex: page - 1 }))}
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      );
                    })}

                    {showRightEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <Button
                        size="icon"
                        variant="outline"
                        className="disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
                        disabled={pagination.pageIndex >= totalPages - 1}
                      >
                        <ChevronRight size={16} strokeWidth={2} />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>

              <div className="flex flex-1 justify-end">
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={(value) => setPagination(prev => ({ ...prev, pageSize: Number(value), pageIndex: 0 }))}
                >
                  <SelectTrigger className="w-fit whitespace-nowrap">
                    <SelectValue placeholder="Select number of results" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 25, 50].map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Transfer Dialog */}
        <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Transfer Stock</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>From Location</Label>
                <Select value={transferringItem?.location_id || ''} onValueChange={locationId => {
                  if (transferringItem) {
                    setTransferringItem({
                      ...transferringItem,
                      location_id: locationId,
                      inventory_locations: {
                        name: locations?.find(loc => loc.id === locationId)?.name || ''
                      }
                    });
                  }
                }}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select source location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {locations?.map(location => (
                      <SelectItem key={location.id} value={location.id} className="flex justify-between items-center">
                        <span>{location.name}</span>
                        {transferringItem && (
                          <span className="text-sm text-gray-500 ml-4">
                            Qty: {getStockQuantity(transferringItem.item_id, location.id)}
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>To Location</Label>
                <Select value={targetLocationId} onValueChange={setTargetLocationId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select target location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {locations?.map(location => (
                      <SelectItem key={location.id} value={location.id} disabled={location.id === transferringItem?.location_id} className="flex justify-between items-center">
                        <span>{location.name}</span>
                        {transferringItem && (
                          <span className="text-sm text-gray-500 ml-4">
                            Qty: {getStockQuantity(transferringItem.item_id, location.id)}
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" max={transferringItem?.quantity || 0} value={transferQuantity} onChange={e => setTransferQuantity(parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTransferStock} disabled={!targetLocationId || transferQuantity <= 0}>
                Transfer Stock
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StockManagement;
