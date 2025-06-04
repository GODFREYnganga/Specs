"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { StateContext } from "../context/StateContext"
import { login, register } from "../services/authService"
import "./Login.css"

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { dispatch } = useContext(StateContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await login(formData.email, formData.password)

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: response.data,
      })

      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.")
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await register(formData)

      dispatch({
        type: "REGISTER_SUCCESS",
        payload: response.data,
      })

      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-80vh px-4 md:px-6 py-8">
      <div className="w-full max-w-md">
        <div className="auth-tabs">
          <div className="tabs-list grid grid-cols-2">
            <button
              className={`tab-trigger ${activeTab === "login" ? "active" : ""}`}
              onClick={() => setActiveTab("login")}
            >
              Login
            </button>
            <button
              className={`tab-trigger ${activeTab === "register" ? "active" : ""}`}
              onClick={() => setActiveTab("register")}
            >
              Register
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="card-header">
                  <h2 className="card-title">Welcome back</h2>
                  <p className="card-description">Enter your credentials to access your account</p>
                </div>
                <div className="card-content space-y-4">
                  {error && <div className="error-message">{error}</div>}
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password">Password</label>
                      <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit}>
                <div className="card-header">
                  <h2 className="card-title">Create an account</h2>
                  <p className="card-description">Enter your information to create an account</p>
                </div>
                <div className="card-content space-y-4">
                  {error && <div className="error-message">{error}</div>}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName">First name</label>
                      <input
                        id="firstName"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName">Last name</label>
                      <input
                        id="lastName"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn-primary w-full" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
