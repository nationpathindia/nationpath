"use client";

import { useEffect, useState } from "react";

export default function UserTable({ currentUser }: any) {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;

    await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    setUsers(users.filter((u) => u._id !== id));
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-gray-800">
              <td className="py-3">{user.name}</td>
              <td>{user.email}</td>
              <td className="capitalize">{user.role}</td>
              <td className="capitalize">{user.status}</td>

              <td>
                {canDelete(currentUser, user) && (
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function canDelete(currentUser: any, target: any) {
  if (currentUser._id === target._id) return false;

  if (currentUser.role === "admin" && target.role !== "admin")
    return true;

  if (currentUser.role === "editor" && target.role === "reporter")
    return true;

  return false;
}