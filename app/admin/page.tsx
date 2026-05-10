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
  const selectedCategory = categories.find((category) => category.id === selectedCatId);

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
        <div className="brand-block">
          <p>Admin</p>
          <h1>Lambadina Menu</h1>
        </div>

        <div className="side-header">
          <div>
            <span>Categories</span>
            <strong>{categories.length}</strong>
          </div>
          <button className="add-btn" onClick={addCategory}>Add</button>
        </div>

        <div className="category-list">
          {categories.map((c) => (
            <div key={c.id} className={`cat-row ${selectedCatId === c.id ? "active" : ""}`}>
              <button
                className="cat-btn"
                onClick={() => setSelectedCatId(c.id)}
                disabled={deletingCategoryId === c.id}
              >
                {c.name}
              </button>
              <button
                className="del-btn"
                onClick={() => deleteCategory(c.id)}
                disabled={deletingCategoryId === c.id}
                aria-label={`Delete ${c.name}`}
              >
                {deletingCategoryId === c.id ? "..." : "Delete"}
              </button>
            </div>
          ))}
        </div>

        <button className="logout" onClick={() => supabase.auth.signOut().then(() => router.replace("/login"))}>
          Logout
        </button>
      </aside>

      <main>
        <div className="topbar">
          <div>
            <p>Editing</p>
            <h2>{selectedCategory?.name || "Choose a category"}</h2>
          </div>
          {selectedCatId && (
            <button className="add" onClick={addItem}>
              Add item
            </button>
          )}
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {!selectedCatId && (
          <div className="empty-admin">
            <h3>Select a category</h3>
            <p>Pick a category on the left to edit its menu items.</p>
          </div>
        )}
        {loadingItems && <p className="loading-line">Loading items...</p>}

        {items.map((item) => (
          <div key={item.id} className="item-row">
            <div className="item-main">
              <label>
                Name
                <input
                  defaultValue={item.name}
                  placeholder="Name"
                  onBlur={(e) => updateItem(item.id, { name: e.target.value })}
                />
              </label>
              <label className="price-field">
                Price
                <input
                  type="number"
                  defaultValue={item.price}
                  placeholder="Price"
                  onBlur={(e) =>
                    updateItem(item.id, { price: Number(e.target.value) })
                  }
                />
              </label>
              <button className="del-item" onClick={() => deleteItem(item.id)}>Delete</button>
            </div>
            <label className="description-field">
              Description
              <textarea
                defaultValue={item.desc}
                placeholder="Short menu description"
                onBlur={(e) => updateItem(item.id, { desc: e.target.value })}
              />
            </label>
          </div>
        ))}
      </main>

      <style jsx>{`
        .admin-wrap {
          height: 100vh;
          display: flex;
          background:
            radial-gradient(circle at top left, rgba(226, 168, 75, 0.12), transparent 32rem),
            #0d0d16;
          color: #f4efe6;
          font-family: Inter, system-ui, sans-serif;
        }

        aside {
          width: 300px;
          background: rgba(20, 20, 32, 0.92);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .brand-block p,
        .topbar p,
        .side-header span {
          color: #8c8790;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .brand-block h1,
        .topbar h2 {
          margin: 0;
          line-height: 1.1;
        }

        .brand-block h1 {
          font-family: Georgia, serif;
          font-size: 1.8rem;
        }

        .side-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .side-header div {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .side-header strong {
          font-size: 1.6rem;
        }

        .add-btn {
          background: #e2a84b;
          color: #17120a;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 800;
          padding: 0.6rem 0.95rem;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          overflow-y: auto;
        }

        .cat-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 0.5rem;
          padding: 0.35rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .cat-row.active {
          border-color: rgba(226, 168, 75, 0.5);
          background: rgba(226, 168, 75, 0.1);
        }

        .cat-btn,
        .del-btn,
        .logout,
        .add,
        .del-item {
          font: inherit;
        }

        .cat-btn {
          overflow: hidden;
          border: none;
          border-radius: 9px;
          background: transparent;
          color: white;
          cursor: pointer;
          font-weight: 700;
          padding: 0.65rem 0.75rem;
          text-align: left;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .del-btn {
          border: none;
          border-radius: 9px;
          background: rgba(239, 68, 68, 0.12);
          color: #fecaca;
          cursor: pointer;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.55rem 0.65rem;
        }

        .cat-btn:disabled,
        .del-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .logout {
          margin-top: auto;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          color: #f4efe6;
          cursor: pointer;
          padding: 0.8rem 1rem;
        }

        main {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin: -2rem -2rem 1.5rem;
          padding: 1.5rem 2rem;
          background: rgba(13, 13, 22, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
        }

        .topbar h2 {
          font-size: 1.75rem;
        }

        .add {
          background: #e2a84b;
          border: none;
          border-radius: 999px;
          color: #17120a;
          cursor: pointer;
          font-weight: 800;
          padding: 0.75rem 1rem;
          white-space: nowrap;
        }

        .error-message {
          background: rgba(127, 29, 29, 0.35);
          border: 1px solid rgba(248, 113, 113, 0.35);
          border-radius: 12px;
          color: #fecaca;
          margin: 0 0 1rem;
          padding: 0.9rem 1rem;
        }

        .loading-line,
        .empty-admin p {
          color: #9a9494;
        }

        .empty-admin {
          border: 1px dashed rgba(255, 255, 255, 0.14);
          border-radius: 16px;
          padding: 3rem 2rem;
          text-align: center;
        }

        .empty-admin h3 {
          margin: 0 0 0.4rem;
        }

        .item-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1rem;
          background: rgba(22, 22, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 1rem;
        }

        .item-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 140px auto;
          gap: 0.8rem;
          align-items: end;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          color: #8c8790;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        input,
        textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          color: #f4efe6;
          font: inherit;
          padding: 0.8rem 0.85rem;
          text-transform: none;
        }

        textarea {
          min-height: 76px;
          resize: vertical;
        }

        .del-item {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(248, 113, 113, 0.18);
          border-radius: 10px;
          color: #fecaca;
          cursor: pointer;
          font-weight: 800;
          padding: 0.82rem 1rem;
        }

        @media (max-width: 760px) {
          .admin-wrap {
            flex-direction: column;
          }

          aside {
            width: 100%;
            max-height: 42vh;
          }

          main {
            padding: 1.25rem;
          }

          .topbar {
            margin: -1.25rem -1.25rem 1.25rem;
            padding: 1rem 1.25rem;
          }

          .item-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
