"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function AdminUserManagement() {
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const fetchAdmins = async () => {
    setLoading(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/admin-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setAdmins(data)
    } catch {
      setError("Failed to load admin users.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to add admin user.")
      setForm({ firstName: "", lastName: "", email: "", password: "" })
      setSuccess("Admin user added.")
      fetchAdmins()
    } catch {
      setError("Failed to add admin user.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    setError("")
    setSuccess("")
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/admin-users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error("Failed to remove admin user.")
      setSuccess("Admin user removed.")
      fetchAdmins()
    } catch {
      setError("Failed to remove admin user.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4">Admin User Management</h2>
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6">
        <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
        <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
        <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <Button type="submit" disabled={loading}>Add Admin</Button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin._id} className="border-b">
                <td className="p-2">{admin.firstName} {admin.lastName}</td>
                <td className="p-2">{admin.email}</td>
                <td className="p-2">
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(admin._id)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
