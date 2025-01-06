import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { OrderDetailsForm } from "@/components/inventory/purchase-order/OrderDetailsForm";
import { OrderItemsForm } from "@/components/inventory/purchase-order/OrderItemsForm";

type FormData = {
  supplier: string;
  order_date: string;
  expected_delivery_date: string;
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
          notes: data.notes,
          status: 'draft',
          total_amount: totalAmount
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
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Create Purchase Order</h1>
          <Button variant="outline" onClick={() => navigate("/inventory/purchase-orders")}>
            Cancel
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <OrderDetailsForm form={form} />
              
              <OrderItemsForm
                orderItems={orderItems}
                onAddItem={addOrderItem}
                onRemoveItem={removeOrderItem}
                onUpdateItem={updateOrderItem}
              />

              <div className="flex justify-end gap-4">
                <Button type="submit">Create Order</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}