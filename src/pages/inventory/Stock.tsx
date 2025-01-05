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
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Package2 } from "lucide-react";

type StockWithRelations = {
  id: string;
  item_id: string;
  location_id: string;
  quantity: number;
  inventory_items: {
    product_name: string;
    sku: string;
    min_stock: number;
  };
  inventory_locations: {
    name: string;
  };
};

const Stock = () => {
  const { data: stock } = useQuery({
    queryKey: ['inventory-stock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items (product_name, sku, min_stock),
          inventory_locations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StockWithRelations[];
    }
  });

  console.log("Stock data loaded:", stock);

  const getStockStatus = (quantity: number, minStock: number) => {
    if (quantity <= 0) return { label: "Out of Stock", class: "bg-red-100 text-red-800" };
    if (quantity <= minStock) return { label: "Low Stock", class: "bg-yellow-100 text-yellow-800" };
    return { label: "In Stock", class: "bg-green-100 text-green-800" };
  };

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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Items
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stock?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stock?.map((item) => {
                const status = getStockStatus(item.quantity, item.inventory_items.min_stock);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.inventory_items.product_name}</TableCell>
                    <TableCell>{item.inventory_items.sku}</TableCell>
                    <TableCell>{item.inventory_locations.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <Badge className={status.class}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Stock;