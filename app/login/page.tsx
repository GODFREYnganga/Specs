"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'login' | 'register'>('login')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      // Save token to localStorage or cookie as needed
      localStorage.setItem('token', data.token)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || (data.errors && data.errors[0]?.msg) || 'Registration failed')
      // Save token to localStorage or cookie as needed
      localStorage.setItem('token', data.token)
      window.location.href = '/'
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="p-6 bg-card rounded-lg shadow">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{tab === 'login' ? 'Sign In' : 'Register'}</h2>
            <p className="text-muted-foreground">
              {tab === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
          <div className="flex gap-2 mb-6">
            <Button variant={tab === 'login' ? 'default' : 'outline'} onClick={() => setTab('login')} className="flex-1">Sign In</Button>
            <Button variant={tab === 'register' ? 'default' : 'outline'} onClick={() => setTab('register')} className="flex-1">Register</Button>
          </div>
          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
                  <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={registerData.firstName} onChange={e => setRegisterData({ ...registerData, firstName: e.target.value })} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={registerData.lastName} onChange={e => setRegisterData({ ...registerData, lastName: e.target.value })} required />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" value={registerData.email} onChange={e => setRegisterData({ ...registerData, email: e.target.value })} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={registerData.password} onChange={e => setRegisterData({ ...registerData, password: e.target.value })} required />
                  <button type="button" className="absolute right-2 top-2" onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Registering...' : 'Register'}</Button>
            </form>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <Link href="/forgot-password" className="text-xs text-muted-foreground hover:underline">Forgot password?</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
