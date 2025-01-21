export interface InventoryItem {
  id: string;
  product_name: string;
  description?: string;
  sku?: string;
  uom: string;
  min_stock?: number;
  price?: number;
  manufacturer?: string;
  category?: string;
  order_link?: string;
  product_id?: string;
  manufacturing_id?: string;
  qty_per_uom?: number;
  created_at?: string;
  updated_at?: string;
}