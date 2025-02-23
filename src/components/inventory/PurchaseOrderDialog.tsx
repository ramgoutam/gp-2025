import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Printer, PenLine, CheckCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PurchaseOrderDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PurchaseOrderDialog = ({ orderId, open, onOpenChange }: PurchaseOrderDialogProps) => {
  const { toast } = useToast();

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['purchase-order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      
      console.log('Fetching purchase order details for ID:', orderId);
      
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers (
            supplier_name,
            contact_person,
            email,
            phone,
            address,
            notes
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
      return data;
    },
    enabled: !!orderId,
  });

  const handleApprove = async () => {
    if (!orderId) return;

    try {
      // Get the user's role ID first
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (userRolesError) {
        console.error("Error fetching user role:", userRolesError);
        throw userRolesError;
      }

      if (!userRoles?.id) {
        throw new Error("User role not found");
      }

      const { error } = await supabase
        .from('purchase_orders')
        .update({ 
          status: 'approved',
          approved_by: userRoles.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Purchase order has been approved",
      });
      
      refetch();
    } catch (error) {
      console.error('Error approving purchase order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to approve purchase order",
      });
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
          <div className="space-y-4">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>Purchase Order #{order.po_number}</DialogTitle>
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    {order.status !== 'approved' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button onClick={handleApprove} className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Approve Order
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Approve Purchase Order</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Printer className="h-4 w-4" />
                          Print PO
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Print Purchase Order</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <PenLine className="h-4 w-4" />
                          Edit Order
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Purchase Order</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Supplier Details</h3>
                      <div className="space-y-1">
                        <p><span className="font-medium">Name:</span> {order.suppliers?.supplier_name}</p>
                        {order.suppliers?.contact_person && (
                          <p><span className="font-medium">Contact Person:</span> {order.suppliers.contact_person}</p>
                        )}
                        {order.suppliers?.email && (
                          <p><span className="font-medium">Email:</span> {order.suppliers.email}</p>
                        )}
                        {order.suppliers?.phone && (
                          <p><span className="font-medium">Phone:</span> {order.suppliers.phone}</p>
                        )}
                        {order.suppliers?.address && (
                          <p><span className="font-medium">Address:</span> {order.suppliers.address}</p>
                        )}
                        {order.suppliers?.notes && (
                          <p><span className="font-medium">Notes:</span> {order.suppliers.notes}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                        <p className="mt-1">
                          {format(new Date(order.order_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Expected Delivery</h3>
                        <p className="mt-1">
                          {order.expected_delivery_date && 
                            format(new Date(order.expected_delivery_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
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
                      {order.purchase_order_items?.map((item) => (
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderDialog;