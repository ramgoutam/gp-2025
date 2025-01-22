import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InventoryTableProps {
  items: any[];
  onUpdate: () => void;
}

export const InventoryTable = ({ items, onUpdate }: InventoryTableProps) => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleSave = async (item: any) => {
    const { error } = await supabase
      .from('inventory_items')
      .update(item)
      .eq('id', item.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save item",
        variant: "destructive",
      });
      return;
    }

    setEditingItem(null);
    onUpdate();
    toast({
      title: "Success",
      description: "Item updated successfully",
    });
  };

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    const { error } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', itemToDelete);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
      return;
    }

    setItemToDelete(null);
    onUpdate();
    toast({
      title: "Success",
      description: "Item deleted successfully",
    });
  };

  return (
    <div className="relative">
      <div className="sticky top-0 z-10 bg-white border-b">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
              <TableHead className="w-[40px] font-medium text-gray-600"></TableHead>
              <TableHead className="w-[250px] font-medium text-gray-600">SKU</TableHead>
              <TableHead className="w-[300px] font-medium text-gray-600">Product Name</TableHead>
              <TableHead className="w-[300px] font-medium text-gray-600">Description</TableHead>
              <TableHead className="w-[200px] font-medium text-gray-600">UOM</TableHead>
              <TableHead className="w-[150px] font-medium text-gray-600">Min Stock</TableHead>
              <TableHead className="w-[150px] text-right font-medium text-gray-600">Price</TableHead>
              <TableHead className="w-[100px] text-right font-medium text-gray-600">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div className="overflow-auto">
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="w-[40px]"></TableCell>
                <TableCell className="w-[250px]">
                  {editingItem?.id === item.id ? (
                    <Input
                      value={editingItem.sku || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900">{item.sku}</span>
                  )}
                </TableCell>
                <TableCell className="w-[300px]">
                  {editingItem?.id === item.id ? (
                    <Input
                      value={editingItem.product_name}
                      onChange={(e) => setEditingItem({ ...editingItem, product_name: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <div>
                      <span className="text-sm font-medium text-gray-900">{item.product_name}</span>
                      {item.category && (
                        <Badge variant="secondary" className="ml-2">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="w-[300px]">
                  {editingItem?.id === item.id ? (
                    <Input
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{item.description}</span>
                  )}
                </TableCell>
                <TableCell className="w-[200px]">
                  {editingItem?.id === item.id ? (
                    <Input
                      value={editingItem.uom}
                      onChange={(e) => setEditingItem({ ...editingItem, uom: e.target.value })}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{item.uom}</span>
                  )}
                </TableCell>
                <TableCell className="w-[150px]">
                  {editingItem?.id === item.id ? (
                    <Input
                      type="number"
                      value={editingItem.min_stock || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, min_stock: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{item.min_stock || 0}</span>
                  )}
                </TableCell>
                <TableCell className="w-[150px] text-right">
                  {editingItem?.id === item.id ? (
                    <Input
                      type="number"
                      value={editingItem.price || 0}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                      className="w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">${item.price?.toFixed(2) || '0.00'}</span>
                  )}
                </TableCell>
                <TableCell className="w-[100px] text-right">
                  <div className="flex justify-end gap-2">
                    {editingItem?.id === item.id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSave(editingItem)}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(null)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Pencil className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the inventory item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
