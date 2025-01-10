import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface FormData {
  supplier: string;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
}

interface OrderItem {
  id?: string;
  item_id: string;
  quantity: number;
  unit_price: number;
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier: string;
  order_date: string;
  expected_delivery_date?: string;
  status: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  purchase_order_items: OrderItem[];
}

interface CreatePurchaseOrderProps {
  initialData?: PurchaseOrder;
}

const CreatePurchaseOrder: React.FC<CreatePurchaseOrderProps> = ({ initialData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = React.useState<FormData>({
    supplier: initialData?.supplier || "",
    order_date: initialData?.order_date || "",
    expected_delivery_date: initialData?.expected_delivery_date || "",
    notes: initialData?.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (initialData) {
        await supabase
          .from('purchase_orders')
          .update(formData)
          .eq('id', initialData.id);
        toast({
          title: "Success",
          description: "Purchase order updated successfully",
        });
      } else {
        await supabase
          .from('purchase_orders')
          .insert(formData);
        toast({
          title: "Success",
          description: "Purchase order created successfully",
        });
      }
      queryClient.invalidateQueries(['purchase-orders']);
      navigate('/inventory/purchase-orders');
    } catch (error) {
      console.error("Error saving purchase order:", error);
      toast({
        title: "Error",
        description: "Failed to save purchase order",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="supplier">Supplier</Label>
        <Input
          id="supplier"
          name="supplier"
          value={formData.supplier}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="order_date">Order Date</Label>
        <Input
          id="order_date"
          name="order_date"
          type="date"
          value={formData.order_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="expected_delivery_date">Expected Delivery Date</Label>
        <Input
          id="expected_delivery_date"
          name="expected_delivery_date"
          type="date"
          value={formData.expected_delivery_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">{initialData ? "Update Purchase Order" : "Create Purchase Order"}</Button>
    </form>
  );
};

export default CreatePurchaseOrder;
