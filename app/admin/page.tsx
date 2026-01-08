"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };
type Item = { id: number; name: string; price: number; cat_id: number };

export default function AdminPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const protect = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) router.replace("/login");
    };
    protect();
  }, [router]);

  useEffect(() => {
    supabase.from("category").select("id,name").then(({ data }) => {
      setCategories(data || []);
    });
  }, []);

  useEffect(() => {
    if (!selectedCatId) return;
    setLoadingItems(true);

    supabase
      .from("items")
      .select("*")
      .eq("cat_id", selectedCatId)
      .then(({ data }) => {
        setItems(data || []);
        setLoadingItems(false);
      });
  }, [selectedCatId]);

  const updateItem = async (id: number, fields: Partial<Item>) => {
    await supabase.from("items").update(fields).eq("id", id);
    setItems((p) => p.map((i) => (i.id === id ? { ...i, ...fields } : i)));
  };

  const addItem = async () => {
    if (!selectedCatId) return;
    const { data } = await supabase
      .from("items")
      .insert({ name: "New Item", price: 0, cat_id: selectedCatId })
      .select()
      .single();
    if (data) setItems((p) => [...p, data]);
  };

  return (
    <div className="admin-wrap">
      <aside>
        <h2>Categories</h2>

        {categories.map((c) => (
          <button
            key={c.id}
            className={selectedCatId === c.id ? "active" : ""}
            onClick={() => setSelectedCatId(c.id)}
          >
            {c.name}
          </button>
        ))}

        <button className="logout" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>
          Logout
        </button>
      </aside>

      <main>
        {!selectedCatId && <p>Select a category 👈</p>}
        {loadingItems && <p>Loading…</p>}

        {items.map((item) => (
          <div key={item.id} className="item-row">
            <input
              defaultValue={item.name}
              onBlur={(e) => updateItem(item.id, { name: e.target.value })}
            />
            <input
              type="number"
              defaultValue={item.price}
              onBlur={(e) =>
                updateItem(item.id, { price: Number(e.target.value) })
              }
            />
          </div>
        ))}

        {selectedCatId && (
          <button className="add" onClick={addItem}>
            + Add Item
          </button>
        )}
      </main>

      <style jsx>{`
        .admin-wrap {
          height: 100vh;
          display: flex;
          background: #0f0f0f;
          color: white;
        }

        aside {
          width: 240px;
          background: #151515;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        aside h2 {
          margin-bottom: 1rem;
        }

        aside button {
          background: #222;
          border: none;
          padding: 0.6rem;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }

        aside button.active {
          background: #4f46e5;
        }

        .logout {
          margin-top: auto;
          background: #333;
        }

        main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .item-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.8rem;
        }

        .item-row input {
          background: #222;
          border: 1px solid #333;
          padding: 0.6rem;
          border-radius: 6px;
          color: white;
          flex: 1;
        }

        .add {
          margin-top: 1rem;
          padding: 0.6rem 1rem;
          background: #4f46e5;
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
