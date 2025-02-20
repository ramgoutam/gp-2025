
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/patient/table/DataTable";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Download, Upload, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { supabase } from "@/integrations/supabase/client";
import { AddPostSurgeryItemDialog } from "@/components/inventory/AddPostSurgeryItemDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface PostSurgeryItem {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  surgery_date: string;
  status: string;
  notes: string;
}

const columns: ColumnDef<PostSurgeryItem>[] = [
  {
    accessorKey: "item_name",
    header: "Item Name",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.category || "N/A"}
      </Badge>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "surgery_date",
    header: "Surgery Date",
    cell: ({ row }) => format(new Date(row.original.surgery_date), 'MMM dd, yyyy'),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === 'completed' ? 'default' : 'secondary'}>
        {row.original.status || "pending"}
      </Badge>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
];

const PostSurgeryTracking = () => {
  const [items, setItems] = useState<PostSurgeryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('post_surgery_items')
        .select('*')
        .order('surgery_date', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <AddPostSurgeryItemDialog />
        </div>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={items}
        />
      </Card>
    </div>
  );
};

export default PostSurgeryTracking;
