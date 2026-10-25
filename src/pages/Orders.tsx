import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type OrderRow = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  order_items: { quantity: number; products: { name: string } | null }[];
};

export default function Orders({ session }: { session: Session | null }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("orders")
      .select("id, status, total_cents, created_at, order_items(quantity, products(name))")
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as unknown as OrderRow[]) ?? []));
  }, [session]);

  if (!session) return <p>Logga in för att se dina ordrar.</p>;

  return (
    <>
      <h1>Mina ordrar</h1>
      {orders.map((order) => (
        <div className="card" key={order.id} style={{ marginBottom: 12 }}>
          <strong>{new Date(order.created_at).toLocaleDateString("sv-SE")}</strong> · {order.status} ·{" "}
          {(order.total_cents / 100).toFixed(0)} kr
          <ul>
            {order.order_items.map((item, index) => (
              <li key={index}>
                {item.quantity} × {item.products?.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
