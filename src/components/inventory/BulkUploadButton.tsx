import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const BulkUploadButton = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').slice(1); // Skip header row
        
        const items = rows.map(row => {
          const [
            product_id,
            product_name,
            category,
            uom,
            manufacturing_id,
            manufacturer,
            order_link,
            min_stock,
            sku,
            description,
            price
          ] = row.split(',').map(field => field.trim());
          
          return {
            product_id,
            product_name,
            category,
            uom,
            manufacturing_id,
            manufacturer,
            order_link,
            min_stock: parseInt(min_stock || '0'),
            sku,
            description,
            price: parseFloat(price || '0')
          };
        }).filter(item => item.product_name && item.uom); // Ensure required fields are present

        // First check for existing SKUs
        const skus = items.map(item => item.sku).filter(Boolean);
        if (skus.length > 0) {
          const { data: existingItems } = await supabase
            .from('inventory_items')
            .select('sku')
            .in('sku', skus);

          const existingSkus = new Set(existingItems?.map(item => item.sku));
          const newItems = items.filter(item => !item.sku || !existingSkus.has(item.sku));

          if (newItems.length < items.length) {
            toast({
              title: "Warning",
              description: `${items.length - newItems.length} items skipped due to duplicate SKUs`,
              variant: "destructive",
            });
          }

          if (newItems.length === 0) {
            toast({
              title: "Error",
              description: "All items have duplicate SKUs",
              variant: "destructive",
            });
            return;
          }

          const { error } = await supabase
            .from('inventory_items')
            .insert(newItems);

          if (error) throw error;

          toast({
            title: "Success",
            description: `${newItems.length} items imported successfully`,
          });
        }
        
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

  const downloadTemplate = () => {
    const csvContent = "product_id,product_name,category,uom,manufacturing_id,manufacturer,order_link,min_stock,sku,description,price\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".csv"
        onChange={handleBulkUpload}
        className="hidden"
        ref={fileInputRef}
        id="bulk-upload"
      />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={downloadTemplate} className="gap-2">
            <Download className="h-4 w-4" />
            Download CSV Format
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload CSV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};