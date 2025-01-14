import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Pencil } from "lucide-react";
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

export const InventoryTable = ({ items, onUpdate }: { items: InventoryItem[] | null, onUpdate: () => void }) => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
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

      if (error) throw error;

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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>UOM</TableHead>
            <TableHead>Min Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell>
                <Package className="h-5 w-5 text-gray-400" />
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
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!items?.length && (
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
            <DialogTitle>Edit Inventory Item</DialogTitle>
          </DialogHeader>
          <ScrollArea className="pr-4">
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
