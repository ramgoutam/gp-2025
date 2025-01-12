export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier: string;
  order_date: string;
  expected_delivery_date: string | null;
  notes: string | null;
  status: string;
  total_amount: number | null;
  created_at: string;
  updated_at: string;
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
  inventory_items?: {
    product_name: string;
    product_id: string;
    uom: string;
  };
};