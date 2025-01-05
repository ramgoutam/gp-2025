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
import type { InventoryItem } from "@/types/database/inventory";

export const InventoryTable = ({ items }: { items: InventoryItem[] | null }) => {
  return (
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
              <Button variant="ghost" size="sm">
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
  );
};