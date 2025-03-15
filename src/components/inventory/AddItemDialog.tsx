
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const AddItemDialog = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customUom, setCustomUom] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [newItem, setNewItem] = useState({
    product_name: "",
    description: "",
    sku: "",
    uom: "",
    min_stock: 0,
    product_id: "",
    category: "",
    manufacturing_id: "",
    manufacturer: "",
    order_link: "",
    price: 0,
    qty_per_uom: 1,
  });

  const uomOptions = ["ML", "Unit", "Gm", "Pr", "Ga"];

  useEffect(() => {
    // Fetch existing categories from inventory items
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('category')
          .not('category', 'is', null);
        
        if (error) throw error;
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map(item => item.category).filter(Boolean))
        ) as string[];
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("Adding new inventory item:", newItem);
      
      const { error } = await supabase
        .from('inventory_items')
        .insert(newItem);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item added successfully",
      });
      
      onSuccess();
      setNewItem({
        product_name: "",
        description: "",
        sku: "",
        uom: "",
        min_stock: 0,
        product_id: "",
        category: "",
        manufacturing_id: "",
        manufacturer: "",
        order_link: "",
        price: 0,
        qty_per_uom: 1,
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

  const handleAddCustomUom = () => {
    if (customUom.trim()) {
      setNewItem({ ...newItem, uom: customUom.trim() });
      setCustomUom("");
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setNewItem({ ...newItem, category: customCategory.trim() });
      setCustomCategory("");
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
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-4">
          <form onSubmit={handleAddItem} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="product_name">Name</Label>
                <Input
                  id="product_name"
                  value={newItem.product_name}
                  onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <div className="flex gap-2">
                  <Select 
                    value={newItem.category} 
                    onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      {newItem.category && !categories.includes(newItem.category) ? (
                        <SelectItem value={newItem.category}>{newItem.category}</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" type="button" className="px-3">+</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-white p-4 shadow-lg z-[100]">
                      <div className="space-y-2">
                        <Label htmlFor="custom-category">Add Custom Category</Label>
                        <div className="flex gap-2">
                          <Input
                            id="custom-category"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="Enter custom category"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddCustomCategory}
                            disabled={!customCategory.trim()}
                            variant="secondary"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="uom">UOM</Label>
                <div className="flex gap-2">
                  <Select 
                    value={newItem.uom} 
                    onValueChange={(value) => setNewItem({ ...newItem, uom: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select UOM" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {uomOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                      {newItem.uom && !uomOptions.includes(newItem.uom) ? (
                        <SelectItem value={newItem.uom}>{newItem.uom}</SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" type="button" className="px-3">+</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 bg-white p-4 shadow-lg z-[100]">
                      <div className="space-y-2">
                        <Label htmlFor="custom-uom">Add Custom UOM</Label>
                        <div className="flex gap-2">
                          <Input
                            id="custom-uom"
                            value={customUom}
                            onChange={(e) => setCustomUom(e.target.value)}
                            placeholder="Enter custom UOM"
                          />
                          <Button 
                            type="button" 
                            onClick={handleAddCustomUom}
                            disabled={!customUom.trim()}
                            variant="secondary"
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="qty_per_uom">Quantity per UOM</Label>
                <Input
                  id="qty_per_uom"
                  type="number"
                  min="1"
                  value={newItem.qty_per_uom}
                  onChange={(e) => setNewItem({ ...newItem, qty_per_uom: parseInt(e.target.value) })}
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
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
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Item"}
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
