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

const StockManagement = () => {
  const { data: stock } = useQuery({
    queryKey: ['inventory-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items (name, sku),
          inventory_locations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stock Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track stock levels across different locations
            </p>
          </div>
          <Button>Update Stock</Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.inventory_items.name}</TableCell>
                  <TableCell>{item.inventory_items.sku}</TableCell>
                  <TableCell>{item.inventory_locations.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;