import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate("/");
  };

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setError("Kolla din e-post för att bekräfta kontot.");
  };

  return (
    <div className="card" style={{ maxWidth: 360 }}>
      <h1>Logga in</h1>
      <input placeholder="E-post" value={email} onChange={(event) => setEmail(event.target.value)} />
      <input placeholder="Lösenord" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      {error && <p>{error}</p>}
      <button onClick={signIn}>Logga in</button>{" "}
      <button onClick={signUp}>Skapa konto</button>
    </div>
  );
}
