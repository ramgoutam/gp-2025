import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const PurchaseOrders = () => {
  const navigate = useNavigate();

  const { data: purchaseOrders, isLoading } = useQuery({
    queryKey: ['purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    return styles[status as keyof typeof styles] || styles.draft;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Purchase Orders</h1>
        <Button onClick={() => navigate('/inventory/purchase-orders/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.po_number}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>
                  {order.order_date ? format(new Date(order.order_date), 'MMM dd, yyyy') : '-'}
                </TableCell>
                <TableCell>
                  {order.expected_delivery_date 
                    ? format(new Date(order.expected_delivery_date), 'MMM dd, yyyy') 
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadge(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  ${order.total_amount?.toFixed(2) || '0.00'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/inventory/purchase-orders/${order.id}`)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/inventory/purchase-orders/${order.id}/edit`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};