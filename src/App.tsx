import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Auth from "./pages/Auth";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <>
      <header>
        <strong>Nordisk Hem</strong>
        <Link to="/">Produkter</Link>
        <Link to="/orders">Mina ordrar</Link>
        <span style={{ marginLeft: "auto" }}>
          {session ? (
            <button onClick={() => supabase.auth.signOut()}>Logga ut</button>
          ) : (
            <Link to="/auth">Logga in</Link>
          )}
        </span>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Products session={session} />} />
          <Route path="/orders" element={<Orders session={session} />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </main>
    </>
  );
}
