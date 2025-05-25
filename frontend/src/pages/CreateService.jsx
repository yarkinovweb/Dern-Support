"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import toast from "react-hot-toast"
import { Plus } from "lucide-react"

const CreateService = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    device_model: "",
    issue_type: "",
    problem_area: "",
    description: "",
    location: "",
    email: user?.email || "",
    fullName: user ? `${user.firstname} ${user.lastname}` : "",
  })

  const issueTypes = [
    "Hardware",
    "Software",
  ]

  const problemAreas = [
    "Screen/Display",
    "Keyboard",
    "Battery",
    "Charging Port",
    "Speakers/Audio",
    "Camera",
    "Hard Drive/SSD",
    "RAM/Memory",
    "Power Supply",
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post("/service/create", formData)
      toast.success("Service request created successfully!")
      navigate("/services")
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating service request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "32px", color: "#1f2937" }}>
        <Plus size={32} style={{ marginRight: "12px", verticalAlign: "middle" }} />
        Create New Service Request
      </h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Device Model *</label>
              <input
                type="text"
                name="device_model"
                value={formData.device_model}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., MacBook Pro 2021, Dell XPS 13"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Issue Type *</label>
              <select
                name="issue_type"
                value={formData.issue_type}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Issue Type</option>
                {issueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Problem Area *</label>
              <select
                name="problem_area"
                value={formData.problem_area}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Problem Area</option>
                {problemAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Office Building A, Room 205"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Please describe the issue in detail..."
              required
            />
          </div>

          {!user && (
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => navigate("/services")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Service Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateService
