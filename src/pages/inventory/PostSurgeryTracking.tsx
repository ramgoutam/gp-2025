import React from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, Upload } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

interface PostSurgeryItem {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  surgeryDate: string;
  status: string;
  notes: string;
}

const columns: ColumnDef<PostSurgeryItem>[] = [
  {
    accessorKey: "itemName",
    header: "Item Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "surgeryDate",
    header: "Surgery Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
];

const PostSurgeryTracking = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <FileSpreadsheet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Post-Surgery Inventory Tracking</h1>
            <p className="text-sm text-gray-500">Track and manage post-surgery inventory items</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </div>
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

export default PostSurgeryTracking;