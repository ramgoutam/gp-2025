import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { InventoryTable } from "@/components/inventory/InventoryTable";

const InventoryItems = () => {
  const { data: items, refetch } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
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
            <h1 className="text-2xl font-semibold text-gray-900">Inventory Items</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your inventory master list
            </p>
          </div>
          <div className="flex gap-4">
            <AddItemDialog onSuccess={refetch} />
            <BulkUploadButton onSuccess={refetch} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <InventoryTable items={items} />
        </div>
      </div>
    </div>
  );
};

export default InventoryItems;