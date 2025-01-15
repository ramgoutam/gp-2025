import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Plus, ArrowUpDown, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { AddLocationDialog } from "@/components/inventory/AddLocationDialog";
import { Badge } from "@/components/ui/badge";

type StockWithRelations = {
  id: string;
  quantity: number;
  item_id: string;
  location_id: string;
  inventory_items: {
    product_name: string;
    sku: string;
    min_stock: number;
  };
  inventory_locations: {
    name: string;
  };
};

type LocationTotals = {
  [key: string]: {
    total_items: number;
    total_quantity: number;
  };
};

const StockManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortField, setSortField] = useState<keyof StockWithRelations>("quantity");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { toast } = useToast();

  const { data: stock, isLoading, refetch } = useQuery({
    queryKey: ['inventory-stock'],
    queryFn: async () => {
      console.log("Fetching inventory stock data");
      const { data, error } = await supabase
        .from('inventory_stock')
        .select(`
          *,
          inventory_items (product_name, sku, min_stock),
          inventory_locations (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching stock:", error);
        throw error;
      }
      return data as StockWithRelations[];
    }
  });

  const { data: locations } = useQuery({
    queryKey: ['inventory-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_locations')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const locationTotals: LocationTotals = stock?.reduce((acc: LocationTotals, item) => {
    const locationName = item.inventory_locations.name;
    if (!acc[locationName]) {
      acc[locationName] = { total_items: 0, total_quantity: 0 };
    }
    acc[locationName].total_items += 1;
    acc[locationName].total_quantity += item.quantity;
    return acc;
  }, {}) || {};

  const handleSort = (field: keyof StockWithRelations) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredStock = stock?.filter(item => {
    const matchesSearch = 
      item.inventory_items.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.inventory_items.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || item.inventory_locations.name === locationFilter;
    
    return matchesSearch && matchesLocation;
  }).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    return sortDirection === "asc" ? 
      (aValue > bValue ? 1 : -1) : 
      (bValue > aValue ? 1 : -1);
  });

  const handleAdjustStock = async (stockId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from('inventory_stock')
        .update({ quantity: newQuantity })
        .eq('id', stockId);

      if (error) throw error;

      toast({
        title: "Stock Updated",
        description: "The stock quantity has been successfully updated.",
      });

      refetch();
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: "Error",
        description: "Failed to update stock quantity.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stock Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage inventory stock levels across different locations
            </p>
          </div>
          <div className="flex gap-4">
            <AddLocationDialog onLocationAdded={refetch} />
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(locationTotals).map(([location, totals]) => (
            <Card key={location} className="p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-gray-900">{location}</h3>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-semibold">{totals.total_items}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Quantity</p>
                  <p className="text-2xl font-semibold">{totals.total_quantity}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="bg-white border rounded-lg shadow-lg">
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort("quantity")}>
                    <div className="flex items-center gap-2">
                      Quantity
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Min. Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock?.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-mono text-sm">
                      {item.inventory_items.sku}
                    </TableCell>
                    <TableCell>{item.inventory_items.product_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <MapPin className="h-3 w-3 mr-1" />
                        {item.inventory_locations.name}
                      </Badge>
                    </TableCell>
                    <TableCell className={
                      item.quantity < (item.inventory_items.min_stock || 0)
                        ? "text-yellow-600 font-medium"
                        : ""
                    }>
                      {item.quantity}
                    </TableCell>
                    <TableCell>{item.inventory_items.min_stock || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdjustStock(item.id, item.quantity + 1)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Adjust
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!filteredStock?.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                      No items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;