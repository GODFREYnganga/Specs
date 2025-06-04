"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useStateContext } from "../context/StateContext"
import { authService } from "../services/authService"
import "./Register.css"

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const { dispatch } = useStateContext()
  const navigate = useNavigate()

  const { firstName, lastName, email, password, confirmPassword } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      dispatch({ type: "SET_LOADING" })
      const userData = await authService.register({ firstName, lastName, email, password })
      dispatch({ type: "LOGIN_SUCCESS", payload: userData.user })
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.")
      dispatch({ type: "AUTH_ERROR", payload: err.response?.data?.error || "Registration failed" })
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-tabs">
          <Link to="/login" className="register-tab">
            Login
          </Link>
          <div className="register-tab active">Register</div>
        </div>

        <div className="register-content">
          <h2 className="register-title">Create an account</h2>
          <p className="register-subtitle">Enter your information to create an account</p>

          {error && <div className="register-error">{error}</div>}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button type="submit" className="register-button">
              Create Account
            </button>
          </form>

          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
