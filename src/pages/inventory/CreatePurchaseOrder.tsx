import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrderDetailsForm } from "@/components/inventory/purchase-order/OrderDetailsForm";
import { OrderItemsForm } from "@/components/inventory/purchase-order/OrderItemsForm";
import { ArrowLeft } from "lucide-react";

type FormData = {
  supplier: string;
  order_date: string;
  expected_delivery_date: string;
};

type OrderItem = {
  item_id: string;
  quantity: number;
  unit_price: number;
  product_id?: string;
  product_name?: string;
  uom?: string;
  manufacturing_id?: string;
  manufacturer?: string;
};

export default function CreatePurchaseOrder() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormData>();

  const addOrderItem = () => {
    setOrderItems([...orderItems, { item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    console.log("Updating order item:", { index, field, value });
    const newItems = [...orderItems];
    if (field === 'item_id' && typeof value === 'string') {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      };
    }
    setOrderItems(newItems);
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!data.supplier || !data.order_date) {
        toast({
          title: "Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (orderItems.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one item to the order",
          variant: "destructive",
        });
        return;
      }

      console.log("Creating new purchase order:", { ...data, items: orderItems });
      
      // Generate PO number
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const poNumber = `PO-${timestamp}-${random}`;

      // Calculate total amount
      const totalAmount = orderItems.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0);

      // Create purchase order
      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          supplier: data.supplier,
          order_date: data.order_date,
          expected_delivery_date: data.expected_delivery_date,
          status: 'draft',
          total_amount: totalAmount
        })
        .select()
        .single();

      if (poError) throw poError;

      // Fetch full item details for each order item
      const enrichedOrderItems = await Promise.all(
        orderItems.map(async (item) => {
          const { data: itemData } = await supabase
            .from('inventory_items')
            .select('product_id, product_name, uom, manufacturing_id, manufacturer, price')
            .eq('id', item.item_id)
            .single();
          
          return {
            purchase_order_id: po.id,
            item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            product_id: itemData?.product_id,
            product_name: itemData?.product_name,
            uom: itemData?.uom,
            manufacturing_id: itemData?.manufacturing_id,
            manufacturer: itemData?.manufacturer
          };
        })
      );

      // Create purchase order items with full details
      if (enrichedOrderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(enrichedOrderItems);

        if (itemsError) throw itemsError;
      }

      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });

      navigate("/inventory/purchase-orders");
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
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/inventory/purchase-orders")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/inventory/purchase-orders")}>
            Cancel
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 bg-white rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
              {/* Order Details Section */}
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h2 className="text-lg font-medium">Order Details</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter the basic information for this purchase order
                  </p>
                </div>
                <OrderDetailsForm form={form} />
              </div>

              {/* Order Items Section */}
              <div className="space-y-4 pt-6">
                <OrderItemsForm
                  orderItems={orderItems}
                  onAddItem={addOrderItem}
                  onRemoveItem={removeOrderItem}
                  onUpdateItem={updateOrderItem}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/inventory/purchase-orders")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={orderItems.length === 0}
                >
                  Create Order
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}