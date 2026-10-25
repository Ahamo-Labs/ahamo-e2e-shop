import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];

const price = (cents: number) => `${(cents / 100).toFixed(0)} kr`;

export default function Products({ session }: { session: Session | null }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("name")
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  const buy = async (product: Product) => {
    if (!session) {
      setMessage("Logga in för att handla.");
      return;
    }
    const { data: order, error } = await supabase
      .from("orders")
      .insert({ user_id: session.user.id, total_cents: product.price_cents })
      .select()
      .single();
    if (error || !order) {
      setMessage(error?.message ?? "Kunde inte lägga ordern.");
      return;
    }
    await supabase
      .from("order_items")
      .insert({ order_id: order.id, product_id: product.id, quantity: 1, unit_price_cents: product.price_cents });
    await supabase.functions.invoke("order-confirmation", { body: { orderId: order.id } });
    setMessage(`Tack! Order ${order.id.slice(0, 8)} är lagd.`);
  };

  return (
    <>
      <h1>Produkter</h1>
      {message && <p>{message}</p>}
      <div className="grid">
        {products.map((product) => (
          <div className="card" key={product.id}>
            {product.image_path && (
              <img
                alt={product.name}
                src={supabase.storage.from("product-images").getPublicUrl(product.image_path).data.publicUrl}
              />
            )}
            <h3>{product.name}</h3>
            <div dangerouslySetInnerHTML={{ __html: product.description ?? "" }} />
            <p>{price(product.price_cents)}</p>
            <button disabled={!product.in_stock} onClick={() => buy(product)}>
              {product.in_stock ? "Köp" : "Slut i lager"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
