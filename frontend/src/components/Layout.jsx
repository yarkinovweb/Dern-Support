"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { LogOut, Home, Wrench, Plus, Package } from "lucide-react"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              Dern-Support
            </Link>

            <nav className="nav">
              <Link to="/dashboard" className={`nav-link ${isActive("/") ? "active" : ""}`}>
                <Home size={16} />
                Dashboard
              </Link>

              <Link to="/services" className={`nav-link ${isActive("/services") ? "active" : ""}`}>
                <Wrench size={16} />
                Services
              </Link>

              <Link to="/create-service" className={`nav-link ${isActive("/create-service") ? "active" : ""}`}>
                <Plus size={16} />
                New Service
              </Link>

              {(user?.role === "manager" || user?.role === "master") && (
                <Link to="/components" className={`nav-link ${isActive("/components") ? "active" : ""}`}>
                  <Package size={16} />
                  Components
                </Link>
              )}
            </nav>

            <div className="user-info">
              <span className={`badge badge-${user?.role}`}>{user?.role}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">{children}</main>
    </div>
  )
}

export default Layout
