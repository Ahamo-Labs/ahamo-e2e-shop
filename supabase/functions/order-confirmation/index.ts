import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { orderId } = await req.json();
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization")! } },
  });
  const { data: order } = await supabase.from("orders").select("id, total_cents").eq("id", orderId).single();
  console.log(`Order confirmed: ${order?.id} (${order?.total_cents} öre)`);
  return new Response(JSON.stringify({ confirmed: Boolean(order) }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
