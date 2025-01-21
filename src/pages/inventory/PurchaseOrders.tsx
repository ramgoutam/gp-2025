import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FilePlus, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { ViewSupplierDialog } from "@/components/inventory/ViewSupplierDialog";
import EditPurchaseOrderDialog from "@/components/inventory/EditPurchaseOrderDialog";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: string; supplier_name: string; contact_person: string | null; email: string | null; phone: string | null; address: string | null; notes: string | null; } | null>(null);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers (
            id,
            supplier_name,
            contact_person,
            email,
            phone,
            address,
            notes
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching purchase orders:', error);
        throw error;
      }

      return data;
    },
  });

  const handleDelete = (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', orderToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Purchase order deleted successfully",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete purchase order",
      });
    } finally {
      setOrderToDelete(null);
    }
  };

  const handleOrderUpdated = () => {
    refetch();
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <Button onClick={() => navigate('/inventory/purchase-orders/create')}>
          <FilePlus className="h-4 w-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">PO Number</th>
              <th className="px-4 py-2 text-left">Supplier</th>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Expected Delivery</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Loading purchase orders...
                </td>
              </tr>
            ) : orders?.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              orders?.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">{order.po_number}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setSelectedSupplier(order.suppliers)}
                      className="text-blue-600 hover:underline"
                    >
                      {order.suppliers?.supplier_name}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(order.order_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-2">
                    {order.expected_delivery_date &&
                      format(new Date(order.expected_delivery_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-2">
                    <Badge
                      variant={
                        order.status === 'approved'
                          ? 'success'
                          : order.status === 'draft'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditOrderId(order.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Order</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(order.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Order</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ViewSupplierDialog
        supplier={selectedSupplier}
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      />

      <EditPurchaseOrderDialog
        orderId={editOrderId}
        open={!!editOrderId}
        onOpenChange={(open) => !open && setEditOrderId(null)}
        onOrderUpdated={handleOrderUpdated}
      />

      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the purchase order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseOrders;