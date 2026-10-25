export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; avatar_url: string | null; created_at: string };
        Insert: { id: string; full_name?: string | null; avatar_url?: string | null };
        Update: { full_name?: string | null; avatar_url?: string | null };
        Relationships: [];
      };
      products: {
        Row: { id: string; name: string; description: string | null; price_cents: number; image_path: string | null; in_stock: boolean; created_at: string };
        Insert: { name: string; description?: string | null; price_cents: number; image_path?: string | null; in_stock?: boolean };
        Update: { name?: string; description?: string | null; price_cents?: number; image_path?: string | null; in_stock?: boolean };
        Relationships: [];
      };
      orders: {
        Row: { id: string; user_id: string; status: string; total_cents: number; created_at: string };
        Insert: { user_id: string; status?: string; total_cents?: number };
        Update: { status?: string; total_cents?: number };
        Relationships: [];
      };
      order_items: {
        Row: { id: string; order_id: string; product_id: string; quantity: number; unit_price_cents: number };
        Insert: { order_id: string; product_id: string; quantity: number; unit_price_cents: number };
        Update: { quantity?: number };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
