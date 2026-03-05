"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditUserForm({ user, currentUser }: any) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    status: user.status,
  });

  const allowedRoles =
    currentUser.role === "admin"
      ? ["editor", "reporter", "advertiser"]
      : [];

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/user");
    } else {
      alert("Error updating user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        value={form.name}
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {currentUser.role === "admin" && (
        <select
          value={form.role}
          className="w-full p-2 bg-gray-800 rounded"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          {allowedRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      )}

      <select
        value={form.status}
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option value="active">Active</option>
        <option value="blocked">Blocked</option>
      </select>

      <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Update User
      </button>
    </form>
  );
}