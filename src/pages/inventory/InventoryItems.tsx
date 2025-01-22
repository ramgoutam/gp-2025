import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { Package, Search, ListFilter, Check, Plus, Pencil, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const InventoryItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const { toast } = useToast();

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

  const categories = Array.from(new Set(items.map(item => item.category).filter(Boolean))).sort();

  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    setShowCategoryDialog(false);
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('inventory_items')
      .update({ category: newCategory.trim() })
      .eq('id', items[0]?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add new category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "New category added successfully",
    });

    setNewCategory("");
    refetch();
  };

  const handleEditCategory = async (oldCategory: string, newName: string) => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newName.trim()) && newName.trim() !== oldCategory) {
      toast({
        title: "Error",
        description: "This category already exists",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('inventory_items')
      .update({ category: newName.trim() })
      .eq('category', oldCategory);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Category updated successfully",
    });

    setEditingCategory(null);
    setEditedCategoryName("");
    if (selectedCategory === oldCategory) {
      setSelectedCategory(newName.trim());
    }
    refetch();
  };

  const startEditing = (category: string) => {
    setEditingCategory(category);
    setEditedCategoryName(category);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-white px-4 sm:px-6 lg:px-8 animate-fade-in overflow-hidden">
      <div className="flex items-center gap-3 flex-wrap md:flex-nowrap bg-white rounded-lg p-4 pt-4 border shadow-sm mb-6 flex-shrink-0 mt-4">
        <div className="flex items-center gap-3 min-w-[200px] px-4 py-2 bg-primary/5 rounded-lg transition-all duration-200 hover:bg-primary/10">
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

      <div className="flex-1 min-h-0 bg-white rounded-lg shadow-sm border">
        <InventoryTable items={items} onUpdate={refetch} />
      </div>

      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent className="sm:max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Search categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full pl-10 focus:ring-primary/20 transition-all duration-200"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {!showAddCategory && (
                <Button
                  onClick={() => setShowAddCategory(true)}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Category
                </Button>
              )}
            </div>

            {showAddCategory && (
              <div className="flex items-center gap-2 animate-fade-in">
                <Input
                  placeholder="New category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 focus:ring-primary/20 transition-all duration-200"
                  autoFocus
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    handleAddCategory();
                    setShowAddCategory(false);
                  }}
                  className="h-8 w-8 p-0 hover:bg-primary/5 transition-colors duration-200"
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setNewCategory("");
                    setShowAddCategory(false);
                  }}
                  className="h-8 w-8 p-0 hover:bg-destructive/5 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1 mt-4">
            <div className="space-y-1">
              {selectedCategory && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 py-2 px-4 h-auto font-normal"
                  onClick={() => handleCategorySelect(null)}
                >
                  Clear Selection
                </Button>
              )}
              {filteredCategories.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 animate-fade-in"
                >
                  {editingCategory === category ? (
                    <div className="flex-1 flex items-center gap-2 p-2">
                      <Input
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="flex-1 focus:ring-primary/20 transition-all duration-200"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-primary/5 transition-colors duration-200"
                        onClick={() => handleEditCategory(category, editedCategoryName)}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-destructive/5 transition-colors duration-200"
                        onClick={() => setEditingCategory(null)}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`w-full justify-between py-2 px-4 h-auto font-normal transition-colors duration-200 ${
                        selectedCategory === category ? 'bg-primary/10 text-primary hover:bg-primary/20' : ''
                      }`}
                      onClick={() => handleCategorySelect(category)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {selectedCategory === category && (
                          <Check className="h-4 w-4 shrink-0" />
                        )}
                        <span className="whitespace-normal break-words text-left pr-2">{category}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 ml-2 shrink-0 hover:bg-primary/5 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(category);
                        }}
                      >
                        <Pencil className="h-4 w-4 text-gray-500" />
                      </Button>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryItems;
