"use client"

import { Link } from "react-router-dom"
import "./Landing.css"

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <div className="nav">
            <div className="logo">
              <span className="logo-icon">🔧</span>
              Dern-Support
            </div>
            <div className="nav-links">
              <a href="#services">Services</a>
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-bg"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">🚀 Professional IT Support</div>
            <h1>
              Expert Computer Repair & <span className="highlight">Technical Support</span>
            </h1>
            <p>
              Fast, reliable IT solutions for businesses and individuals. From on-site support to comprehensive repairs,
              we keep your technology running smoothly.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
                <span className="btn-arrow">→</span>
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
              <div className="stat">
                <div className="stat-number">24hr</div>
                <div className="stat-label">Avg Response</div>
              </div>
              <div className="stat">
                <div className="stat-number">98%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Services</span>
            <h2 className="section-title">Complete IT Support Solutions</h2>
            <p className="section-subtitle">Professional services tailored to your needs</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon business">💼</div>
              <h3>Business Support</h3>
              <p>
                On-site technical support for businesses. Minimize downtime, operations
                running smoothly.
              </p>
              <ul>
                <li>Network troubleshooting</li>
                <li>Hardware repairs</li>
                <li>Software installation</li>
                <li>System maintenance</li>
              </ul>
              <div className="service-price">From $99/visit</div>
            </div>

            <div className="service-card featured">
              <div className="popular-badge">Most Popular</div>
              <div className="service-icon individual">����️</div>
              <h3>Individual Repairs</h3>
              <p>
                Drop-off or courier service for personal computer repairs. Expert diagnosis and transparent pricing.
              </p>
              <ul>
                <li>Virus removal</li>
                <li>Data recovery</li>
                <li>Hardware upgrades</li>
                <li>Performance optimization</li>
              </ul>
              <div className="service-price">From $49/repair</div>
            </div>

            <div className="service-card">
              <div className="service-icon knowledge">📚</div>
              <h3>Knowledge Base</h3>
              <p>Self-service diagnostic tools and step-by-step guides to help you resolve common issues quickly.</p>
              <ul>
                <li>Problem diagnosis</li>
                <li>DIY repair guides</li>
                <li>Troubleshooting tips</li>
                <li>Video tutorials</li>
              </ul>
              <div className="service-price">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-content">
            <div className="features-text">
              <span className="section-badge" id="about">Why Choose Us</span>
              <h2>Built for Modern IT Challenges</h2>
              <p>
                Our platform combines expert technical support with cutting-edge tools to deliver exceptional service
                experiences.
              </p>

              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <div>
                    <h4>Lightning Fast Response</h4>
                    <p>Same-day service for businesses, 24-hour turnaround for individuals</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💰</div>
                  <div>
                    <h4>Transparent Pricing</h4>
                    <p>Detailed quotes before work begins. No hidden fees or surprises</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">👨‍💻</div>
                  <div>
                    <h4>Expert Technicians</h4>
                    <p>Certified professionals with years of hands-on experience</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="features-visual">
              <div className="dashboard-preview">
                <div className="dashboard-header">
                  <div className="dashboard-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="dashboard-title">Dern-Support Dashboard</div>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-stats">
                    <div className="dash-stat">
                      <div className="dash-number">24</div>
                      <div className="dash-label">Active Jobs</div>
                    </div>
                    <div className="dash-stat">
                      <div className="dash-number">98%</div>
                      <div className="dash-label">Success Rate</div>
                    </div>
                  </div>
                  <div className="dashboard-chart">
                    <div className="chart-bar" style={{ height: "60%" }}></div>
                    <div className="chart-bar" style={{ height: "80%" }}></div>
                    <div className="chart-bar" style={{ height: "45%" }}></div>
                    <div className="chart-bar" style={{ height: "90%" }}></div>
                    <div className="chart-bar" style={{ height: "70%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Professional IT Support?</h2>
            <p>Join hundreds of satisfied customers who trust Dern-Support for their technology needs</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started Today
                <span className="btn-arrow">→</span>
              </Link>
              <a href="tel:+1234567890" className="btn btn-outline btn-large">
                📞 Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Get In Touch</span>
            <h2 className="section-title">Contact Us</h2>
          </div>
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <h3>Call Us</h3>
              <p>+1 (234) 567-8900</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <h3>Email Us</h3>
              <p>support@dern-support.com</p>
            </div>
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h3>Visit Us</h3>
              <p>
                123 Tech Street
                <br />
                Digital City, DC 12345
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <span className="logo-icon">🔧</span>
                Dern-Support
              </div>
              <p>Professional IT support for businesses and individuals. Fast, reliable, and affordable solutions.</p>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="#services">Business Support</a>
                </li>
                <li>
                  <a href="#services">Individual Repairs</a>
                </li>
                <li>
                  <a href="#services">Knowledge Base</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <Link to="/login">Customer Portal</Link>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <Link to="/register">Create Account</Link>
                </li>
                <li>
                  <Link to="/login">Sign In</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Dern-Support. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
