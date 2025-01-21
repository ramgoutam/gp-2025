import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Package, Search, ListFilter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InventoryItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: items = [], refetch } = useQuery({
    queryKey: ['inventory-items', searchQuery, selectedCategory],
    queryFn: async () => {
      console.log("Fetching inventory items with filters:", { searchQuery, selectedCategory });
      
      let query = supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`product_name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    }
  });

  // Get unique categories from items
  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean)));

  console.log("Inventory items loaded:", items);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Row with Stats, Search, and Actions */}
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap bg-white rounded-lg p-4 border shadow-sm">
          {/* Stats Card */}
          <div className="flex items-center gap-3 min-w-[200px] px-4 py-2 bg-primary/5 rounded-lg">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-lg font-semibold text-primary">{items?.length || 0}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Search inventory items..."
              className="w-full pl-10 border-gray-200"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="default"
                  className={`text-gray-700 border-gray-200 hover:bg-gray-50 ${selectedCategory ? 'bg-primary/5' : ''}`}
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  {selectedCategory || "Categories"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {selectedCategory && (
                  <DropdownMenuItem 
                    onClick={() => handleCategorySelect(null)}
                    className="text-red-600"
                  >
                    Clear Filter
                  </DropdownMenuItem>
                )}
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <AddItemDialog onSuccess={refetch} />
            <BulkUploadButton onSuccess={refetch} />
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <InventoryTable items={items} onUpdate={refetch} />
        </div>
      </div>
    </div>
  );
};

export default InventoryItems;