"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import api from "../services/api"
import { TrendingUp, Users, CheckCircle, AlertCircle } from "lucide-react"

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    issueTypes: [],
    statusDistribution: [],
    monthlyTrends: [],
    completionRate: 0,
    totalCustomers: 0,
    totalServices: 0,
    avgCompletionTime: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    try {
      const [servicesResponse, usersResponse] = await Promise.all([api.get("/service-request"), api.get("/users")])

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
      monthlyTrends,
      completionRate,
      totalCustomers: users.filter((u) => u.role === "user").length,
      totalServices: services.length,
      avgCompletionTime,
    }
  }

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"]

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: "32px" }}>
      <h2 style={{ marginBottom: "24px", color: "#1f2937", display: "flex", alignItems: "center", gap: "12px" }}>
        <TrendingUp size={28} />
        Analytics & Insights
      </h2>

      <div className="grid grid-2" style={{ marginBottom: "32px" }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#dbeafe", borderRadius: "8px" }}>
              <Users size={24} color="#3b82f6" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Total Customers</h3>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                {analyticsData.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#d1fae5", borderRadius: "8px" }}>
              <CheckCircle size={24} color="#10b981" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Completion Rate</h3>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                {analyticsData.completionRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#fef3c7", borderRadius: "8px" }}>
              <AlertCircle size={24} color="#f59e0b" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Total Requests</h3>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                {analyticsData.totalServices}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "12px", backgroundColor: "#e0e7ff", borderRadius: "8px" }}>
              <TrendingUp size={24} color="#6366f1" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Avg. Completion Time</h3>
              <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#1f2937" }}>
                {analyticsData.avgCompletionTime} days
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: "24px" }}>
        <div className="card">
          <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Common Issues Distribution</h3>
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

        <div className="card">
          <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Request Status Distribution</h3>
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
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Monthly Request Trends (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analyticsData.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="requests" fill="#3b82f6" name="Total Requests" />
            <Bar dataKey="completed" fill="#10b981" name="Completed Requests" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "20px", color: "#1f2937" }}>Completion Rate Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analyticsData.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                name === "completionRate" ? `${value}%` : value,
                name === "completionRate" ? "Completion Rate" : name,
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey={(data) => (data.requests > 0 ? Math.round((data.completed / data.requests) * 100) : 0)}
              stroke="#ef4444"
              strokeWidth={3}
              name="completionRate"
              dot={{ fill: "#ef4444", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card" style={{ marginTop: "24px" }}>
        <h3 style={{ marginBottom: "16px", color: "#1f2937" }}>Key Insights</h3>
        <div style={{ display: "grid", gap: "12px" }}>
          <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <strong>Most Common Issue:</strong>{" "}
            {analyticsData.issueTypes.length > 0 ? analyticsData.issueTypes[0].name : "N/A"}
            {analyticsData.issueTypes.length > 0 && (
              <span style={{ color: "#6b7280", marginLeft: "8px" }}>
                ({analyticsData.issueTypes[0].value} requests)
              </span>
            )}
          </div>

          <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <strong>Customer Growth:</strong> {analyticsData.totalCustomers} total customers using the platform
          </div>

          <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
            <strong>Service Efficiency:</strong>
            {analyticsData.completionRate >= 80 ? (
              <span style={{ color: "#10b981", marginLeft: "8px" }}>
                Excellent completion rate ({analyticsData.completionRate}%)
              </span>
            ) : analyticsData.completionRate >= 60 ? (
              <span style={{ color: "#f59e0b", marginLeft: "8px" }}>
                Good completion rate ({analyticsData.completionRate}%)
              </span>
            ) : (
              <span style={{ color: "#ef4444", marginLeft: "8px" }}>
                Needs improvement ({analyticsData.completionRate}%)
              </span>
            )}
          </div>

          {analyticsData.avgCompletionTime > 0 && (
            <div style={{ padding: "12px", backgroundColor: "#f3f4f6", borderRadius: "6px" }}>
              <strong>Average Resolution Time:</strong> {analyticsData.avgCompletionTime} days
              {analyticsData.avgCompletionTime <= 3 ? (
                <span style={{ color: "#10b981", marginLeft: "8px" }}>(Fast response)</span>
              ) : analyticsData.avgCompletionTime <= 7 ? (
                <span style={{ color: "#f59e0b", marginLeft: "8px" }}>(Moderate response)</span>
              ) : (
                <span style={{ color: "#ef4444", marginLeft: "8px" }}>(Slow response)</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Analytics
