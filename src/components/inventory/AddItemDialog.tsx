import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AddItemDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    sku: "",
    unit: "",
    min_stock: 0,
    product_id: "",
    category: "",
    manufacturing_id: "",
    manufacturer: "",
    order_link: "",
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .insert([newItem]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added successfully",
      });
      
      onSuccess();
      setNewItem({
        name: "",
        description: "",
        sku: "",
        unit: "",
        min_stock: 0,
        product_id: "",
        category: "",
        manufacturing_id: "",
        manufacturer: "",
        order_link: "",
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAddItem} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="product_id">Product ID</Label>
            <Input
              id="product_id"
              value={newItem.product_id}
              onChange={(e) => setNewItem({ ...newItem, product_id: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unit">UOM</Label>
            <Input
              id="unit"
              value={newItem.unit}
              onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturing_id">Manufacturing ID</Label>
            <Input
              id="manufacturing_id"
              value={newItem.manufacturing_id}
              onChange={(e) => setNewItem({ ...newItem, manufacturing_id: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="manufacturer">Manufacturer</Label>
            <Input
              id="manufacturer"
              value={newItem.manufacturer}
              onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="order_link">Order Link</Label>
            <Input
              id="order_link"
              value={newItem.order_link}
              onChange={(e) => setNewItem({ ...newItem, order_link: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="min_stock">Minimum Stock</Label>
            <Input
              id="min_stock"
              type="number"
              value={newItem.min_stock}
              onChange={(e) => setNewItem({ ...newItem, min_stock: parseInt(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={newItem.sku}
              onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};