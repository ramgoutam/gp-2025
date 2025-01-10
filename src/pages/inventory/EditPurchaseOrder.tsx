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
            id,
            item_id,
            quantity,
            unit_price,
            received_quantity
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("Error fetching purchase order:", error);
        toast({
          title: "Error",
          description: "Failed to fetch purchase order details",
          variant: "destructive"
        });
        throw error;
      }

      console.log("Found purchase order:", order);
      return order;
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Purchase Order Not Found</h2>
          <p className="text-gray-500">The requested purchase order could not be found.</p>
        </div>
      </div>
    );
  }

  return <CreatePurchaseOrder initialData={purchaseOrder} />;
};

export default EditPurchaseOrder;