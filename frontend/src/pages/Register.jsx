"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"
import './Landing.css'

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  })
  const [isLegalEntity, setIsLegalEntity] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    if (e.target.name === "isLegalEntity" || e.target.name === "address") {
      if (e.target.name === "isLegalEntity") {
        setFormData({
          ...formData, isLegalEntity: e.target.value === "true" ? true : false
        })
      } else {
        setFormData({
          ...formData, address: e.target.value
        })
      }
    }
    else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await register(formData)

      if (result.success) {
        toast.success("Registration successful! Please login.")
        navigate("/login")
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          Registration
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <label className="form-label">Select Account Type</label>

          <select className="form-group" name="isLegalEntity" onChange={(e) => {
            setIsLegalEntity(e.target.value === "false" ? false : true)
            handleChange(e)
          }}>
            <option value={false}>Individual</option>
            <option value={true}>Business</option>
          </select>

          {
            isLegalEntity && <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                onChange={handleChange}
                className="form-input"
                required
              />
              <br /><br />
              <label className="form-label">Company Address</label>
              <input type="text" name="address" onChange={handleChange} className="form-input" required />
            </div>
          }

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
