export type InventoryItem = {
  id: string;
  product_name: string;
  description: string | null;
  sku: string | null;
  uom: string;
  min_stock: number | null;
  created_at: string;
  updated_at: string;
  product_id: string | null;
  category: string | null;
  manufacturing_id: string | null;
  manufacturer: string | null;
  order_link: string | null;
  price: number | null;
};

export type InventoryLocation = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type InventoryStock = {
  id: string;
  item_id: string | null;
  location_id: string | null;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export type StockWithRelations = InventoryStock & {
  inventory_items: Pick<InventoryItem, 'product_name' | 'sku'>;
  inventory_locations: Pick<InventoryLocation, 'name'>;
};

export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier: string;
  order_date: string;
  expected_delivery_date: string | null;
  status: string;
  total_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PurchaseOrderItem = {
  id: string;
  purchase_order_id: string;
  item_id: string;
  quantity: number;
  unit_price: number;
  received_quantity: number;
  created_at: string;
  updated_at: string;
  inventory_items?: Pick<InventoryItem, 'product_name' | 'sku'>;
};