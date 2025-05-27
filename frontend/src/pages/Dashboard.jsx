"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { Wrench, Package, Users, Clock } from "lucide-react"
import Analytics from "../components/Analytics"
import KnowledgeBase from "./KnowledgeBase"

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalServices: 0,
    pendingServices: 0,
    completedServices: 0,
    totalComponents: 0,
  })
  const [recentServices, setRecentServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    if (user.role === "manager") {
      fetchUsers()
    }
  }, [])


  const fetchDashboardData = async () => {
    try {
      const [servicesResponse, componentsResponse] = await Promise.all([
        api.get("/service-request"),
        api.get("/components"),
      ])

      const services = servicesResponse.data
      const components = componentsResponse.data

      setStats({
        totalServices: services.length,
        pendingServices: services.filter((s) => s.status === "pending").length,
        completedServices: services.filter((s) => s.status === "completed").length,
        totalComponents: components.length,
      })

      setRecentServices(services.slice(-5).reverse())
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    const response = await api.get("/users")
    setUsers(response.data)

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
      <h1 style={{ marginBottom: "32px", color: "#1f2937" }}>Welcome back!</h1>

      {user.role === 'manager' || user.role === 'master' && <div className="grid grid-2" style={{ marginBottom: "32px" }}>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#dbeafe", borderRadius: "8px" }}>
              <Wrench size={24} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280" }}>Total Services</h3>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#fef3c7", borderRadius: "8px" }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280" }}>Pending Services</h3>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
                {stats.pendingServices}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#d1fae5", borderRadius: "8px" }}>
              <Users size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280" }}>Completed Services</h3>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
                {stats.completedServices}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#e0e7ff", borderRadius: "8px" }}>
              <Package size={24} color="#6366f1" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280" }}>Components</h3>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#1f2937" }}>
                {stats.totalComponents}
              </p>
            </div>
          </div>
        </div>

      </div>}

      {user.role === "master" || user.role === 'manager' && <div className="card">
        <h2 style={{ marginBottom: "16px", color: "#1f2937" }}>Recent Services</h2>
        {recentServices.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Device Model</th>
                <th>Issue Type</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {recentServices.map((service) => (
                <tr key={service._id}>
                  <td>{service.device_model}</td>
                  <td>{service.issue_type}</td>
                  <td>
                    <span className={`badge badge-${service.status}`}>{service.status}</span>
                  </td>
                  <td>{service.owner.firstName}</td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No services found</p>
        )}

      </div>}

      {user.role === "manager" && <div className="card">
        <h2>Users list</h2>
        {users.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Firstname</th>
                <th>Lastname</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Created date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName ?? "Not filled"}</td>
                  <td>{user.lastName ?? "Not filled"}</td>
                  <td>{user.email}</td>
                  <td>{user.address ?? ""}</td>
                  <td>{user.role}{user.isLegalEntity ? " Business" : ""}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
          : (
            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>No services found</p>
          )}
        <Analytics />
      </div>}

      {user.role === 'user' && <div>
        <KnowledgeBase />
      </div>}

    </div>
  )
}

export default Dashboard
