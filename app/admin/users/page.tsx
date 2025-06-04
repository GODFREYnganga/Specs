"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import AdminUserManagement from "./admin-management"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-2">{user.firstName} {user.lastName}</td>
                  <td className="p-2">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <AdminUserManagement />
    </div>
  )
}
