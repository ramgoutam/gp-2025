import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

type PurchaseOrder = Database['public']['Tables']['purchase_orders']['Row'];

const PurchaseOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const { data: orders } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PurchaseOrder[];
    }
  });

  const { data: orderItems } = useQuery({
    queryKey: ['purchase-order-items', selectedOrder?.id],
    enabled: !!selectedOrder,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_order_items')
        .select(`
          *,
          inventory_items (
            product_name,
            product_id,
            uom
          )
        `)
        .eq('purchase_order_id', selectedOrder?.id);

      if (error) throw error;
      return data;
    }
  });

  const handleView = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEdit = (orderId: string) => {
    navigate(`/inventory/purchase-orders/${orderId}/edit`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'ordered':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create and manage purchase orders
            </p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => navigate("/inventory/purchase-orders/create")}
          >
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Supplier Name</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.po_number}</TableCell>
                  <TableCell>{order.supplier}</TableCell>
                  <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {order.expected_delivery_date && 
                      new Date(order.expected_delivery_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
                  <TableCell className="space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleView(order)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(order.id)}
                      disabled={order.status === 'received' || order.status === 'cancelled'}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {selectedOrder && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">PO Number</h3>
                    <p>{selectedOrder.po_number}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Supplier</h3>
                    <p>{selectedOrder.supplier}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Order Date</h3>
                    <p>{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Expected Delivery</h3>
                    <p>
                      {selectedOrder.expected_delivery_date && 
                        new Date(selectedOrder.expected_delivery_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Status</h3>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Total Amount</h3>
                    <p>${selectedOrder.total_amount?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium mb-3">Order Items</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>UOM</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.inventory_items?.product_id}</TableCell>
                          <TableCell>{item.inventory_items?.product_name}</TableCell>
                          <TableCell>{item.inventory_items?.uom}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price}</TableCell>
                          <TableCell>${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-medium text-sm text-gray-500">Notes</h3>
                    <p className="mt-1 text-sm">{selectedOrder.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PurchaseOrders;