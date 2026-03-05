"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserForm({ currentUser }: any) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "reporter",
  });

  const allowedRoles =
    currentUser.role === "admin"
      ? ["editor", "reporter", "advertiser"]
      : ["reporter"];

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/users/create", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      alert("Error creating user");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        placeholder="Name"
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select
        className="w-full p-2 bg-gray-800 rounded"
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        {allowedRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
        Create User
      </button>
    </form>
  );
}