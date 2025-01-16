import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Pencil, ArrowUpDown, Search, Trash2, ArrowLeftRight } from "lucide-react";
import type { InventoryItem } from "@/types/database/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TransferDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fromLocationId: string;
  itemId: string;
  currentQuantity: number;
  locations: Array<{ id: string; name: string }>;
  onTransfer: (toLocationId: string, quantity: number) => Promise<void>;
}

const TransferDialog = ({ 
  isOpen, 
  onClose, 
  fromLocationId, 
  itemId,
  currentQuantity,
  locations,
  onTransfer 
}: TransferDialogProps) => {
  const [toLocationId, setToLocationId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isTransferring, setIsTransferring] = useState(false);
  const { toast } = useToast();

  const handleTransfer = async () => {
    if (!toLocationId) {
      toast({
        title: "Error",
        description: "Please select a destination location",
        variant: "destructive",
      });
      return;
    }

    if (quantity <= 0 || quantity > currentQuantity) {
      toast({
        title: "Error",
        description: "Invalid quantity",
        variant: "destructive",
      });
      return;
    }

    setIsTransferring(true);
    try {
      await onTransfer(toLocationId, quantity);
      onClose();
      toast({
        title: "Success",
        description: "Items transferred successfully",
      });
    } catch (error) {
      console.error('Transfer error:', error);
      toast({
        title: "Error",
        description: "Failed to transfer items",
        variant: "destructive",
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Items</DialogTitle>
          <DialogDescription>
            Transfer items between locations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>To Location</Label>
            <Select value={toLocationId} onValueChange={setToLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination location" />
              </SelectTrigger>
              <SelectContent>
                {locations
                  .filter(loc => loc.id !== fromLocationId)
                  .map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quantity (max: {currentQuantity})</Label>
            <Input
              type="number"
              min={1}
              max={currentQuantity}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleTransfer} 
            disabled={isTransferring || !toLocationId || quantity <= 0 || quantity > currentQuantity}
          >
            {isTransferring ? "Transferring..." : "Transfer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const InventoryTable = ({ items, onUpdate }: { items: InventoryItem[] | null, onUpdate: () => void }) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof InventoryItem>("product_name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    if (!items) return [];
    const uniqueCategories = new Set(items.map(item => item.category).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [items]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    if (!items) return [];
    
    return items
      .filter(item => {
        const matchesSearch = (
          item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sku?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === null || aValue === undefined) return sortDirection === "asc" ? 1 : -1;
        if (bValue === null || bValue === undefined) return sortDirection === "asc" ? -1 : 1;
        
        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortDirection === "asc" 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        return sortDirection === "asc" 
          ? (aValue < bValue ? -1 : 1)
          : (bValue < aValue ? -1 : 1);
      });
  }, [items, searchQuery, sortField, sortDirection, categoryFilter]);

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (item: InventoryItem) => {
    setIsDeletingItem(item);
  };

  const handleConfirmDelete = async () => {
    if (!isDeletingItem) return;

    try {
      console.log("Deleting inventory item:", isDeletingItem.id);
      
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', isDeletingItem.id);

      if (error) {
        console.error('Error deleting item:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      setIsDeletingItem(null);
      onUpdate();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      console.log("Updating inventory item:", editingItem);
      
      const { error } = await supabase
        .from('inventory_items')
        .update({
          product_name: editingItem.product_name,
          description: editingItem.description,
          sku: editingItem.sku,
          uom: editingItem.uom,
          min_stock: editingItem.min_stock,
          price: editingItem.price,
          manufacturer: editingItem.manufacturer,
          category: editingItem.category,
          order_link: editingItem.order_link,
          product_id: editingItem.product_id,
          manufacturing_id: editingItem.manufacturing_id,
        })
        .eq('id', editingItem.id);

      if (error) {
        console.error('Error updating item:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      
      setIsDialogOpen(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([]);
  const [stockLevels, setStockLevels] = useState<Array<{ location_id: string; location_name: string; quantity: number }>>([]);

  const fetchLocationsAndStock = async (itemId: string) => {
    try {
      console.log("Fetching locations and stock for item:", itemId);
      
      const { data: locationsData, error: locationsError } = await supabase
        .from('inventory_locations')
        .select('id, name')
        .order('name');
      
      if (locationsError) throw locationsError;
      setLocations(locationsData || []);

      const { data: stockData, error: stockError } = await supabase
        .from('inventory_stock')
        .select(`
          quantity,
          location_id,
          inventory_locations (
            name
          )
        `)
        .eq('item_id', itemId);

      if (stockError) throw stockError;

      const allLocationStocks = (locationsData || []).map(location => ({
        location_id: location.id,
        location_name: location.name,
        quantity: 0
      }));

      stockData?.forEach(stock => {
        const locationIndex = allLocationStocks.findIndex(
          loc => loc.location_id === stock.location_id
        );
        if (locationIndex !== -1) {
          allLocationStocks[locationIndex].quantity = stock.quantity;
        }
      });

      console.log("Fetched stock levels:", allLocationStocks);
      setStockLevels(allLocationStocks);
    } catch (error) {
      console.error('Error fetching locations and stock:', error);
      toast({
        title: "Error",
        description: "Failed to fetch locations and stock levels",
        variant: "destructive",
      });
    }
  };

  const handleTransferClick = async (item: InventoryItem) => {
    setSelectedItemId(item.id);
    setIsTransferDialogOpen(true);
    await fetchLocationsAndStock(item.id);
  };

  const handleTransfer = async (toLocationId: string, quantity: number) => {
    if (!selectedLocation || !selectedItemId) return;

    console.log("Transferring items:", {
      fromLocationId: selectedLocation,
      toLocationId,
      itemId: selectedItemId,
      quantity
    });

    const { error: decrementError } = await supabase
      .from('inventory_stock')
      .update({ 
        quantity: stockLevels.find(s => s.location_id === selectedLocation)!.quantity - quantity 
      })
      .eq('location_id', selectedLocation)
      .eq('item_id', selectedItemId);

    if (decrementError) throw decrementError;

    // Check if destination already has stock record
    const { data: existingStock } = await supabase
      .from('inventory_stock')
      .select('*')
      .eq('location_id', toLocationId)
      .eq('item_id', selectedItemId)
      .single();

    if (existingStock) {
      const { error: incrementError } = await supabase
        .from('inventory_stock')
        .update({ 
          quantity: existingStock.quantity + quantity 
        })
        .eq('location_id', toLocationId)
        .eq('item_id', selectedItemId);

      if (incrementError) throw incrementError;
    } else {
      const { error: insertError } = await supabase
        .from('inventory_stock')
        .insert({
          location_id: toLocationId,
          item_id: selectedItemId,
          quantity: quantity
        });

      if (insertError) throw insertError;
    }

    await fetchLocationsAndStock(selectedItemId);
  };

  return (
    <>
      <div className="mb-4 space-y-4 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] transition-all duration-200 hover:border-primary/50">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-white border shadow-md">
              <SelectItem value="all" className="hover:bg-gray-50">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="hover:bg-gray-50"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("sku")}
                className="hover:text-primary transition-colors duration-200"
              >
                SKU <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("product_name")}
                className="hover:text-primary transition-colors duration-200"
              >
                Product Name <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("uom")}
                className="hover:text-primary transition-colors duration-200"
              >
                UOM <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("min_stock")}
                className="hover:text-primary transition-colors duration-200"
              >
                Min Stock <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("price")}
                className="hover:text-primary transition-colors duration-200"
              >
                Price <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedItems.map((item) => (
            <TableRow 
              key={item.id} 
              className="hover:bg-gray-50/50 transition-colors duration-200 group"
            >
              <TableCell>
                <Package className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
              </TableCell>
              <TableCell className="font-mono text-sm">{item.sku}</TableCell>
              <TableCell className="font-medium">{item.product_name}</TableCell>
              <TableCell className="text-gray-600">{item.description}</TableCell>
              <TableCell>{item.uom}</TableCell>
              <TableCell>{item.min_stock}</TableCell>
              <TableCell>${item.price?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>
                <div className="flex gap-2 transition-all duration-200">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleEditClick(item)}
                    className="text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleTransferClick(item)}
                    className="text-gray-500 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                  >
                    <ArrowLeftRight className="h-4 w-4 mr-2" />
                    Transfer
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteClick(item)}
                    className="text-gray-500 hover:text-destructive hover:bg-destructive/5 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!filteredAndSortedItems.length && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No items found. Add some items to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Inventory Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_id">Product ID</Label>
                <Input
                  id="product_id"
                  value={editingItem?.product_id || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, product_id: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_name">Name</Label>
                <Input
                  id="product_name"
                  value={editingItem?.product_name || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, product_name: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingItem?.category || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, category: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uom">UOM</Label>
                <Input
                  id="uom"
                  value={editingItem?.uom || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, uom: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturing_id">Manufacturing ID</Label>
                <Input
                  id="manufacturing_id"
                  value={editingItem?.manufacturing_id || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, manufacturing_id: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={editingItem?.manufacturer || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, manufacturer: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="order_link">Order Link</Label>
                <Input
                  id="order_link"
                  value={editingItem?.order_link || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, order_link: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_stock">Minimum Stock</Label>
                <Input
                  id="min_stock"
                  type="number"
                  value={editingItem?.min_stock || 0}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, min_stock: parseInt(e.target.value)} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingItem?.price || 0}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, price: parseFloat(e.target.value)} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={editingItem?.sku || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, sku: e.target.value} : null)}
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem?.description || ''}
                  onChange={(e) => setEditingItem(prev => prev ? {...prev, description: e.target.value} : null)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-gray-50/50 transition-colors duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <TransferDialog
        isOpen={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
        fromLocationId={selectedLocation || ''}
        itemId={selectedItemId || ''}
        currentQuantity={
          stockLevels.find(s => s.location_id === selectedLocation)?.quantity || 0
        }
        locations={locations}
        onTransfer={handleTransfer}
      />
    </>
  );
};

export default InventoryTable;
