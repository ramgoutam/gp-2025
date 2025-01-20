import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FilePlus, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import PurchaseOrderDialog from "@/components/inventory/PurchaseOrderDialog";
import { ViewSupplierDialog } from "@/components/inventory/ViewSupplierDialog";
import EditPurchaseOrderDialog from "@/components/inventory/EditPurchaseOrderDialog";
import { useToast } from "@/hooks/use-toast";
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
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: purchaseOrders, isLoading, refetch } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchase_orders")
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
          ),
          purchase_order_items (*),
          created_by_user:user_roles (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (orderId: string) => {
    setOrderToDelete(orderId);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      console.log("Deleting purchase order:", orderToDelete);
      
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', orderToDelete);

      if (error) {
        console.error('Error deleting purchase order:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Purchase order deleted successfully",
      });
      
      setOrderToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete purchase order",
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending_approval':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDateTime = (dateTime: string) => {
    return format(new Date(dateTime), 'MMM dd, yyyy HH:mm');
  };

  const getCreatorName = (order: any) => {
    if (order.created_by_user) {
      const { first_name, last_name } = order.created_by_user;
      return `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown';
    }
    return 'Unknown';
  };

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
                <th className="px-4 py-2 text-left">Created By</th>
                <th className="px-4 py-2 text-left">Created At</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-right">Total Amount</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders?.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-4 py-2">{order.po_number}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setSelectedSupplier(order.suppliers)}
                    >
                      {order.suppliers?.supplier_name}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(order.order_date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-2">
                    {getCreatorName(order)}
                  </td>
                  <td className="px-4 py-2">
                    {formatDateTime(order.created_at_local || order.created_at)}
                  </td>
                  <td className="px-4 py-2">
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${order.total_amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditOrderId(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {purchaseOrders?.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No purchase orders found. Click "Create Purchase Order" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <PurchaseOrderDialog
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onOpenChange={(open) => !open && setSelectedOrderId(null)}
      />

      <EditPurchaseOrderDialog
        orderId={editOrderId}
        open={!!editOrderId}
        onOpenChange={(open) => !open && setEditOrderId(null)}
        onOrderUpdated={refetch}
      />

      <ViewSupplierDialog
        supplier={selectedSupplier}
        open={!!selectedSupplier}
        onOpenChange={(open) => !open && setSelectedSupplier(null)}
      />

      <AlertDialog open={!!orderToDelete} onOpenChange={(open) => !open && setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PurchaseOrders;