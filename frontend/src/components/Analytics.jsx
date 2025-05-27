import React, { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import api from "../services/api"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    issueTypes: [],
    statusDistribution: [],
    accountTypeDistribution: [],
    monthlyTrends: [],
    completionRate: 0,
    totalCustomers: 0,
    totalServices: 0,
    avgCompletionTime: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const [servicesResponse, usersResponse] = await Promise.all([
        api.get("/service-request"),
        api.get("/users"),
      ])

      const services = servicesResponse.data
      const users = usersResponse.data

      const processedData = processAnalyticsData(services, users)
      setAnalyticsData(processedData)
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const processAnalyticsData = (services, users) => {
    const issueTypeCounts = {}
    services.forEach((service) => {
      issueTypeCounts[service.issue_type] = (issueTypeCounts[service.issue_type] || 0) + 1
    })
    const issueTypes = Object.entries(issueTypeCounts).map(([name, value]) => ({ name, value }))

    const statusCounts = {}
    services.forEach((service) => {
      statusCounts[service.status] = (statusCounts[service.status] || 0) + 1
    })
    const statusDistribution = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    const accountTypeCounts = { Business: 0, Individual: 0 }
    users.forEach((user) => {
      if (user.isLegalEntity === true) {
        accountTypeCounts.Business += 1
      } else {
        accountTypeCounts.Individual += 1
      }
    })
    const accountTypeDistribution = Object.entries(accountTypeCounts).map(([name, value]) => ({ name, value }))

    const monthlyData = {}
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
      monthlyData[monthKey] = { month: monthKey, requests: 0, completed: 0 }
    }

    services.forEach((service) => {
      const serviceDate = new Date(service.createdAt)
      const monthKey = serviceDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].requests += 1
        if (service.status === "completed") {
          monthlyData[monthKey].completed += 1
        }
      }
    })

    const monthlyTrends = Object.values(monthlyData)

    const completedServices = services.filter((s) => s.status === "completed").length
    const completionRate = services.length > 0 ? Math.round((completedServices / services.length) * 100) : 0

    const completedWithTime = services.filter((s) => s.status === "completed" && s.finishedAt)
    let avgCompletionTime = 0
    if (completedWithTime.length > 0) {
      const totalTime = completedWithTime.reduce((sum, service) => {
        const created = new Date(service.createdAt)
        const finished = new Date(service.finishedAt)
        return sum + (finished - created)
      }, 0)
      avgCompletionTime = Math.round(totalTime / completedWithTime.length / (1000 * 60 * 60 * 24)) // Convert to days
    }

    return {
      issueTypes,
      statusDistribution,
      accountTypeDistribution,
      monthlyTrends,
      completionRate,
      totalCustomers: users.filter((u) => u.role === "user").length,
      totalServices: services.length,
      avgCompletionTime,
    }
  }

  const formatDuration = (ms) => {
    if (isNaN(ms)) return "N/A"
    const days = Math.floor(ms / (1000 * 60 * 60 * 24))
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${days}d ${hours}h ${minutes}m`
  }

  if (loading) return <div>Loading analytics data...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="analytics-container" style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "30px", color: "#334155" }}>Analytics Dashboard</h2>

      <div className="overview-metrics" style={{ display: "flex", justifyContent: "space-around", marginBottom: "30px" }}>
        <div className="metric-card" style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h3>Total Customers</h3>
          <p style={{ fontSize: "1.5em", fontWeight: "bold", color: "#4b5563" }}>{analyticsData.totalCustomers}</p>
        </div>
        <div className="metric-card" style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h3>Total Services</h3>
          <p style={{ fontSize: "1.5em", fontWeight: "bold", color: "#4b5563" }}>{analyticsData.totalServices}</p>
        </div>
        <div className="metric-card" style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h3>Completion Rate</h3>
          <p style={{ fontSize: "1.5em", fontWeight: "bold", color: "#4b5563" }}>{analyticsData.completionRate.toFixed(1)}%</p>
        </div>
        <div className="metric-card" style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h3>Avg. Completion Time</h3>
          <p style={{ fontSize: "1.5em", fontWeight: "bold", color: "#4b5563" }}>{formatDuration(analyticsData.avgCompletionTime)}</p>
        </div>
      </div>

      <div className="charts-container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "30px", marginBottom: "40px", padding: "0 10px" }}>
        <div className="card" style={{ marginBottom: "20px", padding: "25px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Issue Types Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.issueTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.issueTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ marginBottom: "20px", padding: "25px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ marginBottom: "20px", padding: "25px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Account Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.accountTypeDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.accountTypeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ marginBottom: "20px", padding: "25px" }}>
          <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Monthly Trends (Service Creation)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="requests" fill="#8884d8" />
              <Bar dataKey="completed" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="insights-section" style={{ boxShadow: "2px 2px 10px 2px rgba(0, 0, 0, 0.1)", padding: "20px", borderRadius: "8px" }}>
        <h3 style={{ marginBottom: "15px", color: "#374151" }}>Key Insights</h3>
        <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px", marginBottom: "10px" }}>
          <strong>Most Common Issue:</strong>{" "}
          {analyticsData.issueTypes.length > 0 ? (
            <span style={{ marginLeft: "8px" }}>{analyticsData.issueTypes[0].name}</span>
          ) : (
            <span>N/A</span>
          )}
        </div>
        <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px", marginBottom: "10px" }}>
          <strong>Current Statuses:</strong>{" "}
          {analyticsData.statusDistribution.length > 0 ? (
            <span style={{ marginLeft: "8px" }}>
              {analyticsData.statusDistribution.map((item, index) => (
                <span key={index}>
                  {item.name}: {item.value}
                  {index < analyticsData.statusDistribution.length - 1 ? ", " : ""}
                </span>
              ))}
            </span>
          ) : (
            <span>N/A</span>
          )}
        </div>
        <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
          <strong>Account Types:</strong>
          {analyticsData.accountTypeDistribution.length > 0 && (
            <span style={{ marginLeft: "8px" }}>
              {analyticsData.accountTypeDistribution.find(item => item.name === "Business")?.value || 0} Business accounts, {" "}
              {analyticsData.accountTypeDistribution.find(item => item.name === "Individual")?.value || 0} Individual accounts
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics