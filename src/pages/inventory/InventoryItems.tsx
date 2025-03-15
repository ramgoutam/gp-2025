import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { BulkUploadButton } from "@/components/inventory/BulkUploadButton";
import { Package, Search, ListFilter, Eye, ArrowLeftRight, MapPin, AlertTriangle, Info, Pencil, Trash2, Plus, Mic, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const initialColumns = ["product_name", "sku", "category", "manufacturer", "quantity", "price", "actions"];

const InventoryItems = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(initialColumns);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [customUom, setCustomUom] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedStockItem, setSelectedStockItem] = useState<any>(null);
  const [targetLocationId, setTargetLocationId] = useState("");
  const [transferQuantity, setTransferQuantity] = useState(0);
  const { toast } = useToast();

  const uomOptions = ["ML", "Unit", "Gm", "Pr", "Ga"];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('inventory_items')
          .select('category')
          .not('category', 'is', null);
        
        if (error) throw error;
        
        const uniqueCategories = Array.from(
          new Set(data.map(item => item.category).filter(Boolean))
        ) as string[];
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

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

  const {
    data: locations = []
  } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('inventory_locations').select('*').order('name');
      if (error) throw error;
      return data;
    }
  });

  const {
    data: stockData = []
  } = useQuery({
    queryKey: ['inventory-stock', viewingItem?.id],
    enabled: !!viewingItem,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('inventory_stock').select(`
          quantity,
          location_id,
          inventory_locations (
            name
          )
        `).eq('item_id', viewingItem.id);
      if (error) throw error;

      const stockMap = new Map(data.map(stock => [stock.location_id, {
        location_id: stock.location_id,
        location_name: stock.inventory_locations.name,
        quantity: stock.quantity
      }]));

      return locations.map(location => ({
        location_id: location.id,
        location_name: location.name,
        quantity: stockMap.get(location.id)?.quantity || 0
      }));
    }
  });

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          product_name: editingItem.product_name,
          description: editingItem.description,
          sku: editingItem.sku,
          uom: editingItem.uom,
          min_stock: editingItem.min_stock,
          product_id: editingItem.product_id,
          category: editingItem.category,
          manufacturing_id: editingItem.manufacturing_id,
          manufacturer: editingItem.manufacturer,
          order_link: editingItem.order_link,
          price: editingItem.price,
          qty_per_uom: editingItem.qty_per_uom
        })
        .eq('id', editingItem.id);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully"
      });
      setEditingItem(null);
      refetch();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive"
      });
    }
  };

  const handleAddCustomUom = () => {
    if (customUom.trim()) {
      setEditingItem({ ...editingItem, uom: customUom.trim() });
      setCustomUom("");
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setEditingItem({ ...editingItem, category: customCategory.trim() });
      setCustomCategory("");
    }
  };

  const handleDelete = async () => {
    try {
      const {
        error
      } = await supabase.from('inventory_items').delete().eq('id', itemToDelete.id);
      if (error) throw error;
      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
      setItemToDelete(null);
      setIsDeleteDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive"
      });
    }
  };

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

  const handleTransferClick = (stock: any) => {
    setSelectedStockItem(stock);
    setTransferQuantity(0);
    setTargetLocationId("");
    setIsTransferDialogOpen(true);
  };

  const handleTransferStock = async () => {
    if (!selectedStockItem || !targetLocationId || !viewingItem) return;
    try {
      const {
        error: sourceError
      } = await supabase.from('inventory_stock').update({
        quantity: selectedStockItem.quantity - transferQuantity
      }).eq('item_id', viewingItem.id).eq('location_id', selectedStockItem.location_id);
      if (sourceError) throw sourceError;

      const {
        data: existingStock
      } = await supabase.from('inventory_stock').select('quantity').eq('item_id', viewingItem.id).eq('location_id', targetLocationId).single();
      if (existingStock) {
        const {
          error: updateError
        } = await supabase.from('inventory_stock').update({
          quantity: existingStock.quantity + transferQuantity
        }).eq('item_id', viewingItem.id).eq('location_id', targetLocationId);
        if (updateError) throw updateError;
      } else {
        const {
          error: insertError
        } = await supabase.from('inventory_stock').insert({
          item_id: viewingItem.id,
          location_id: targetLocationId,
          quantity: transferQuantity
        });
        if (insertError) throw insertError;
      }
      toast({
        title: "Success",
        description: "Stock transferred successfully"
      });
      setIsTransferDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error transferring stock:', error);
      toast({
        title: "Error",
        description: "Failed to transfer stock",
        variant: "destructive"
      });
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      setIsRecording(true);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await handleVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        setIsRecording(false);
      }, 5000); // Stop recording after 5 seconds

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive"
      });
      setIsRecording(false);
    }
  };

  const handleVoiceInput = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data.text) {
          setSearchQuery(data.text);
          toast({
            title: "Voice input received",
            description: `Searching for: "${data.text}"`,
          });
        }
        
        setIsProcessing(false);
      };
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Error",
        description: "Could not process voice input. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  return <div className="h-[calc(100vh-80px)] pb-6 space-y-4 my-px py-0">
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
            value={searchQuery} 
            onChange={handleSearch} 
            className="w-full pl-10 border-gray-200 focus:ring-primary/20 transition-all duration-200 mx-0 py-0 px-[240px] rounded-full" 
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2",
              isRecording && "text-red-500 animate-pulse",
              isProcessing && "cursor-not-allowed"
            )}
            onClick={startVoiceRecording}
            disabled={isRecording || isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className={cn("h-4 w-4", isRecording && "text-red-500")} />
            )}
          </Button>
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
              {initialColumns.map(column => <DropdownMenuCheckboxItem key={column} checked={selectedColumns.includes(column)} onCheckedChange={() => handleColumnToggle(column)} className="rounded mx-[7px] hover:bg-slate-50 bg-white px-[34px] py-[3px] my-[2px]">
                  {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </DropdownMenuCheckboxItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-[8px] relative h-[calc(100%-60px)] mx-0 py-px my-[6px]">
          <div className="relative h-full overflow-hidden border rounded-md">
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    {selectedColumns.map(column => <TableHead key={column} className="bg-slate-100" style={{
                    width: column === 'product_name' ? '250px' : column === 'sku' ? '180px' : column === 'actions' ? '120px' : '200px',
                    minWidth: column === 'product_name' ? '250px' : column === 'sku' ? '180px' : column === 'actions' ? '120px' : '200px'
                  }}>
                        {column.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </TableHead>)}
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="overflow-auto h-[calc(100%-40px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors">
              <Table>
                <TableBody>
                  {items.map(item => <TableRow key={item.id}>
                      {selectedColumns.map(column => <TableCell key={column} style={{
                    width: column === 'product_name' ? '250px' : column === 'sku' ? '180px' : column === 'actions' ? '120px' : '200px',
                    minWidth: column === 'product_name' ? '250px' : column === 'sku' ? '180px' : column === 'actions' ? '120px' : '200px'
                  }}>
                          {column === 'product_name' ? <span className="font-medium">{item.product_name}</span> : column === 'actions' ? <div className="flex items-center gap-2">
                              <Button variant="outline" size="icon" onClick={() => setViewingItem(item)} className="hover:bg-slate-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => setEditingItem(item)} className="hover:bg-blue-50">
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => {
                        setItemToDelete(item);
                        setIsDeleteDialogOpen(true);
                      }} className="hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div> : column === 'price' ? `$${item[column]?.toFixed(2) || '0.00'}` : item[column] || 'N/A'}
                        </TableCell>)}
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Stock Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
        <DialogContent className="sm:max-w-[700px] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Stock Levels
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
              {stockData.map(stock => <div key={stock.location_id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h3 className="font-medium text-gray-900">{stock.location_name}</h3>
                    </div>
                    {stock.quantity > 0 && <Button variant="outline" size="sm" onClick={() => handleTransferClick(stock)} className="flex items-center gap-1 text-sm hover:bg-primary/5">
                        <ArrowLeftRight className="h-3 w-3" />
                        Transfer
                      </Button>}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className={cn("text-2xl font-semibold", stock.quantity === 0 ? "text-gray-400" : "text-primary", stock.quantity < (viewingItem?.min_stock || 0) ? "text-yellow-600" : "")}>
                      {stock.quantity}
                    </span>
                    <span className="text-gray-500 text-sm">units</span>
                  </div>
                  {stock.quantity < (viewingItem?.min_stock || 0) && stock.quantity > 0 && <div className="mt-2 flex items-center gap-1 text-yellow-600 text-sm">
                      <AlertTriangle className="h-3 w-3" />
                      Below minimum stock
                    </div>}
                  {stock.quantity === 0 && <div className="mt-2 flex items-center gap-1 text-gray-400 text-sm">
                      <Info className="h-3 w-3" />
                      No stock available
                    </div>}
                </div>)}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              Transfer Stock
            </DialogTitle>
            <DialogDescription>
              Transfer stock from {selectedStockItem?.location_name} to another location
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>From Location</Label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{selectedStockItem?.location_name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>To Location</Label>
              <Select value={targetLocationId} onValueChange={setTargetLocationId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select target location" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-md">
                  {stockData.filter(location => location.location_id !== selectedStockItem?.location_id).map(location => <SelectItem key={location.location_id} value={location.location_id} className="hover:bg-gray-50">
                        {location.location_name}
                      </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity (Available: {selectedStockItem?.quantity})</Label>
              <Input type="number" min="1" max={selectedStockItem?.quantity || 0} value={transferQuantity} onChange={e => setTransferQuantity(parseInt(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleTransferStock} disabled={!targetLocationId || transferQuantity <= 0 || transferQuantity > (selectedStockItem?.quantity || 0)}>
              Transfer Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Product Details
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <ScrollArea className="pr-4">
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product_id">Product ID</Label>
                    <Input
                      id="product_id"
                      value={editingItem?.product_id || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, product_id: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product_name">Name</Label>
                    <Input
                      id="product_name"
                      value={editingItem?.product_name || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, product_name: e.target.value } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={editingItem?.category || ""} 
                        onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, category: value } : null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                          {editingItem?.category && !categories.includes(editingItem.category) ? (
                            <SelectItem value={editingItem.category}>{editingItem.category}</SelectItem>
                          ) : null}
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" type="button" className="px-3">+</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white p-4 shadow-lg z-[100]">
                          <div className="space-y-2">
                            <Label htmlFor="custom-category">Add Custom Category</Label>
                            <div className="flex gap-2">
                              <Input
                                id="custom-category"
                                value={customCategory}
                                onChange={(e) => setCustomCategory(e.target.value)}
                                placeholder="Enter custom category"
                              />
                              <Button 
                                type="button" 
                                onClick={handleAddCustomCategory}
                                disabled={!customCategory.trim()}
                                variant="secondary"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="uom">UOM</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={editingItem?.uom || ""} 
                        onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, uom: value } : null)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select UOM" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {uomOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                          {editingItem?.uom && !uomOptions.includes(editingItem.uom) ? (
                            <SelectItem value={editingItem.uom}>{editingItem.uom}</SelectItem>
                          ) : null}
                        </SelectContent>
                      </Select>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" type="button" className="px-3">+</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white p-4 shadow-lg z-[100]">
                          <div className="space-y-2">
                            <Label htmlFor="custom-uom">Add Custom UOM</Label>
                            <div className="flex gap-2">
                              <Input
                                id="custom-uom"
                                value={customUom}
                                onChange={(e) => setCustomUom(e.target.value)}
                                placeholder="Enter custom UOM"
                              />
                              <Button 
                                type="button" 
                                onClick={handleAddCustomUom}
                                disabled={!customUom.trim()}
                                variant="secondary"
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qty_per_uom">Quantity per UOM</Label>
                    <Input
                      id="qty_per_uom"
                      type="number"
                      min="1"
                      value={editingItem?.qty_per_uom || 1}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, qty_per_uom: parseInt(e.target.value) } : null)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturing_id">Manufacturing ID</Label>
                    <Input
                      id="manufacturing_id"
                      value={editingItem?.manufacturing_id || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, manufacturing_id: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      value={editingItem?.manufacturer || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, manufacturer: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order_link">Order Link</Label>
                    <Input
                      id="order_link"
                      value={editingItem?.order_link || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, order_link: e.target.value } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min_stock">Minimum Stock</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={editingItem?.min_stock || 0}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, min_stock: parseInt(e.target.value) } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={editingItem?.price || 0}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : null)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={editingItem?.sku || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, sku: e.target.value } : null)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingItem?.description || ""}
                      onChange={(e) => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </DialogFooter>
              </div>
            </ScrollArea>
          </form>
        </DialogContent>
      </Dialog>

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



