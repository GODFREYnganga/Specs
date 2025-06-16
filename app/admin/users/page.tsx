"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { Loader2, Search, UserPlus, Trash2, Edit, Filter, Users, Crown } from "lucide-react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "admin"
  active?: boolean
  createdAt?: string
  lastLogin?: string
}

const roleColors = {
  user: "bg-blue-100 text-blue-800",
  admin: "bg-purple-100 text-purple-800"
}

export default function AdminUsers() {
  const searchParams = useSearchParams()
  const initialFilter = searchParams.get('filter') || 'all'
  
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>(initialFilter)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user" as "user" | "admin"
  })

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  async function loadUsers() {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        throw new Error("Failed to load users")
      }    } catch (error) {
      console.error("Load users error:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  function filterUsers() {
    let filtered = users

    if (searchTerm) {
      filtered = filtered.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        return (
          fullName.includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    setFilteredUsers(filtered)
  }

  async function createUser() {
    try {      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        const userData = await response.json()
        setUsers(prev => [...prev, userData])
        setNewUser({ firstName: "", lastName: "", email: "", password: "", role: "user" })
        setShowAddDialog(false)
        toast({
          title: "Success",
          description: `${newUser.role === 'admin' ? 'Admin' : 'User'} created successfully`
        })
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to create user")
      }
    } catch (error) {
      console.error("Create user error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive"
      })
    }
  }

  async function updateUserRole(userId: string, newRole: "user" | "admin") {
    try {
      setUpdating(userId)
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userId, role: newRole })
      })

      if (response.ok) {        setUsers(prev => prev.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ))
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`
        })
      } else {
        throw new Error("Failed to update user role")
      }
    } catch (error) {
      console.error("Update user error:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  async function deleteUser(userId: string) {
    if (!window.confirm("Are you sure you want to delete this user?")) return
      try {
      setLoading(true);
      const response = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userId })
      });
      
      if (response.ok) {
        setUsers(prev => prev.filter(user => user._id !== userId))
        toast({
          title: "Success",
          description: "User deleted successfully"
        })
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Delete user error:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString?: string) {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const userCount = users.filter(u => u.role === "user").length
  const adminCount = users.filter(u => u.role === "admin").length

  return (
    <div className="p-6">      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {roleFilter === 'admin' ? 'Admin Management' : 
             roleFilter === 'user' ? 'User Management' : 
             'Users Management'}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">{userCount} Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-gray-600">{adminCount} Admins</span>
            </div>
          </div>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: "user" | "admin") => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createUser} className="w-full">
                Create {newUser.role === 'admin' ? 'Admin' : 'User'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Users Only</SelectItem>
            <SelectItem value="admin">Admins Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={roleColors[user.role]}>
                          {user.role === 'admin' ? (
                            <>
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3 mr-1" />
                              User
                            </>
                          )}
                        </Badge>
                        <Select
                          value={user.role}
                          onValueChange={(value: "user" | "admin") => updateUserRole(user._id, value)}
                          disabled={updating === user._id}
                        >
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active !== false ? "default" : "secondary"}>
                        {user.active !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
