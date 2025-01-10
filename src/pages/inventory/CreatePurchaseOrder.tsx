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
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type FormData = {
  supplier: string;
  order_date: string;
  expected_delivery_date: string;
  billing_address: string;
  shipping_address: string;
  payment_terms: string;
  shipping_method: string;
  currency: string;
  tax_rate: number;
  notes: string;
};

type OrderItem = {
  item_id: string;
  quantity: number;
  unit_price: number;
};

export default function CreatePurchaseOrder() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<FormData>({
    defaultValues: {
      tax_rate: 0,
      currency: 'USD',
      payment_terms: 'Net 30',
    }
  });

  const addOrderItem = () => {
    setOrderItems([...orderItems, { item_id: '', quantity: 1, unit_price: 0 }]);
  };

  const removeOrderItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setOrderItems(newItems);
  };

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Creating new purchase order:", { ...data, items: orderItems });
      
      // Generate PO number
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const poNumber = `PO-${timestamp}-${random}`;

      // Calculate total amount and tax
      const subtotal = orderItems.reduce((sum, item) => 
        sum + (item.quantity * item.unit_price), 0);
      const taxAmount = subtotal * (data.tax_rate / 100);
      const totalAmount = subtotal + taxAmount;

      // Create purchase order
      const { data: po, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          po_number: poNumber,
          supplier: data.supplier,
          order_date: data.order_date,
          expected_delivery_date: data.expected_delivery_date,
          billing_address: data.billing_address,
          shipping_address: data.shipping_address,
          payment_terms: data.payment_terms,
          shipping_method: data.shipping_method,
          currency: data.currency,
          tax_rate: data.tax_rate,
          notes: data.notes,
          status: 'draft',
          total_amount: totalAmount,
          subtotal: subtotal,
          tax_amount: taxAmount
        })
        .select()
        .single();

      if (poError) throw poError;

      // Create purchase order items
      if (orderItems.length > 0) {
        const { error: itemsError } = await supabase
          .from('purchase_order_items')
          .insert(
            orderItems.map(item => ({
              purchase_order_id: po.id,
              item_id: item.item_id,
              quantity: item.quantity,
              unit_price: item.unit_price
            }))
          );

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
        <div className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium">Order Details</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter the basic information for this purchase order
                    </p>
                  </div>
                  <Separator />
                  <OrderDetailsForm form={form} />
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium">Order Items</h2>
                    <p className="text-sm text-muted-foreground">
                      Add items to your purchase order
                    </p>
                  </div>
                  <Separator />
                  <OrderItemsForm
                    orderItems={orderItems}
                    onAddItem={addOrderItem}
                    onRemoveItem={removeOrderItem}
                    onUpdateItem={updateOrderItem}
                  />
                </div>
              </Card>

              <div className="flex justify-end gap-4">
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