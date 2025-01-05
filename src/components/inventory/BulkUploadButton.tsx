import React from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const BulkUploadButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').slice(1); // Skip header row
        
        const items = rows.map(row => {
          const [name, description, sku, uom, min_stock] = row.split(',');
          return {
            name: name?.trim(),
            description: description?.trim(),
            sku: sku?.trim(),
            uom: uom?.trim(), // Changed from unit to uom
            min_stock: parseInt(min_stock?.trim() || '0'),
          };
        }).filter(item => item.name && item.uom); // Ensure required fields are present

        const { error } = await supabase
          .from('inventory_items')
          .insert(items);

        if (error) throw error;

        toast({
          title: "Success",
          description: `${items.length} items imported successfully`,
        });
        
        onSuccess();
      } catch (error) {
        console.error('Error importing items:', error);
        toast({
          title: "Error",
          description: "Failed to import items",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".csv"
        onChange={handleBulkUpload}
        className="hidden"
        id="bulk-upload"
      />
      <label htmlFor="bulk-upload">
        <Button variant="outline" className="flex items-center gap-2" asChild>
          <span>
            <Upload className="h-4 w-4" />
            Bulk Upload
          </span>
        </Button>
      </label>
    </div>
  );
};