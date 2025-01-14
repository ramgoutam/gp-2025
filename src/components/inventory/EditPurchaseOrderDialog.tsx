import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Pencil } from "lucide-react";

interface EditPurchaseOrderDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated: () => void;
}

const EditPurchaseOrderDialog = ({ orderId, open, onOpenChange, onOrderUpdated }: EditPurchaseOrderDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);

  const { data: order, isLoading } = useQuery({
    queryKey: ['purchase-order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      console.log('Fetching purchase order details for ID:', orderId);
      
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers (
            supplier_name
          ),
          purchase_order_items!purchase_order_items_purchase_order_id_fkey (
            *,
            inventory_items!purchase_order_items_item_id_fkey (
              product_name,
              sku
            )
          )
        `)
        .eq('id', orderId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching purchase order:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load purchase order details",
        });
        throw error;
      }

      console.log('Purchase order data:', data);
      setEditedOrder(data);
      return data;
    },
    enabled: !!orderId,
  });

  const handleSave = async () => {
    if (!editedOrder) return;

    const { error } = await supabase
      .from('purchase_orders')
      .update({
        notes: editedOrder.notes,
        expected_delivery_date: editedOrder.expected_delivery_date,
        status: editedOrder.status,
      })
      .eq('id', orderId);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update purchase order",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Purchase order updated successfully",
    });
    setIsEditing(false);
    onOrderUpdated();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-[1200px] max-h-[85vh] h-[800px] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Loading purchase order details...</p>
          </div>
        ) : !order ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500">Purchase order not found</p>
          </div>
        ) : (
          <>
            <DialogHeader className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <DialogTitle className="text-xl">Purchase Order #{order.po_number}</DialogTitle>
                <div className="space-x-2 mt-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Order
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-6 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      {isEditing ? (
                        <select
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={editedOrder.status}
                          onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value })}
                        >
                          <option value="draft">Draft</option>
                          <option value="ordered">Ordered</option>
                          <option value="received">Received</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                      <p className="mt-1">{order.suppliers?.supplier_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                      <p className="mt-1">
                        {format(new Date(order.order_date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Expected Delivery</h3>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedOrder.expected_delivery_date}
                          onChange={(e) => setEditedOrder({ ...editedOrder, expected_delivery_date: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1">
                          {order.expected_delivery_date && 
                            format(new Date(order.expected_delivery_date), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                      {isEditing ? (
                        <textarea
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          value={editedOrder.notes || ''}
                          onChange={(e) => setEditedOrder({ ...editedOrder, notes: e.target.value })}
                          rows={3}
                        />
                      ) : (
                        <p className="mt-1">{order.notes || 'No notes'}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Manufacturing ID</TableHead>
                        <TableHead>Manufacturer</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {order.purchase_order_items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_id}</TableCell>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.manufacturing_id}</TableCell>
                          <TableCell>{item.manufacturer}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.unit_price}</TableCell>
                          <TableCell>
                            ${(item.quantity * item.unit_price).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={6} className="text-right font-medium">
                          Total Amount
                        </TableCell>
                        <TableCell className="font-medium">
                          ${order.total_amount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPurchaseOrderDialog;
