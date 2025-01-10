import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreatePurchaseOrder from "./CreatePurchaseOrder";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const EditPurchaseOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: purchaseOrder, isLoading } = useQuery({
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

      if (error) {
        console.error("Error fetching purchase order:", error);
        toast({
          title: "Error",
          description: "Failed to load purchase order details",
          variant: "destructive"
        });
        navigate("/inventory/purchase-orders");
        throw error;
      }

      console.log("Found purchase order:", order);
      return order;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4 p-8">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!purchaseOrder) {
    return null;
  }

  return <CreatePurchaseOrder initialData={purchaseOrder} />;
};

export default EditPurchaseOrder;