import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
export const BulkUploadButton = ({
  onSuccess
}: {
  onSuccess: () => void;
}) => {
  const {
    toast
  } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async event => {
      try {
        console.log("Starting bulk upload process");
        const csvData = event.target?.result as string;
        const rows = csvData.split('\n').slice(1); // Skip header row

        const items = rows.map(row => {
          const [product_id, product_name, category, uom, manufacturing_id, manufacturer, order_link, min_stock, sku, description, price] = row.split(',').map(field => field.trim());
          return {
            product_id,
            product_name,
            category,
            uom,
            manufacturing_id,
            manufacturer,
            order_link,
            min_stock: parseInt(min_stock || '0'),
            sku: sku || null,
            // Make SKU nullable if empty
            description,
            price: parseFloat(price || '0')
          };
        }).filter(item => item.product_name && item.uom); // Ensure required fields are present

        console.log("Parsed items:", items);

        // First check for existing SKUs
        const skus = items.map(item => item.sku).filter(Boolean);
        if (skus.length > 0) {
          console.log("Checking for existing SKUs:", skus);
          const {
            data: existingItems,
            error: skuCheckError
          } = await supabase.from('inventory_items').select('sku').in('sku', skus);
          if (skuCheckError) {
            console.error("Error checking SKUs:", skuCheckError);
            throw skuCheckError;
          }
          const existingSkus = new Set(existingItems?.map(item => item.sku));
          console.log("Found existing SKUs:", existingSkus);

          // Filter out items with duplicate SKUs
          const newItems = items.filter(item => !item.sku || !existingSkus.has(item.sku));
          console.log("Filtered new items:", newItems);
          if (newItems.length < items.length) {
            toast({
              title: "Warning",
              description: `${items.length - newItems.length} items skipped due to duplicate SKUs`,
              variant: "destructive"
            });
          }
          if (newItems.length === 0) {
            toast({
              title: "Error",
              description: "All items have duplicate SKUs",
              variant: "destructive"
            });
            return;
          }

          // Insert items one by one to better handle errors
          let successCount = 0;
          for (const item of newItems) {
            try {
              const {
                error: insertError
              } = await supabase.from('inventory_items').insert([item]);
              if (insertError) {
                console.error("Error inserting item:", item, insertError);
                toast({
                  title: "Error",
                  description: `Failed to insert item ${item.product_name}: ${insertError.message}`,
                  variant: "destructive"
                });
              } else {
                successCount++;
              }
            } catch (error) {
              console.error("Error processing item:", item, error);
            }
          }
          if (successCount > 0) {
            toast({
              title: "Success",
              description: `${successCount} items imported successfully`
            });
            onSuccess();
          }
        }
      } catch (error) {
        console.error('Error importing items:', error);
        toast({
          title: "Error",
          description: "Failed to import items. Please check the console for details.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };
  const downloadTemplate = () => {
    const csvContent = "product_id,product_name,category,uom,manufacturing_id,manufacturer,order_link,min_stock,sku,description,price\n";
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inventory_template.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };
  return <div className="relative">
      <input type="file" accept=".csv" onChange={handleBulkUpload} className="hidden" ref={fileInputRef} id="bulk-upload" />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
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
    </div>;
};