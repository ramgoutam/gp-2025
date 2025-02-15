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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialColumns = ["product_name", "sku", "category", "manufacturer", "quantity", "price", "actions"];

const InventoryItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(initialColumns);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const { toast } = useToast();

  const {
    data: items = [],
    refetch
  } = useQuery({
    queryKey: ['inventory-items', searchQuery, selectedCategory],
    queryFn: async () => {
      console.log("Fetching inventory items with filters:", { searchQuery, selectedCategory });
      let query = supabase.from('inventory_items').select('*').order('created_at', { ascending: false });
      
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

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update(editingItem)
        .eq('id', editingItem.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      
      setEditingItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemToDelete.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean))).sort();
  const filteredCategories = categories.filter(category => category.toLowerCase().includes(categorySearchQuery.toLowerCase()));

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
    );
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setShowCategoryDialog(false);
  };

  return (
    <div className="h-[calc(100vh-80px)] pb-6 space-y-4 my-px py-0">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap bg-white rounded-lg p-4 pt-4 border shadow-sm mb-4 flex-shrink-0 mt-4">
        <div className="flex items-center gap-3 min-w-[200px] py-2 bg-primary/5 rounded-lg transition-all duration-200 hover:bg-primary/10 px-[11px] mx-0">
          <Package className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-gray-500">Total Items</p>
            <p className="text-lg font-semibold text-primary">{items?.length || 0}</p>
          </div>
        </div>

        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search inventory items..."
            className="w-full pl-10 border-gray-200 focus:ring-primary/20 transition-all duration-200"
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowCategoryDialog(true)}
            className={`text-gray-700 border-gray-200 hover:bg-gray-50 transition-all duration-200 ${selectedCategory ? 'bg-primary/5' : ''}`}
          >
            <ListFilter className="h-4 w-4 mr-2" />
            {selectedCategory || "Categories"}
          </Button>
          <AddItemDialog onSuccess={refetch} />
          <BulkUploadButton onSuccess={refetch} />
        </div>
      </div>

      <Card className="mx-0 h-[calc(100%-120px)] py-0">
        <CardHeader className="flex flex-row items-center justify-between my-0 px-0 mx-[10px] rounded-lg py-0">
          <div></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="ml-2">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] my-0 mx-px px-0 py-0 bg-white">
              {initialColumns.map(column => (
                <DropdownMenuCheckboxItem
                  key={column}
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={() => handleColumnToggle(column)}
                  className="rounded mx-[7px] hover:bg-slate-50 bg-white px-[34px] py-[3px] my-[2px]"
                >
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-[8px] relative h-[calc(100%-60px)] mx-0 py-px my-[6px]">
          <div className="relative h-full overflow-hidden border rounded-md">
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map(column => (
                      <TableHead 
                        key={column} 
                        className="bg-slate-100"
                        style={{
                          width: column === 'product_name' ? '250px' : 
                                 column === 'sku' ? '180px' :
                                 column === 'actions' ? '120px' :
                                 '200px',
                          minWidth: column === 'product_name' ? '250px' : 
                                   column === 'sku' ? '180px' :
                                   column === 'actions' ? '120px' :
                                   '200px'
                        }}
                      >
                        {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="overflow-auto h-[calc(100%-40px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors">
              <Table>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      {selectedColumns.map(column => (
                        <TableCell 
                          key={column}
                          style={{
                            width: column === 'product_name' ? '250px' : 
                                   column === 'sku' ? '180px' :
                                   column === 'actions' ? '120px' :
                                   '200px',
                            minWidth: column === 'product_name' ? '250px' : 
                                     column === 'sku' ? '180px' :
                                     column === 'actions' ? '120px' :
                                     '200px'
                          }}
                        >
                          {column === 'product_name' ? (
                            <span className="font-medium">{item.product_name}</span>
                          ) : column === 'actions' ? (
                            <div className="flex items-center gap-2">
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setViewingItem(item)}
                                className="hover:bg-slate-100"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => setEditingItem(item)}
                                className="hover:bg-blue-50"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                  setItemToDelete(item);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : column === 'price' ? (
                            `$${item[column]?.toFixed(2) || '0.00'}`
                          ) : (
                            item[column] || 'N/A'
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Item Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>View Item Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {viewingItem && Object.entries(viewingItem).map(([key, value]) => (
              key !== 'id' && key !== 'created_at' && key !== 'updated_at' && (
                <div key={key} className="grid gap-2">
                  <Label htmlFor={key} className="capitalize">
                    {key.split('_').join(' ')}
                  </Label>
                  <div className="px-3 py-2 border rounded-md bg-slate-50">
                    {key === 'price' ? `$${(value as number)?.toFixed(2) || '0.00'}` : String(value || 'N/A')}
                  </div>
                </div>
              )
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={editingItem?.product_name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, product_name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={editingItem?.sku || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editingItem?.category || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={editingItem?.manufacturer || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, manufacturer: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={editingItem?.price || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingItem?.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDeleteDialogOpen(false);
              setItemToDelete(null);
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-[1025px] my-[11px] mx-[7px] px-[72px]">
          <DialogHeader>
            <DialogTitle>Select Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search categories..."
                value={categorySearchQuery}
                onChange={e => setCategorySearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <ScrollArea className="h-[300px]">
              {selectedCategory && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleCategorySelect(null)}
                >
                  Clear Selection
                </Button>
              )}
              {filteredCategories.map(category => (
                <Button
                  key={category}
                  variant="ghost"
                  className={`w-full justify-start ${selectedCategory === category ? 'bg-primary/10 text-primary' : ''}`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </Button>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryItems;
