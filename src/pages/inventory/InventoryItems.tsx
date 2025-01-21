import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Package, Search, ListFilter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  console.log("Inventory items loaded:", items);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Row with Stats, Search, and Actions */}
        <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
          {/* Stats Card */}
          <Card className="bg-white overflow-hidden shadow hover:shadow-md transition-shadow duration-200 w-full md:w-64">
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Package className="h-5 w-5 text-primary animate-fade-in" />
                </div>
                <div className="ml-3 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Items
                    </dt>
                    <dd className="text-lg font-semibold text-primary">
                      {items?.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>

          {/* Search Bar */}
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search inventory items..."
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default">
              <ListFilter className="h-4 w-4" />
              Categories
            </Button>
            <AddItemDialog onSuccess={refetch} />
            <BulkUploadButton onSuccess={refetch} />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
          <InventoryTable items={items} onUpdate={refetch} />
        </div>
      </div>
    </div>
  );
};

export default InventoryItems;