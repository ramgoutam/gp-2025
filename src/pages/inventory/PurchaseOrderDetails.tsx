import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { ArrowLeft, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const PurchaseOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['purchase-order', id],
    queryFn: async () => {
      console.log('Fetching purchase order details for ID:', id);
      
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
        .eq('id', id)
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
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading purchase order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-4">Purchase order not found</p>
              <Button variant="outline" onClick={() => navigate('/inventory/purchase-orders')}>
                Back to Purchase Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  console.log('Rendering order:', order);
  console.log('Order items:', order.purchase_order_items);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/inventory/purchase-orders')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Purchase Order #{order.po_number}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View and manage purchase order details
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button>Edit Order</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                  <p className="mt-1">{order.suppliers?.supplier_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
                  <p className="mt-1">
                    {order.order_date && new Date(order.order_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expected Delivery</h3>
                  <p className="mt-1">
                    {order.expected_delivery_date && 
                      new Date(order.expected_delivery_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.purchase_order_items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.inventory_items?.product_name}</TableCell>
                        <TableCell>{item.inventory_items?.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${item.unit_price}</TableCell>
                        <TableCell>
                          ${(item.quantity * item.unit_price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-medium">
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
      </div>
    </div>
  );
};

export default PurchaseOrderDetails;