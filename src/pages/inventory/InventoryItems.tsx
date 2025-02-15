
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { Package, Search, ListFilter, Eye, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const initialColumns = [
  "product_name",
  "sku",
  "category",
  "price",
  "quantity",
  "status",
  "email",
  "actions",
];

const InventoryItems = () => {
  const [selectedColumns, setSelectedColumns] = useState(initialColumns);
  const { toast } = useToast();

  const { data: items = [], refetch } = useQuery({
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

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStatusColor = (value: number) => {
    if (value <= 0) return "text-red-500";
    if (value <= 10) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="mx-auto my-6 w-full max-w-7xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>
            View and manage your inventory items, including stock levels and pricing
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="default" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Export
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {initialColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={() => handleColumnToggle(column)}
                >
                  {column.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search inventory..." 
              className="pl-10"
            />
          </div>
          <AddItemDialog onSuccess={refetch} />
          <BulkUploadButton onSuccess={refetch} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {selectedColumns.map((column) => (
                <TableHead key={column} className="font-medium">
                  {column.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                {selectedColumns.map((column) => (
                  <TableCell key={column}>
                    {column === "product_name" ? (
                      <span className="font-medium">{item.product_name}</span>
                    ) : column === "price" ? (
                      formatCurrency(item.price || 0)
                    ) : column === "quantity" ? (
                      <span className={getStatusColor(item.quantity || 0)}>
                        {item.quantity || 0}
                      </span>
                    ) : column === "status" ? (
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        (item.quantity || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {(item.quantity || 0) > 0 ? 'Active' : 'Inactive'}
                      </span>
                    ) : column === "actions" ? (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      item[column] || 'N/A'
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InventoryItems;
