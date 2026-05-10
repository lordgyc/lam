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

        <div className="admin-category-list">
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
          overflow: hidden;
        }

        aside {
          width: 280px;
          min-width: 280px;
          background: rgba(20, 20, 32, 0.92);
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.95rem;
          overflow: hidden;
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
          font-size: 1.35rem;
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
          font-size: 1.25rem;
        }

        .add-btn {
          background: #e2a84b;
          color: #17120a;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 0.48rem 0.8rem;
        }

        .admin-category-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          overflow-y: auto;
          padding-right: 0.15rem;
        }

        .cat-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 0.35rem;
          padding: 0.25rem;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.03);
          min-width: 0;
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
          min-width: 0;
          border: none;
          border-radius: 9px;
          background: transparent;
          color: white;
          cursor: pointer;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 0.52rem 0.6rem;
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
          font-size: 0.68rem;
          font-weight: 800;
          padding: 0.42rem 0.5rem;
          white-space: nowrap;
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
          font-size: 0.86rem;
          padding: 0.68rem 0.85rem;
        }

        main {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
          min-width: 0;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin: -1.5rem -1.5rem 1rem;
          padding: 1rem 1.5rem;
          background: rgba(13, 13, 22, 0.9);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(16px);
        }

        .topbar h2 {
          font-size: 1.35rem;
        }

        .add {
          background: #e2a84b;
          border: none;
          border-radius: 999px;
          color: #17120a;
          cursor: pointer;
          font-size: 0.86rem;
          font-weight: 800;
          padding: 0.62rem 0.9rem;
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
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          background: rgba(22, 22, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 0.85rem;
        }

        .item-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 120px auto;
          gap: 0.65rem;
          align-items: end;
        }

        label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          color: #8c8790;
          font-size: 0.62rem;
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
          font-size: 0.9rem;
          padding: 0.66rem 0.72rem;
          text-transform: none;
        }

        textarea {
          min-height: 64px;
          resize: vertical;
        }

        .del-item {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(248, 113, 113, 0.18);
          border-radius: 10px;
          color: #fecaca;
          cursor: pointer;
          font-size: 0.84rem;
          font-weight: 800;
          padding: 0.68rem 0.82rem;
        }

        @media (max-width: 760px) {
          .admin-wrap {
            flex-direction: column;
            overflow: hidden;
          }

          aside {
            width: 100%;
            min-width: 0;
            max-height: none;
            padding: 0.9rem;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            flex-shrink: 0;
          }

          .brand-block {
            display: none;
          }

          .side-header {
            margin-bottom: 0;
          }

          .admin-category-list {
            display: grid;
            grid-auto-columns: minmax(170px, 220px);
            grid-auto-flow: column;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0 0 0.2rem;
          }

          .cat-row {
            grid-template-columns: minmax(0, 1fr) auto;
          }

          .del-btn {
            font-size: 0;
            width: 2rem;
          }

          .del-btn::before {
            content: "×";
            font-size: 1rem;
            line-height: 1;
          }

          .del-btn:disabled::before {
            content: "...";
            font-size: 0.7rem;
          }

          main {
            padding: 1rem;
            flex: 1;
          }

          .topbar {
            margin: -1rem -1rem 1rem;
            padding: 0.85rem 1rem;
          }

          .item-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
