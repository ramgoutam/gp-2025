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