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
import { Package, Pencil, ArrowUpDown, Search } from "lucide-react";
import type { InventoryItem } from "@/types/database/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export const InventoryTable = ({ items, onUpdate }: { items: InventoryItem[] | null, onUpdate: () => void }) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
            <SelectContent className="bg-white border rounded-md shadow-md z-50">
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
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleEditClick(item)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-primary"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
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
    </>
  );
};
