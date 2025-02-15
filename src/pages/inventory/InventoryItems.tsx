import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { Package, Search, ListFilter, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
const initialColumns = ["product_name", "sku", "category", "manufacturer", "quantity", "price", "actions"];
const InventoryItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(initialColumns);
  const {
    toast
  } = useToast();
  const {
    data: items = [],
    refetch
  } = useQuery({
    queryKey: ['inventory-items', searchQuery, selectedCategory],
    queryFn: async () => {
      console.log("Fetching inventory items with filters:", {
        searchQuery,
        selectedCategory
      });
      let query = supabase.from('inventory_items').select('*').order('created_at', {
        ascending: false
      });
      if (searchQuery) {
        query = query.or(`product_name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data;
    }
  });
  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean))).sort();
  const filteredCategories = categories.filter(category => category.toLowerCase().includes(categorySearchQuery.toLowerCase()));
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]);
  };
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setShowCategoryDialog(false);
  };
  return <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap bg-white rounded-lg p-4 pt-4 border shadow-sm mb-4 flex-shrink-0 mt-4">
        <div className="flex items-center gap-3 min-w-[200px] px-4 py-2 bg-primary/5 rounded-lg transition-all duration-200 hover:bg-primary/10">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-lg font-semibold text-primary">{items?.length || 0}</p>
          </div>
        </div>

        <div className="relative flex-1">
          <Input type="search" placeholder="Search inventory items..." className="w-full pl-10 border-gray-200 focus:ring-primary/20 transition-all duration-200" value={searchQuery} onChange={handleSearch} />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="default" onClick={() => setShowCategoryDialog(true)} className={`text-gray-700 border-gray-200 hover:bg-gray-50 transition-all duration-200 ${selectedCategory ? 'bg-primary/5' : ''}`}>
            <ListFilter className="h-4 w-4 mr-2" />
            {selectedCategory || "Categories"}
          </Button>
          <AddItemDialog onSuccess={refetch} />
          <BulkUploadButton onSuccess={refetch} />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between my-0 mx-0 px-0 py-[4px]">
          <div>
            
            
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] my-0 mx-px px-0 py-0 bg-white">
              {initialColumns.map(column => <DropdownMenuCheckboxItem key={column} checked={selectedColumns.includes(column)} onCheckedChange={() => handleColumnToggle(column)} className="rounded px-[30px] my-[9px] py-[2px] mx-[7px] bg-slate-50 hover:bg-slate-30">
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </DropdownMenuCheckboxItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {selectedColumns.map(column => <TableHead key={column} className="bg-slate-300 hover:bg-slate-200">
                    {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => <TableRow key={item.id}>
                  {selectedColumns.map(column => <TableCell key={column}>
                      {column === 'product_name' ? <span className="font-medium">{item.product_name}</span> : column === 'actions' ? <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div> : column === 'price' ? `$${item[column]?.toFixed(2) || '0.00'}` : item[column] || 'N/A'}
                    </TableCell>)}
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input type="search" placeholder="Search categories..." value={categorySearchQuery} onChange={e => setCategorySearchQuery(e.target.value)} className="w-full pl-10" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <ScrollArea className="h-[300px]">
              {selectedCategory && <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleCategorySelect(null)}>
                  Clear Selection
                </Button>}
              {filteredCategories.map(category => <Button key={category} variant="ghost" className={`w-full justify-start ${selectedCategory === category ? 'bg-primary/10 text-primary' : ''}`} onClick={() => handleCategorySelect(category)}>
                  {category}
                </Button>)}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default InventoryItems;