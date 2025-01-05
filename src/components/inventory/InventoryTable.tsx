import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type InventoryItem = Database['public']['Tables']['inventory_items']['Row'];

export const InventoryTable = ({ items }: { items: InventoryItem[] | null }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12"></TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>UOM</TableHead>
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
            <TableCell>{item.uom}</TableCell>
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
  );
};