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
import { Package, Pencil, ArrowUpDown, Search, Trash2, Eye, ArrowLeftRight, AlertTriangle, Info, MapPin } from 'lucide-react';
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
    console.log("Opening edit dialog for item:", item);
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
          qty_per_uom: editingItem.qty_per_uom,
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

  const [isViewStockDialogOpen, setIsViewStockDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [stockLevels, setStockLevels] = useState<Array<{ location_id: string; location_name: string; quantity: number }>>([]);
  const [stockSortField, setStockSortField] = useState<'location' | 'quantity'>('location');
  const [stockSortDirection, setStockSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [sourceLocationId, setSourceLocationId] = useState<string>("");
  const [targetLocationId, setTargetLocationId] = useState<string>("");
  const [transferQuantity, setTransferQuantity] = useState<number>(0);
  const [selectedStockItem, setSelectedStockItem] = useState<{
    itemId: string;
    locationId: string;
    quantity: number;
    locationName: string;
  } | null>(null);

  const fetchStockLevels = async (itemId: string) => {
    try {
      console.log("Fetching stock levels for item:", itemId);
      
      const { data: locationsData, error: locationsError } = await supabase
        .from('inventory_locations')
        .select('id, name')
        .order('name');
      
      if (locationsError) throw locationsError;

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
      console.error('Error fetching stock levels:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock levels",
        variant: "destructive",
      });
    }
  };

  const handleViewStock = async (item: InventoryItem) => {
    setViewingItem(item);
    setIsViewStockDialogOpen(true);
    await fetchStockLevels(item.id);
  };

  const sortedStockLevels = useMemo(() => {
    return [...stockLevels].sort((a, b) => {
      const aValue = stockSortField === 'location' ? a.location_name : a.quantity;
      const bValue = stockSortField === 'location' ? b.location_name : b.quantity;
      
      if (stockSortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return bValue > aValue ? 1 : -1;
    });
  }, [stockLevels, stockSortField, stockSortDirection]);

  const handleStockSort = (field: 'location' | 'quantity') => {
    if (stockSortField === field) {
      setStockSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setStockSortField(field);
      setStockSortDirection('asc');
    }
  };

  const handleTransferClick = (itemId: string, locationId: string, quantity: number, locationName: string) => {
    setSelectedStockItem({
      itemId,
      locationId,
      quantity,
      locationName,
    });
    setSourceLocationId(locationId);
    setTransferQuantity(0);
    setTargetLocationId("");
    setIsTransferDialogOpen(true);
  };

  const handleTransferStock = async () => {
    if (!selectedStockItem || !targetLocationId || transferQuantity <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields with valid values.",
        variant: "destructive",
      });
      return;
    }

    if (transferQuantity > selectedStockItem.quantity) {
      toast({
        title: "Error",
        description: "Transfer quantity cannot exceed available stock.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Transferring stock:", {
        itemId: selectedStockItem.itemId,
        sourceLocationId: sourceLocationId,
        targetLocationId,
        quantity: transferQuantity
      });

      // First, check if we have enough stock in the source location
      if (selectedStockItem.quantity < transferQuantity) {
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
          quantity: selectedStockItem.quantity - transferQuantity 
        })
        .eq('item_id', selectedStockItem.itemId)
        .eq('location_id', sourceLocationId);

      if (sourceError) throw sourceError;

      // 2. Check if target location already has stock of this item
      const { data: targetStock } = await supabase
        .from('inventory_stock')
        .select('quantity')
        .eq('item_id', selectedStockItem.itemId)
        .eq('location_id', targetLocationId)
        .maybeSingle();

      if (targetStock) {
        // Update existing stock
        const { error: targetError } = await supabase
          .from('inventory_stock')
          .update({ 
            quantity: targetStock.quantity + transferQuantity 
          })
          .eq('item_id', selectedStockItem.itemId)
          .eq('location_id', targetLocationId);

        if (targetError) throw targetError;
      } else {
        // Create new stock entry
        const { error: insertError } = await supabase
          .from('inventory_stock')
          .insert({
            item_id: selectedStockItem.itemId,
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
      fetchStockLevels(selectedStockItem.itemId);
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast({
        title: "Error",
        description: "Failed to transfer stock",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="relative">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 transition-colors duration-200">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("sku")}
                      className="hover:text-primary font-medium transition-colors duration-200 -ml-4 group"
                    >
                      SKU 
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("product_name")}
                      className="hover:text-primary font-medium transition-colors duration-200 -ml-4 group"
                    >
                      Product Name 
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-medium text-gray-700">Description</TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("uom")}
                      className="hover:text-primary font-medium transition-colors duration-200 -ml-4 group"
                    >
                      UOM 
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("min_stock")}
                      className="hover:text-primary font-medium transition-colors duration-200 -ml-4 group"
                    >
                      Min Stock 
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("price")}
                      className="hover:text-primary font-medium transition-colors duration-200 -ml-4 group"
                    >
                      Price 
                      <ArrowUpDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[calc(100vh-16rem)] overflow-auto">
            <Table>
              <TableBody>
                {filteredAndSortedItems.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="hover:bg-gray-50/50 transition-all duration-200 group border-gray-100 animate-fade-in"
                  >
                    <TableCell>
                      <Package className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{item.sku}</TableCell>
                    <TableCell className="font-medium text-gray-900">{item.product_name}</TableCell>
                    <TableCell className="text-gray-600 max-w-md truncate">{item.description}</TableCell>
                    <TableCell className="text-gray-600">{item.uom}</TableCell>
                    <TableCell className="text-gray-600">{item.min_stock}</TableCell>
                    <TableCell className="text-gray-600">${item.price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditClick(item)}
                          className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                          title="Edit Item"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewStock(item)}
                          className="h-8 w-8 text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors duration-200"
                          title="View Stock"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(item)}
                          className="h-8 w-8 text-gray-600 hover:text-destructive hover:bg-destructive/5 transition-colors duration-200"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredAndSortedItems.length && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 animate-fade-in">
                        <Package className="h-8 w-8 text-gray-400 mb-2" />
                        No items found. Add some items to get started.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Product Details
            </DialogTitle>
            <DialogDescription>
              Make changes to the product information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <ScrollArea className="max-h-[600px]">
              <div className="grid gap-4 py-4 px-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_id">Product ID</Label>
                    <Input
                      id="product_id"
                      value={editingItem?.product_id || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, product_id: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Product Name</Label>
                    <Input
                      id="product_name"
                      value={editingItem?.product_name || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, product_name: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={editingItem?.sku || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, sku: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={editingItem?.category || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, category: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uom">Unit of Measure</Label>
                    <Input
                      id="uom"
                      value={editingItem?.uom || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, uom: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_stock">Minimum Stock</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={editingItem?.min_stock || 0}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, min_stock: parseInt(e.target.value) } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={editingItem?.price || 0}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturing_id">Manufacturing ID</Label>
                    <Input
                      id="manufacturing_id"
                      value={editingItem?.manufacturing_id || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, manufacturing_id: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={editingItem?.manufacturer || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, manufacturer: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qty_per_uom">Quantity per UOM</Label>
                    <Input
                      id="qty_per_uom"
                      type="number"
                      min="1"
                      value={editingItem?.qty_per_uom || 1}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, qty_per_uom: parseInt(e.target.value) } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="order_link">Order Link</Label>
                    <Input
                      id="order_link"
                      value={editingItem?.order_link || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, order_link: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-primary hover:bg-primary/90"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Stock Dialog */}
      <Dialog open={isViewStockDialogOpen} onOpenChange={setIsViewStockDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Stock Levels
            </DialogTitle>
            <DialogDescription>
              Current stock levels for <span className="font-medium">{viewingItem?.product_name}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
              {sortedStockLevels.map((stock) => (
                <div
                  key={stock.location_id}
                  className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-gray-900">{stock.location_name}</h3>
                    </div>
                    {stock.quantity > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTransferClick(
                          viewingItem?.id || '',
                          stock.location_id,
                          stock.quantity,
                          stock.location_name
                        )}
                        className="flex items-center gap-1 text-sm hover:bg-primary/5"
                      >
                        <ArrowLeftRight className="h-3 w-3" />
                        Transfer
                      </Button>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn(
                      "text-2xl font-semibold",
                      stock.quantity === 0 ? "text-gray-400" : "text-primary",
                      stock.quantity < (viewingItem?.min_stock || 0) ? "text-yellow-600" : ""
                    )}>
                      {stock.quantity}
                    </span>
                    <span className="text-gray-500 text-sm">units</span>
                  </div>
                  {stock.quantity < (viewingItem?.min_stock || 0) && stock.quantity > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-yellow-600 text-sm">
                      <AlertTriangle className="h-3 w-3" />
                      Below minimum stock
                    </div>
                  )}
                  {stock.quantity === 0 && (
                    <div className="mt-2 flex items-center gap-1 text-gray-400 text-sm">
                      <Info className="h-3 w-3" />
                      No stock available
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Stock Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Transfer Stock
            </DialogTitle>
            <DialogDescription>
              Transfer stock from {selectedStockItem?.locationName} to another location
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From Location</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedStockItem?.locationName}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>To Location</Label>
              <Select value={targetLocationId} onValueChange={setTargetLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target location" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  {stockLevels
                    .filter(location => location.location_id !== sourceLocationId)
                    .map((location) => (
                      <SelectItem 
                        key={location.location_id} 
                        value={location.location_id}
                        className="hover:bg-gray-50"
                      >
                        {location.location_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity (Available: {selectedStockItem?.quantity})</Label>
              <Input
                type="number"
                min="1"
                max={selectedStockItem?.quantity || 0}
                value={transferQuantity}
                onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
                className="focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTransferDialogOpen(false)}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransferStock}
              disabled={!targetLocationId || transferQuantity <= 0 || (selectedStockItem && transferQuantity > selectedStockItem.quantity)}
              className="bg-primary hover:bg-primary/90"
            >
              Transfer Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!isDeletingItem} onOpenChange={(open) => !open && setIsDeletingItem(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Inventory Item
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{isDeletingItem?.product_name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeletingItem(null)}
              className="hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90 transition-colors duration-200"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryTable;
