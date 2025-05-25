"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import toast from "react-hot-toast"
import { Package, Plus } from "lucide-react"

const CreateComponent = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  })

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
      await api.post("/components", {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity: Number.parseInt(formData.quantity),
      })
      toast.success("Component created successfully!")
      navigate("/components")
    } catch (error) {
      toast.error(error.response?.data?.error || "Error creating component")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "32px", color: "#1f2937" }}>
        <Plus size={32} style={{ marginRight: "12px", verticalAlign: "middle" }} />
        Add New Component
      </h1>

      <div className="card" style={{ maxWidth: "600px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Component Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., RAM DDR4 8GB, SSD 256GB, Screen LCD 15.6"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Detailed description of the component..."
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button type="button" onClick={() => navigate("/components")} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Component"}
            </button>
          </div>
        </form>
      </div>

      {(formData.name || formData.description || formData.price || formData.quantity) && (
        <div className="card" style={{ maxWidth: "600px", marginTop: "24px" }}>
          <h3 style={{ marginBottom: "16px", color: "#1f2937" }}>
            <Package size={20} style={{ marginRight: "8px", verticalAlign: "middle" }} />
            Preview
          </h3>

          <div style={{ padding: "16px", backgroundColor: "#f9fafb", borderRadius: "6px" }}>
            <div style={{ marginBottom: "8px" }}>
              <strong>Name:</strong> {formData.name || "Component name"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Description:</strong> {formData.description || "Component description"}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Price:</strong> ${formData.price || "0.00"}
            </div>
            <div>
              <strong>Quantity:</strong> {formData.quantity || "0"}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateComponent
