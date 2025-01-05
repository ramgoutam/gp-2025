import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Upload, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

const InventoryItems = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    sku: "",
    unit: "",
    min_stock: 0,
  });

  const { data: items, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as InventoryItem[];
    }
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
      
      refetch();
      setNewItem({
        name: "",
        description: "",
        sku: "",
        unit: "",
        min_stock: 0,
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

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').slice(1); // Skip header row
        
        const items = rows.map(row => {
          const [name, description, sku, unit, min_stock] = row.split(',');
          return {
            name: name?.trim(),
            description: description?.trim(),
            sku: sku?.trim(),
            unit: unit?.trim(),
            min_stock: parseInt(min_stock?.trim() || '0'),
          };
        }).filter(item => item.name); // Filter out empty rows

        const { error } = await supabase
          .from('inventory_items')
          .insert(items);

        if (error) throw error;

        toast({
          title: "Success",
          description: `${items.length} items imported successfully`,
        });
        
        refetch();
      } catch (error) {
        console.error('Error importing items:', error);
        toast({
          title: "Error",
          description: "Failed to import items",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Inventory Items</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your inventory master list
            </p>
          </div>
          <div className="flex gap-4">
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
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      required
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
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      required
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Item"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                className="hidden"
                id="bulk-upload"
              />
              <label htmlFor="bulk-upload">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Bulk Upload
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Min Stock</TableHead>
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
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-gray-600">{item.description}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.min_stock}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!items?.length && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No items found. Add some items to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default InventoryItems;