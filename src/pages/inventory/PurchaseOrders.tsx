import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const PurchaseOrders = () => {
  const navigate = useNavigate();

  const { data: purchaseOrders, isLoading } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_orders")
        .select(`
          *,
          purchase_order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <Button
          onClick={() => navigate("/inventory/purchase-orders/create")}
          className="flex items-center gap-2"
        >
          <FilePlus className="h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-2 text-left">PO Number</th>
                <th className="px-4 py-2 text-left">Supplier</th>
                <th className="px-4 py-2 text-left">Order Date</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Total Amount</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders?.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">{order.po_number}</td>
                  <td className="px-4 py-2">{order.supplier}</td>
                  <td className="px-4 py-2">
                    {format(new Date(order.order_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant={order.status === 'draft' ? 'secondary' : 'success'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${order.total_amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      variant="link"
                      onClick={() => navigate(`/inventory/purchase-orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
              {purchaseOrders?.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No purchase orders found. Click "Create Purchase Order" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PurchaseOrders;