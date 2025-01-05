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
import { ArrowUpRight, ArrowDownRight, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

type StockMovement = {
  id: string;
  item_id: string;
  location_id: string;
  quantity: number;
  created_at: string;
  inventory_items: {
    product_name: string;
    sku: string;
  };
  inventory_locations: {
    name: string;
  };
};

const StockMovements = () => {
  const { data: movements } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items (product_name, sku),
          inventory_locations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StockMovement[];
    }
  });

  console.log("Stock movements loaded:", movements);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stock Movements</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track inventory movements and history
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>Record Movement</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-white p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500">Total Movements</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{movements?.length || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements?.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    {new Date(movement.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{movement.inventory_items?.product_name}</TableCell>
                  <TableCell>{movement.inventory_items?.sku}</TableCell>
                  <TableCell>{movement.inventory_locations?.name}</TableCell>
                  <TableCell>
                    <Badge 
                      className={movement.quantity > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                    >
                      <span className="flex items-center gap-1">
                        {movement.quantity > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        {movement.quantity > 0 ? "Stock In" : "Stock Out"}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>{Math.abs(movement.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default StockMovements;