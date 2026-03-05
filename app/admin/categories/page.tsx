"use client";
import { useEffect, useState } from "react";

export default function AdminCategories() {
const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#f97316",
    status: "active",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();

      // 🔥 SAFE FIX
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `/api/categories/${editingId}`
      : "/api/categories";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      description: "",
      color: "#f97316",
      status: "active",
    });
    setEditingId(null);
    fetchCategories();
  };

  const toggleStatus = async (cat) => {
    await fetch(`/api/categories/${cat._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...cat,
        status: cat.status === "active" ? "hidden" : "active",
      }),
    });

    fetchCategories();
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;

    const res = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Cannot delete category with existing posts.");
    }

    fetchCategories();
  };

  const editCategory = (cat) => {
    setEditingId(cat._id);
    setForm({
      name: cat.name,
      description: cat.description || "",
      color: cat.color || "#f97316",
      status: cat.status,
    });
  };

  // 🔥 SAFE STATS (No crash possible)
  const safeCategories = Array.isArray(categories) ? categories : [];

  const totalCategories = safeCategories.length;
  const activeCategories = safeCategories.filter(
    (c) => c.status === "active"
  ).length;
  const hiddenCategories = safeCategories.filter(
    (c) => c.status === "hidden"
  ).length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Category Management</h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <StatBox label="Total Categories" value={totalCategories} />
        <StatBox label="Active Categories" value={activeCategories} />
        <StatBox label="Hidden Categories" value={hiddenCategories} />
      </div>

      {/* FORM */}
      <div className="bg-[#1f2937] p-6 rounded-xl mb-8 border border-gray-700">
        <h2 className="text-lg mb-4">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="p-3 bg-[#111827] rounded"
            required
          />

          <input
            type="color"
            name="color"
            value={form.color}
            onChange={handleChange}
            className="p-1 h-12"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="p-3 bg-[#111827] rounded md:col-span-2"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="p-3 bg-[#111827] rounded"
          >
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>

          <button className="bg-orange-600 py-3 rounded font-semibold md:col-span-2">
            {editingId ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-[#1f2937] rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#111827]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Posts</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeCategories.map((cat) => (
              <tr key={cat._id} className="border-t border-gray-700">
                <td className="p-3 flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ background: cat.color }}
                  ></span>
                  {cat.name}
                </td>
                <td>{cat.postCount || 0}</td>
                <td>
                  <button
                    onClick={() => toggleStatus(cat)}
                    className={`px-3 py-1 rounded text-sm ${
                      cat.status === "active"
                        ? "bg-green-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {cat.status}
                  </button>
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => editCategory(cat)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(cat._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-[#1f2937] p-6 rounded-xl border border-gray-700 text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}