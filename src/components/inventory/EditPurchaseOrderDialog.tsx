import React, { useRef } from 'react';
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
import { Pencil, Plus, Trash2, Save, Search, Building2, Mail, Phone, MapPin, Printer, CheckCircle } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface EditPurchaseOrderDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderUpdated: () => void;
}

const PrintableContent = ({ order }: { order: any }) => {
  return (
    <div className="p-8 bg-white">
      {/* Company Logo and Info */}
      <div className="flex justify-between mb-8">
        <div>
          <img 
            src="https://zqlchnhpfdwmqdpmdntc.supabase.co/storage/v1/object/public/Website_images/Logo.png" 
            alt="Company Logo" 
            className="h-16 mb-4" 
          />
          <h2 className="text-xl font-bold">NYDI</h2>
          <p className="text-sm text-gray-600">123 Business Street</p>
          <p className="text-sm text-gray-600">New York, NY 10001</p>
          <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
          <p className="text-sm text-gray-600">Email: info@nydi.com</p>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold mb-2">Purchase Order</h1>
          <p className="text-sm text-gray-600">PO #{order.po_number}</p>
          <p className="text-sm text-gray-600">Date: {format(new Date(order.order_date), 'MMM dd, yyyy')}</p>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold mb-2">Supplier</h3>
          <p className="text-sm">{order.suppliers?.supplier_name}</p>
          <p className="text-sm">{order.suppliers?.address}</p>
          <p className="text-sm">{order.suppliers?.phone}</p>
          <p className="text-sm">{order.suppliers?.email}</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Ship To</h3>
          <p className="text-sm">NYDI Warehouse</p>
          <p className="text-sm">456 Shipping Avenue</p>
          <p className="text-sm">New York, NY 10002</p>
          <p className="text-sm">Phone: (555) 123-4567</p>
        </div>
      </div>

      {/* Order Items */}
      <Table className="mb-8">
        <TableHeader>
          <TableRow>
            <TableHead>Product ID</TableHead>
            <TableHead>Product Name</TableHead>
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
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unit_price}</TableCell>
              <TableCell>${(item.quantity * item.unit_price).toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">Total Amount:</TableCell>
            <TableCell className="font-bold">${order.total_amount}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Terms and Notes */}
      <div className="mb-8">
        <h3 className="font-bold mb-2">Notes</h3>
        <p className="text-sm">{order.notes || 'No additional notes'}</p>
      </div>

      {/* Created and Approved Information */}
      <div className="mb-8 text-sm text-gray-600">
        <div className="mb-2">
          <span className="font-semibold">Created By: </span>
          {order.created_by_user ? 
            `${order.created_by_user.first_name} ${order.created_by_user.last_name}` : 
            'N/A'
          }
          {order.created_at_local && (
            <span className="ml-2">
              on {format(new Date(order.created_at_local), 'MMM dd, yyyy HH:mm')}
            </span>
          )}
        </div>
        <div>
          <span className="font-semibold">Approved By: </span>
          {order.approved_by_user ? 
            `${order.approved_by_user.first_name} ${order.approved_by_user.last_name}` : 
            'Not approved yet'
          }
          {order.approved_at && (
            <span className="ml-2">
              on {format(new Date(order.approved_at), 'MMM dd, yyyy HH:mm')}
            </span>
          )}
        </div>
      </div>

      {/* Approval Date */}
      <div className="mt-16">
        <div className="border-t border-gray-400 pt-4 w-64">
          <p className="text-sm">
            {order.approved_at ? 
              `Approved on ${format(new Date(order.approved_at), 'MMM dd, yyyy')}` : 
              'Not approved yet'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

const EditPurchaseOrderDialog = ({ orderId, open, onOpenChange, onOrderUpdated }: EditPurchaseOrderDialogProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: `PO-${editedOrder?.po_number || ""}`,
    onPrintError: (error) => {
      console.error('Print failed:', error);
      toast({
        variant: "destructive",
        title: "Print Error",
        description: "Failed to print purchase order"
      });
    },
    onAfterPrint: () => {
      console.log('Print completed');
    },
    contentRef: printRef
  });

  const handlePrintClick = () => {
    handlePrint();
  };

  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('product_name');

      if (error) throw error;
      return data;
    },
  });

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
          ),
          created_by_user:user_roles!purchase_orders_created_by_fkey (
            id,
            first_name,
            last_name,
            user_id
          ),
          approved_by_user:user_roles!purchase_orders_approved_by_fkey (
            id,
            first_name,
            last_name,
            user_id
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

  const handleApprove = async () => {
    if (!orderId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("No authenticated user found");
      }

      let { data: userRole, error: userRoleError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!userRole) {
        const { data: newUserRole, error: createError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'CLINICAL_STAFF',
            first_name: user.user_metadata?.first_name || null,
            last_name: user.user_metadata?.last_name || null
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating user role:', createError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create user role",
          });
          return;
        }

        userRole = newUserRole;
      }

      if (userRoleError) {
        console.error('Error fetching user role:', userRoleError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve purchase order - User role error",
        });
        return;
      }

      const { error: approvalError } = await supabase
        .from('purchase_orders')
        .update({
          status: 'approved',
          approved_by: userRole.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (approvalError) {
        console.error('Error approving purchase order:', approvalError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to approve purchase order",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Purchase order approved successfully",
      });
      onOrderUpdated();
    } catch (error) {
      console.error('Error in approval process:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while approving the purchase order",
      });
    }
  };

  const handleSave = async () => {
    if (!editedOrder) return;

    const { error: orderError } = await supabase
      .from('purchase_orders')
      .update({
        notes: editedOrder.notes,
        expected_delivery_date: editedOrder.expected_delivery_date,
        status: editedOrder.status,
      })
      .eq('id', orderId);

    if (orderError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update purchase order",
      });
      return;
    }

    if (editedOrder.purchase_order_items) {
      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .upsert(
          editedOrder.purchase_order_items.map((item: any) => ({
            id: item.id,
            purchase_order_id: orderId,
            item_id: item.item_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            product_id: item.product_id,
            product_name: item.product_name,
            manufacturing_id: item.manufacturing_id,
            manufacturer: item.manufacturer,
            uom: item.uom
          }))
        );

      if (itemsError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update order items",
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Purchase order updated successfully",
    });
    setIsEditing(false);
    onOrderUpdated();
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ ...item });
  };

  const handleSaveItem = () => {
    if (!editingItem) return;

    const updatedItems = editedOrder.purchase_order_items.map((item: any) =>
      item.id === editingItem.id ? editingItem : item
    );

    setEditedOrder({
      ...editedOrder,
      purchase_order_items: updatedItems,
      total_amount: updatedItems.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unit_price), 0)
    });
    setEditingItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    const updatedItems = editedOrder.purchase_order_items.filter((item: any) => item.id !== itemId);
    setEditedOrder({
      ...editedOrder,
      purchase_order_items: updatedItems,
      total_amount: updatedItems.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unit_price), 0)
    });
  };

  const handleAddInventoryItem = (item: any) => {
    const newItem = {
      id: crypto.randomUUID(),
      purchase_order_id: orderId,
      item_id: item.id,
      quantity: 1,
      unit_price: item.price || 0,
      product_id: item.product_id,
      product_name: item.product_name,
      manufacturing_id: item.manufacturing_id,
      manufacturer: item.manufacturer,
      uom: item.uom
    };

    const updatedItems = [...(editedOrder.purchase_order_items || []), newItem];
    setEditedOrder({
      ...editedOrder,
      purchase_order_items: updatedItems,
      total_amount: updatedItems.reduce((sum: number, item: any) => 
        sum + (item.quantity * item.unit_price), 0)
    });
    setShowAddItemDialog(false);
  };

  const filteredInventoryItems = inventoryItems?.filter((item: any) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
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
              <DialogHeader>
                <div className="flex justify-between items-center mt-6">
                  <DialogTitle className="text-xl">Purchase Order #{order.po_number}</DialogTitle>
                  <div className="flex items-center space-x-2">
                    {isEditing ? (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                          className="gap-2"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleSave}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={order.status === 'approved' ? handlePrintClick : handleApprove}
                          className={order.status === 'approved' 
                            ? "gap-2" 
                            : "gap-2 bg-green-50 hover:bg-green-100 text-green-600 border-green-200"
                          }
                        >
                          {order.status === 'approved' ? (
                            <>
                              <Printer className="h-4 w-4" />
                              Print PO
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Approve PO
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border-gray-200 shadow-sm transition-all duration-200 hover:shadow-md"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit Order
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-3 p-4 border-b border-gray-100">
                          <Building2 className="h-5 w-5 text-primary-500" />
                          <h3 className="text-lg font-semibold text-gray-900">Supplier Details</h3>
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="flex items-start gap-2">
                            <Building2 className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.suppliers?.supplier_name}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-2">
                              <Mail className="h-4 w-4 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{order.suppliers?.email || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <Phone className="h-4 w-4 text-gray-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{order.suppliers?.phone || 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.suppliers?.address || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {isEditing && (
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowAddItemDialog(true)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Item
                    </Button>
                  </div>
                )}
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
                          {isEditing && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editedOrder.purchase_order_items?.map((item: any) => (
                          <TableRow key={item.id}>
                            {editingItem?.id === item.id ? (
                              <>
                                <TableCell>{item.product_id}</TableCell>
                                <TableCell>{item.product_name}</TableCell>
                                <TableCell>{item.manufacturing_id}</TableCell>
                                <TableCell>{item.manufacturer}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={editingItem.quantity}
                                    onChange={(e) => setEditingItem({
                                      ...editingItem,
                                      quantity: parseInt(e.target.value)
                                    })}
                                    className="w-20"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={editingItem.unit_price}
                                    onChange={(e) => setEditingItem({
                                      ...editingItem,
                                      unit_price: parseFloat(e.target.value)
                                    })}
                                    className="w-24"
                                  />
                                </TableCell>
                                <TableCell>
                                  ${(editingItem.quantity * editingItem.unit_price).toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSaveItem}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{item.product_id}</TableCell>
                                <TableCell>{item.product_name}</TableCell>
                                <TableCell>{item.manufacturing_id}</TableCell>
                                <TableCell>{item.manufacturer}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>${item.unit_price}</TableCell>
                                <TableCell>
                                  ${(item.quantity * item.unit_price).toFixed(2)}
                                </TableCell>
                                {isEditing && (
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEditItem(item)}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveItem(item.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                )}
                              </>
                            )}
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={6} className="text-right font-medium">
                            Total Amount
                          </TableCell>
                          <TableCell className="font-medium">
                            ${editedOrder.total_amount}
                          </TableCell>
                          {isEditing && <TableCell />}
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    {/* Add created by and approved by information */}
                    <div className="mt-6 grid grid-cols-2 gap-4 text-sm border-t pt-4">
                      <div>
                        <p className="text-gray-500">Created By</p>
                        <p className="font-medium">
                          {order.created_by_user ? 
                            `${order.created_by_user.first_name} ${order.created_by_user.last_name}` : 
                            'N/A'
                          }
                        </p>
                        <p className="text-gray-500 text-xs">
                          {order.created_at_local ? 
                            format(new Date(order.created_at_local), 'MMM dd, yyyy HH:mm') : 
                            'N/A'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Approved By</p>
                        <p className="font-medium">
                          {order.approved_by_user ? 
                            `${order.approved_by_user.first_name} ${order.approved_by_user.last_name}` : 
                            'Not approved yet'
                          }
                        </p>
                        <p className="text-gray-500 text-xs">
                          {order.approved_at ? 
                            format(new Date(order.approved_at), 'MMM dd, yyyy HH:mm') : 
                            'N/A'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="hidden">
                <div ref={printRef}>
                  <PrintableContent order={order} />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
        <DialogContent className="max-w-[90vw] w-[1200px] max-h-[85vh] h-[800px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Item from Inventory</DialogTitle>
          </DialogHeader>
          <div className="relative w-full mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>UOM</TableHead>
                <TableHead>Manufacturer</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventoryItems?.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.product_name}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>${item.price?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddInventoryItem(item)}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!filteredInventoryItems || filteredInventoryItems.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditPurchaseOrderDialog;
