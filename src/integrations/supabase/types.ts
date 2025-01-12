export type Database = {
  public: {
    Tables: {
      inventory_items: {
        Row: {
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
        Insert: {
          id?: string;
          product_name: string;
          description?: string | null;
          sku?: string | null;
          uom: string;
          min_stock?: number | null;
          created_at?: string;
          updated_at?: string;
          product_id?: string | null;
          category?: string | null;
          manufacturing_id?: string | null;
          manufacturer?: string | null;
          order_link?: string | null;
          price?: number | null;
        };
        Update: {
          id?: string;
          product_name?: string;
          description?: string | null;
          sku?: string | null;
          uom?: string;
          min_stock?: number | null;
          created_at?: string;
          updated_at?: string;
          product_id?: string | null;
          category?: string | null;
          manufacturing_id?: string | null;
          manufacturer?: string | null;
          order_link?: string | null;
          price?: number | null;
        };
        Relationships: [];
      };
      
      purchase_orders: {
        Row: {
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
        Insert: {
          id?: string;
          po_number: string;
          supplier: string;
          order_date: string;
          expected_delivery_date?: string | null;
          notes?: string | null;
          status?: string;
          total_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          po_number?: string;
          supplier?: string;
          order_date?: string;
          expected_delivery_date?: string | null;
          notes?: string | null;
          status?: string;
          total_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          item_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          item_id: string;
          quantity?: number;
          unit_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          item_id?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_item_id_fkey";
            columns: ["item_id"];
            referencedRelation: "inventory_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey";
            columns: ["purchase_order_id"];
            referencedRelation: "purchase_orders";
            referencedColumns: ["id"];
          }
        ];
      };
    };
  };
};
