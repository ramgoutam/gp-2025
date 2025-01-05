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
          const [name, description, sku, uom, min_stock] = row.split(',');
          return {
            name: name?.trim(),
            description: description?.trim(),
            sku: sku?.trim(),
            uom: uom?.trim(),
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

  const downloadTemplate = () => {
    const csvContent = "name,description,sku,uom,min_stock\n";
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