import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { OrderDetailsForm } from "@/components/inventory/purchase-order/OrderDetailsForm";
import { OrderItemsForm } from "@/components/inventory/purchase-order/OrderItemsForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface OrderItem {
  id?: string;
  item_id: string;
  quantity: number;
  unit_price: number;
}

interface FormData {
  supplier: string;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
}

const CreatePurchaseOrder = () => {
  const { id } = useParams(); // Get the order ID from URL if editing
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [formData, setFormData] = useState<FormData>({
    supplier: "",
    order_date: "",
  });
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch existing order data if editing
  const { data: existingOrder, isLoading } = useQuery({
    queryKey: ['purchase-order', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: order, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          purchase_order_items (
            *,
            inventory_items (*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return order;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (existingOrder) {
      setFormData({
        supplier: existingOrder.supplier,
        order_date: existingOrder.order_date,
        expected_delivery_date: existingOrder.expected_delivery_date,
        notes: existingOrder.notes
      });
      
      const items = existingOrder.purchase_order_items.map((item: any) => ({
        id: item.id,
        item_id: item.item_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));
      
      setOrderItems(items);
      setTotalAmount(existingOrder.total_amount || 0);
    }
  }, [existingOrder]);

  const handleSubmit = async (data: FormData) => {
    try {
      console.log("Submitting purchase order:", { ...data, items: orderItems });
      
      if (!data.supplier) {
        toast({
          title: "Error",
          description: "Please select a supplier",
          variant: "destructive",
        });
        return;
      }

      if (!data.order_date) {
        toast({
          title: "Error",
          description: "Please select an order date",
          variant: "destructive",
        });
        return;
      }

      if (id) {
        // Update existing order
        const { error: updateError } = await supabase
          .from('purchase_orders')
          .update({
            supplier: data.supplier,
            order_date: data.order_date,
            expected_delivery_date: data.expected_delivery_date || null,
            notes: data.notes,
            total_amount: totalAmount
          })
          .eq('id', id);

        if (updateError) throw updateError;

        // Delete existing items and insert new ones
        await supabase
          .from('purchase_order_items')
          .delete()
          .eq('purchase_order_id', id);

        if (orderItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('purchase_order_items')
            .insert(
              orderItems.map(item => ({
                ...item,
                purchase_order_id: id
              }))
            );

          if (itemsError) throw itemsError;
        }

        toast({
          title: "Success",
          description: "Purchase order updated successfully",
        });
      } else {
        // Generate PO number for new order
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const poNumber = `PO-${timestamp}-${random}`;

        // Create new order
        const { data: newOrder, error } = await supabase
          .from('purchase_orders')
          .insert({
            po_number: poNumber,
            supplier: data.supplier,
            order_date: data.order_date,
            expected_delivery_date: data.expected_delivery_date || null,
            status: 'draft',
            total_amount: totalAmount,
            notes: data.notes
          })
          .select()
          .single();

        if (error) throw error;

        if (orderItems.length > 0) {
          const { error: itemsError } = await supabase
            .from('purchase_order_items')
            .insert(
              orderItems.map(item => ({
                ...item,
                purchase_order_id: newOrder.id
              }))
            );

          if (itemsError) throw itemsError;
        }

        toast({
          title: "Success",
          description: "Purchase order created successfully",
        });
      }

      // Invalidate queries and navigate back
      queryClient.invalidateQueries({ queryKey: ['purchase-orders'] });
      navigate('/inventory/purchase-orders');
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to save purchase order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (id && isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/inventory/purchase-orders')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {id ? 'Edit Purchase Order' : 'Create Purchase Order'}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                {id ? 'Update purchase order details' : 'Create a new purchase order'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <OrderDetailsForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              isEditing={!!id}
            />
          </Card>

          <Card className="p-6">
            <OrderItemsForm
              items={orderItems}
              onChange={setOrderItems}
              onTotalChange={setTotalAmount}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;