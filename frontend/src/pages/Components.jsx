"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import toast from "react-hot-toast"
import { Package, Plus } from "lucide-react"
import { Link } from "react-router-dom"

const Components = () => {
  const { user } = useAuth()
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComponents()
  }, [])

  const fetchComponents = async () => {
    try {
      const response = await api.get("/components")
      setComponents(response.data)
    } catch (error) {
      toast.error("Error fetching components")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <h1 style={{ color: "#1f2937", margin: 0 }}>
          <Package size={32} style={{ marginRight: "12px", verticalAlign: "middle" }} />
          Components Inventory
        </h1>

        {user?.role === "manager" && (
          <Link to="/create-component" className="btn btn-primary">
            <Plus size={16} />
            Add Component
          </Link>
        )}
      </div>

      <div className="card">
        {components.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {components.map((component) => (
                <tr key={component._id}>
                  <td style={{ fontWeight: "500" }}>{component.name}</td>
                  <td>{component.description}</td>
                  <td>${component.price.toFixed(2)}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: component.quantity > 10 ? "#10b981" : component.quantity > 0 ? "#f59e0b" : "#ef4444",
                      }}
                    >
                      {component.quantity}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        component.quantity > 10
                          ? "badge-completed"
                          : component.quantity > 0
                            ? "badge-pending"
                            : "badge-in-review"
                      }`}
                    >
                      {component.quantity > 10 ? "In Stock" : component.quantity > 0 ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>{new Date(component.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
            <Package size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
            <p>No components found</p>
            {user?.role === "manager" && (
              <Link to="/create-component" className="btn btn-primary" style={{ marginTop: "16px" }}>
                <Plus size={16} />
                Add First Component
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-3" style={{ marginTop: "32px" }}>
        <div className="card">
          <h3 style={{ margin: "0 0 8px 0", color: "#6b7280" }}>Total Components</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>{components.length}</p>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 8px 0", color: "#6b7280" }}>Total Value</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
            ${components.reduce((total, comp) => total + comp.price * comp.quantity, 0).toFixed(2)}
          </p>
        </div>

        <div className="card">
          <h3 style={{ margin: "0 0 8px 0", color: "#6b7280" }}>Low Stock Items</h3>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#ef4444" }}>
            {components.filter((comp) => comp.quantity <= 10 && comp.quantity > 0).length}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Components
