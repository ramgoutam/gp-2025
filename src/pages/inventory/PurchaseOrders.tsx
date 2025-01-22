import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-primary hover:text-primary/80"
          onClick={() => navigate(`/inventory/purchase-orders/${row.original.id}`)}
        >
          {row.getValue("poNumber")}
        </Button>
      );
    },
  },
  {
    accessorKey: "supplierName",
    header: "Supplier",
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => format(new Date(row.getValue("orderDate")), "MMM d, yyyy"),
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return formatted;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let variant: "default" | "secondary" | "outline" = "default";
      
      switch (status.toLowerCase()) {
        case "draft":
          variant = "secondary";
          break;
        case "pending":
          variant = "outline";
          break;
        case "approved":
          variant = "default";
          break;
      }
      
      return (
        <Badge variant={variant} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
];

const PurchaseOrders = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
            <p className="text-sm text-gray-500">Manage your purchase orders</p>
          </div>
        </div>
        <Button
          onClick={() => navigate("/inventory/purchase-orders/create")}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Purchase Order
        </Button>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={[]} // This will be populated with actual data once connected to the backend
        />
      </Card>
    </div>
  );
};

export default PurchaseOrders;