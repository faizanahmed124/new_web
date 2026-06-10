"use client";

import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, X, Check, LogOut,
  Search, Package, TrendingUp, Tag, AlertCircle
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  category: string;
  badge: string | null;
  slug: string;
  image: string;
  description: string;
}

const EMPTY: Product = {
  id: 0, name: "", price: 0, originalPrice: null,
  category: "Men", badge: null, slug: "", image: "", description: "",
};

export default function AdminDashboard() {
  const { isLoggedIn, logout } = useAdmin();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Product>(EMPTY);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Product>(EMPTY);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) { router.push("/admin/signin"); return; }
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d))
      .catch(() => {
        import("@/data/products.json").then((m) => setProducts(m.default as Product[]));
      });
  }, [isLoggedIn]);

  const saveToast = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleUpdate = (id: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...editForm } : p));
    setEditingId(null);
    saveToast();
  };

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
    saveToast();
  };

  const handleAdd = () => {
    const newId = Math.max(...products.map((p) => p.id)) + 1;
    const slug = addForm.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setProducts((prev) => [...prev, { ...addForm, id: newId, slug }]);
    setAddForm(EMPTY);
    setShowAdd(false);
    saveToast();
  };

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "All" || p.category === filterCat;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = {
    total: products.length,
    men: products.filter((p) => p.category === "Men").length,
    women: products.filter((p) => p.category === "Women").length,
    sale: products.filter((p) => p.badge === "SALE").length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAFAF7" }}>

      {/* Toast */}
      {saved && (
        <div className="fixed top-5 right-5 z-50 bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg animate-in fade-in duration-200">
          <Check className="w-3.5 h-3.5" /> Changes saved
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-[0.12em] text-stone-900"
              style={{ fontFamily: "'Georgia', serif" }}>FORTY</span>
            <span className="text-[8px] tracking-[0.45em] text-stone-400 uppercase -mt-0.5">SHOES</span>
          </div>
          <span className="text-stone-300 text-lg">|</span>
          <span className="text-[11px] tracking-[0.18em] uppercase text-stone-500 font-semibold">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-[11px] tracking-wide text-stone-500 hover:text-stone-900 transition-colors">
            ← View Site
          </a>
          <button onClick={() => { logout(); router.push("/admin/signin"); }}
            className="flex items-center gap-1.5 text-[11px] tracking-wide text-stone-500 hover:text-red-600 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Package, label: "Total Products", val: stats.total, color: "text-stone-700" },
            { icon: TrendingUp, label: "Men's", val: stats.men, color: "text-blue-700" },
            { icon: TrendingUp, label: "Women's", val: stats.women, color: "text-pink-700" },
            { icon: Tag, label: "On Sale", val: stats.sale, color: "text-red-600" },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-100 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${color}`} />
                <p className="text-[10px] tracking-widest uppercase text-stone-400 font-medium">{label}</p>
              </div>
              <p className="text-2xl font-bold text-stone-900">{val}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input type="text" placeholder="Search products..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-stone-900 w-52" />
            </div>
            {["All", "Men", "Women"].map((c) => (
              <button key={c} onClick={() => setFilterCat(c)}
                className={`text-[11px] tracking-widest uppercase font-semibold px-4 py-2 rounded-full border transition-all ${
                  filterCat === c ? "bg-stone-900 text-white border-stone-900" : "border-stone-200 text-stone-600 hover:border-stone-400"
                }`}>
                {c}
              </button>
            ))}
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold px-5 py-2.5 rounded-full hover:bg-stone-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {["Image", "Name", "Category", "Price", "Badge", "Actions"].map((h) => (
                    <th key={h} className="text-left text-[10px] tracking-widest uppercase text-stone-400 font-semibold px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    {editingId === p.id ? (
                      <>
                        <td className="px-4 py-3">
                          <input value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                            className="w-32 text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900" placeholder="Image URL" />
                          {editForm.image && <img src={editForm.image} alt="" className="w-10 h-10 object-cover rounded-lg mt-1" />}
                        </td>
                        <td className="px-4 py-3">
                          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-36 text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900" />
                          <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-36 text-xs border border-stone-200 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:ring-1 focus:ring-stone-900 resize-none" rows={2} />
                        </td>
                        <td className="px-4 py-3">
                          <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900">
                            <option>Men</option><option>Women</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                            className="w-20 text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900" />
                          <input type="number" value={editForm.originalPrice ?? ""} onChange={(e) => setEditForm({ ...editForm, originalPrice: e.target.value ? Number(e.target.value) : null })}
                            placeholder="Original" className="w-20 text-xs border border-stone-200 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:ring-1 focus:ring-stone-900" />
                        </td>
                        <td className="px-4 py-3">
                          <select value={editForm.badge ?? ""} onChange={(e) => setEditForm({ ...editForm, badge: e.target.value || null })}
                            className="text-xs border border-stone-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900">
                            <option value="">None</option>
                            <option>NEW</option><option>HOT</option><option>SALE</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdate(p.id)}
                              className="bg-green-700 text-white p-1.5 rounded-lg hover:bg-green-800 transition-colors">
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditingId(null)}
                              className="bg-stone-200 text-stone-700 p-1.5 rounded-lg hover:bg-stone-300 transition-colors">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">
                          <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-xl bg-stone-100" />
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-stone-900 text-xs">{p.name}</p>
                          <p className="text-stone-400 text-[11px] line-clamp-1 mt-0.5">{p.description}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-1 rounded-full ${
                            p.category === "Men" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                          }`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-bold text-stone-900 text-xs">${p.price}</p>
                          {p.originalPrice && <p className="text-stone-400 text-[11px] line-through">${p.originalPrice}</p>}
                        </td>
                        <td className="px-4 py-3">
                          {p.badge ? (
                            <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${
                              p.badge === "SALE" ? "bg-red-50 text-red-600" :
                              p.badge === "NEW" ? "bg-green-50 text-green-700" :
                              "bg-amber-50 text-amber-700"
                            }`}>{p.badge}</span>
                          ) : <span className="text-stone-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingId(p.id); setEditForm({ ...p }); }}
                              className="bg-stone-100 text-stone-700 p-1.5 rounded-lg hover:bg-stone-200 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteId(p.id)}
                              className="bg-red-50 text-red-600 p-1.5 rounded-lg hover:bg-red-100 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                <AlertCircle className="w-8 h-8 mb-3" />
                <p className="text-sm">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Add New Product
              </h2>
              <button onClick={() => setShowAdd(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Price ($)", key: "price", type: "number" },
                { label: "Original Price ($)", key: "originalPrice", type: "number" },
                { label: "Image URL", key: "image", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key} className={key === "image" || key === "name" ? "col-span-2" : ""}>
                  <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">{label}</label>
                  <input type={type}
                    value={(addForm as any)[key] ?? ""}
                    onChange={(e) => setAddForm({ ...addForm, [key]: type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50" />
                </div>
              ))}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">Category</label>
                <select value={addForm.category} onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50">
                  <option>Men</option><option>Women</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">Badge</label>
                <select value={addForm.badge ?? ""} onChange={(e) => setAddForm({ ...addForm, badge: e.target.value || null })}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50">
                  <option value="">None</option><option>NEW</option><option>HOT</option><option>SALE</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-stone-500 mb-1.5">Description</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  rows={3} className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 bg-stone-50 resize-none" />
              </div>
            </div>

            {/* Preview */}
            {addForm.image && (
              <div className="mt-4 flex items-center gap-3 bg-stone-50 rounded-xl p-3 border border-stone-100">
                <img src={addForm.image} alt="preview" className="w-12 h-12 object-cover rounded-lg" />
                <div>
                  <p className="text-xs font-semibold text-stone-900">{addForm.name || "Product name"}</p>
                  <p className="text-xs text-stone-400">${addForm.price || 0} · {addForm.category}</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)}
                className="flex-1 py-2.5 border border-stone-200 text-stone-700 text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleAdd} disabled={!addForm.name || !addForm.price}
                className="flex-1 py-2.5 bg-stone-900 text-white text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 w-full max-w-sm shadow-xl text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 mb-1">Delete Product?</h2>
            <p className="text-stone-400 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-stone-200 text-stone-700 text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-stone-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 bg-red-600 text-white text-[11px] tracking-widest uppercase font-bold rounded-full hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}