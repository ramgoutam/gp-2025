import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormData = {
  supplier: string;
  order_date: string;
  expected_delivery_date: string;
  notes: string;
  items: OrderItem[];
};

type OrderItem = {
  item_id: string;
  quantity: number;
  unit_price: number;
};

type InventoryItem = {
  id: string;
  product_name: string;
  price: number | null;
};

export function AddPurchaseOrderDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    defaultValues: {
      items: [],
    },
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Fetch inventory items
  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, product_name, price');
      
      if (error) throw error;
      console.log('Fetched inventory items:', data);
      return data as InventoryItem[];
    }
  });

  // Fetch suppliers
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, supplier_name');
      
      if (error) throw error;
      return data;
    }
  });

  const addOrderItem = () => {
    console.log('Adding new order item');
    setOrderItems([...orderItems, { item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    
    if (field === 'item_id' && typeof value === 'string') {
      const selectedItem = inventoryItems?.find(item => item.id === value);
      const itemPrice = selectedItem?.price || 0;
      console.log('Selected item:', selectedItem);
      console.log('Setting unit price for item:', selectedItem?.product_name, 'to:', itemPrice);
      
      newItems[index] = {
        ...newItems[index],
        item_id: value,
        unit_price: Number(itemPrice) // Ensure price is converted to number
      };
    } else if (field === 'quantity') {
      // Ensure quantity is a positive number
      const quantity = Math.max(1, Number(value));
      newItems[index] = {
        ...newItems[index],
        quantity: quantity
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    
    console.log('Updated order items:', newItems);
    setOrderItems(newItems);
  };

  const calculateTotalAmount = (items: OrderItem[]): number => {
    return items.reduce((sum, item) => {
      const itemTotal = Number(item.quantity) * Number(item.unit_price);
      console.log(`Calculating total for item: quantity=${item.quantity} * unit_price=${item.unit_price} = ${itemTotal}`);
      return sum + itemTotal;
    }, 0);
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Creating new purchase order with items:", orderItems);
      
      // Get supplier name from ID
      const selectedSupplier = suppliers?.find(s => s.id === data.supplier);
      if (!selectedSupplier) {
        throw new Error("Selected supplier not found");
      }
      
      // Generate PO number
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const poNumber = `PO-${timestamp}-${random}`;

      // Calculate total amount
      const totalAmount = calculateTotalAmount(orderItems);
      console.log('Final calculated total amount:', totalAmount);

      // Create purchase order
      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          supplier: selectedSupplier.supplier_name,
          order_date: data.order_date,
          expected_delivery_date: data.expected_delivery_date,
          notes: data.notes,
          status: 'draft',
          total_amount: totalAmount
        })
        .select()
        .single();

      if (poError) {
        console.error("Error creating purchase order:", poError);
        throw poError;
      }

      console.log("Created purchase order:", po);

      // Create purchase order items
      if (orderItems.length > 0) {
        const purchaseOrderItems = orderItems.map(item => ({
          purchase_order_id: po.id,
          item_id: item.item_id,
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price)
        }));

        console.log('Creating purchase order items:', purchaseOrderItems);

        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(purchaseOrderItems);

        if (itemsError) {
          console.error('Error creating purchase order items:', itemsError);
          throw itemsError;
        }
      }

      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });

      setOpen(false);
      form.reset();
      setOrderItems([]);
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast({
        title: "Error",
        description: "Failed to create purchase order",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                      <SelectContent>
                        {suppliers?.map((supplier) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.supplier_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="order_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expected_delivery_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Delivery Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {orderItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <FormLabel>Product</FormLabel>
                    <Select
                      value={item.item_id}
                      onValueChange={(value) => updateOrderItem(index, 'item_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {inventoryItems?.map((invItem) => (
                          <SelectItem key={invItem.id} value={invItem.id}>
                            {invItem.product_name} (${invItem.price?.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-24">
                    <FormLabel>Quantity</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="w-32">
                    <FormLabel>Unit Price</FormLabel>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mb-2"
                    onClick={() => removeOrderItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Add any additional notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Order</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});
