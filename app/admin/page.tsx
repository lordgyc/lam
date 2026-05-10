"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Category = { id: number; name: string };
type Item = { id: number; name: string; price: number; cat_id: number; desc?: string };

export default function AdminPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const deleteItem = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await supabase.from("items").delete().eq("id", id);
    setItems((p) => p.filter((i) => i.id !== id));
  };

  const addItem = async () => {
    if (!selectedCatId) return;
    const { data } = await supabase
      .from("items")
      .insert({ name: "New Item", price: 0, cat_id: selectedCatId, desc: "" })
      .select()
      .single();
    if (data) setItems((p) => [...p, data]);
  };

  const addCategory = async () => {
    const name = prompt("Category name:");
    if (!name) return;
    const { data } = await supabase
      .from("category")
      .insert({ name })
      .select()
      .single();
    if (data) setCategories((p) => [...p, data]);
  };

  const deleteCategory = async (id: number) => {
    if (!confirm("Delete this category and all its items?")) return;

    setDeletingCategoryId(id);
    setErrorMessage(null);

    const { error: itemsError } = await supabase
      .from("items")
      .delete()
      .eq("cat_id", id);

    if (itemsError) {
      setDeletingCategoryId(null);
      setErrorMessage(itemsError.message);
      return;
    }

    const { data: deletedCategory, error: categoryError } = await supabase
      .from("category")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    setDeletingCategoryId(null);

    if (categoryError) {
      setErrorMessage(categoryError.message);
      return;
    }

    if (!deletedCategory) {
      setErrorMessage("Category was not deleted. Please check your admin permissions and try again.");
      return;
    }

    setCategories((p) => p.filter((c) => c.id !== id));
    if (selectedCatId === id) {
      setSelectedCatId(null);
      setItems([]);
    }
  };

  return (
    <div className="admin-wrap">
      <aside>
        <div className="side-header">
          <h2>Categories</h2>
          <button className="add-btn" onClick={addCategory}>+</button>
        </div>

        {categories.map((c) => (
          <div key={c.id} className="cat-row">
            <button
              className={`cat-btn ${selectedCatId === c.id ? "active" : ""}`}
              onClick={() => setSelectedCatId(c.id)}
              disabled={deletingCategoryId === c.id}
            >
              {c.name}
            </button>
            <button
              className="del-btn"
              onClick={() => deleteCategory(c.id)}
              disabled={deletingCategoryId === c.id}
            >
              {deletingCategoryId === c.id ? "..." : "×"}
            </button>
          </div>
        ))}

        <button className="logout" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>
          Logout
        </button>
      </aside>

      <main>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {!selectedCatId && <p>Select a category 👈</p>}
        {loadingItems && <p>Loading…</p>}

        {items.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-main">
              <input
                defaultValue={item.name}
                placeholder="Name"
                onBlur={(e) => updateItem(item.id, { name: e.target.value })}
              />
              <input
                type="number"
                defaultValue={item.price}
                placeholder="Price"
                onBlur={(e) =>
                  updateItem(item.id, { price: Number(e.target.value) })
                }
              />
              <button className="del-item" onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
            <textarea
              defaultValue={item.desc}
              placeholder="Description (desc)"
              onBlur={(e) => updateItem(item.id, { desc: e.target.value })}
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
          margin: 0;
        }

        .side-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .add-btn {
          background: #4f46e5;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .cat-row {
          display: flex;
          gap: 0.5rem;
        }

        .cat-btn {
          flex: 1;
          text-align: left;
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

        aside button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .del-btn {
          background: #331111 !important;
          color: #ff4444 !important;
          width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
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

        .error-message {
          background: #441111;
          border: 1px solid #7f1d1d;
          border-radius: 6px;
          color: #fecaca;
          margin: 0 0 1rem;
          padding: 0.75rem 1rem;
        }

        .item-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: #151515;
          padding: 1rem;
          border-radius: 8px;
        }

        .item-main {
          display: flex;
          gap: 1rem;
        }

        .item-row input, .item-row textarea {
          background: #222;
          border: 1px solid #333;
          padding: 0.6rem;
          border-radius: 6px;
          color: white;
        }

        .item-row input {
          flex: 1;
        }

        .item-row textarea {
          width: 100%;
          min-height: 60px;
          resize: vertical;
        }

        .del-item {
          background: #441111;
          color: #ff4444;
          border: none;
          padding: 0 1rem;
          border-radius: 6px;
          cursor: pointer;
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
