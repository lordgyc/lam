"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.replace("/admin");
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleLogin}>
        <h1>Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {message && <p className="msg">{message}</p>}
      </form>

      <style jsx>{`
        .login-wrap {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f0f;
        }

        .login-card {
          width: 360px;
          background: #181818;
          padding: 2rem;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
        }

        h1 {
          text-align: center;
          color: white;
        }

        input {
          padding: 0.8rem;
          background: #222;
          border: 1px solid #333;
          border-radius: 6px;
          color: white;
        }

        button {
          padding: 0.8rem;
          background: #4f46e5;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
        }

        .msg {
          text-align: center;
          color: #ff6b6b;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
