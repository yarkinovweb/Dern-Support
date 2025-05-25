"use client"

import { useState, useEffect } from "react"
import { Search, Monitor, Cpu, HardDrive, Wifi, Settings, AlertTriangle, CheckCircle, Book, Filter } from "lucide-react"
import "./KnowledgeBase.css"

const TroubleshootingKnowledgeBase = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [filteredIssues, setFilteredIssues] = useState([])
  const [isMobile, setIsMobile] = useState(false)

  const knowledgeBase = [
    {
      id: 1,
      category: "hardware",
      type: "Computer Won't Start",
      icon: <Monitor size={20} />,
      symptoms: ["No power", "Black screen", "No lights", "No fan noise"],
      diagnosis: [
        "Check power cable connections",
        "Verify power outlet is working",
        "Check if power button is functioning",
        "Inspect for loose internal connections",
      ],
      solutions: [
        {
          step: 1,
          title: "Check Power Supply",
          instructions: [
            "Ensure power cable is firmly connected to both computer and wall outlet",
            "Try a different power outlet",
            "Test with a different power cable if available",
            "Check if power strip/surge protector is working",
          ],
        },
        {
          step: 2,
          title: "Internal Connections",
          instructions: [
            "Turn off and unplug the computer",
            "Open the case (if comfortable doing so)",
            "Check that all internal power cables are securely connected",
            "Reseat RAM modules by removing and reinstalling them",
          ],
        },
        {
          step: 3,
          title: "Hardware Reset",
          instructions: [
            "Remove the power cable",
            "Hold power button for 30 seconds",
            "Reconnect power and try starting",
            "If still not working, contact technical support",
          ],
        },
      ],
      severity: "high",
      estimatedTime: "15-30 minutes",
    },
    {
      id: 2,
      category: "hardware",
      type: "Overheating Issues",
      icon: <Cpu size={20} />,
      symptoms: ["Computer shuts down randomly", "Very hot to touch", "Loud fan noise", "Performance slowdown"],
      diagnosis: [
        "Check system temperature",
        "Listen for unusual fan noises",
        "Feel for excessive heat",
        "Monitor performance during heavy tasks",
      ],
      solutions: [
        {
          step: 1,
          title: "Clean Air Vents",
          instructions: [
            "Turn off and unplug the computer",
            "Use compressed air to blow out dust from vents",
            "Clean keyboard and screen while at it",
            "Ensure vents are not blocked by objects",
          ],
        },
        {
          step: 2,
          title: "Check Environment",
          instructions: [
            "Move computer away from heat sources",
            "Ensure adequate ventilation around the device",
            "Use in air-conditioned environment when possible",
            "Avoid using on soft surfaces that block airflow",
          ],
        },
        {
          step: 3,
          title: "Monitor Usage",
          instructions: [
            "Close unnecessary programs",
            "Avoid running multiple heavy applications simultaneously",
            "Take breaks during intensive tasks",
            "Consider using a laptop cooling pad",
          ],
        },
      ],
      severity: "medium",
      estimatedTime: "10-20 minutes",
    },
    {
      id: 3,
      category: "hardware",
      type: "Hard Drive Issues",
      icon: <HardDrive size={20} />,
      symptoms: ["Slow performance", "Strange clicking noises", "Files disappearing", "Frequent crashes"],
      diagnosis: [
        "Run disk check utility",
        "Listen for unusual hard drive sounds",
        "Check available storage space",
        "Monitor system performance",
      ],
      solutions: [
        {
          step: 1,
          title: "Free Up Space",
          instructions: [
            "Delete unnecessary files and programs",
            "Empty recycle bin/trash",
            "Clear browser cache and downloads",
            "Move large files to external storage",
          ],
        },
        {
          step: 2,
          title: "Run Disk Cleanup",
          instructions: [
            "Windows: Search for 'Disk Cleanup' and run it",
            "Mac: Use 'Storage Management' in About This Mac",
            "Select temporary files and system cache to clean",
            "Restart computer after cleanup",
          ],
        },
        {
          step: 3,
          title: "Check Disk Health",
          instructions: [
            "Windows: Run 'chkdsk' command in Command Prompt",
            "Mac: Use 'Disk Utility' to verify disk",
            "If errors found, backup important data immediately",
            "Consider professional data recovery if drive is failing",
          ],
        },
      ],
      severity: "high",
      estimatedTime: "30-60 minutes",
    },
    // Software Issues
    {
      id: 4,
      category: "software",
      type: "Internet Connection Problems",
      icon: <Wifi size={20} />,
      symptoms: ["No internet access", "Slow browsing", "Intermittent connection", "Can't connect to WiFi"],
      diagnosis: [
        "Check WiFi signal strength",
        "Test connection on other devices",
        "Verify network settings",
        "Check for service provider issues",
      ],
      solutions: [
        {
          step: 1,
          title: "Basic Network Reset",
          instructions: [
            "Turn WiFi off and on again",
            "Restart your router/modem (unplug for 30 seconds)",
            "Forget and reconnect to WiFi network",
            "Check if other devices can connect",
          ],
        },
        {
          step: 2,
          title: "Network Troubleshooting",
          instructions: [
            "Run network troubleshooter (Windows) or Network Diagnostics (Mac)",
            "Update network drivers",
            "Reset network settings to default",
            "Check for interference from other devices",
          ],
        },
        {
          step: 3,
          title: "Advanced Solutions",
          instructions: [
            "Flush DNS cache",
            "Change DNS servers to 8.8.8.8 and 8.8.4.4",
            "Disable VPN if running",
            "Contact internet service provider if issues persist",
          ],
        },
      ],
      severity: "medium",
      estimatedTime: "15-45 minutes",
    },
    {
      id: 5,
      category: "software",
      type: "Application Crashes",
      icon: <Settings size={20} />,
      symptoms: ["Program stops responding", "Error messages", "Automatic program closure", "System freezes"],
      diagnosis: [
        "Identify which applications are crashing",
        "Check for error messages",
        "Note when crashes occur",
        "Check system resources",
      ],
      solutions: [
        {
          step: 1,
          title: "Basic Application Fix",
          instructions: [
            "Close and restart the problematic application",
            "Restart your computer",
            "Check for application updates",
            "Run the application as administrator",
          ],
        },
        {
          step: 2,
          title: "System Updates",
          instructions: [
            "Install all available system updates",
            "Update device drivers",
            "Check for corrupted system files",
            "Scan for malware/viruses",
          ],
        },
        {
          step: 3,
          title: "Application Reinstall",
          instructions: [
            "Uninstall the problematic application",
            "Download latest version from official website",
            "Install with administrator privileges",
            "Restore settings from backup if needed",
          ],
        },
      ],
      severity: "medium",
      estimatedTime: "20-40 minutes",
    },
    {
      id: 6,
      category: "software",
      type: "Slow System Performance",
      icon: <AlertTriangle size={20} />,
      symptoms: ["Long startup times", "Programs take forever to load", "System freezes", "High CPU usage"],
      diagnosis: [
        "Check system resource usage",
        "Identify resource-heavy programs",
        "Check available storage space",
        "Monitor startup programs",
      ],
      solutions: [
        {
          step: 1,
          title: "Optimize Startup",
          instructions: [
            "Disable unnecessary startup programs",
            "Windows: Use Task Manager > Startup tab",
            "Mac: System Preferences > Users & Groups > Login Items",
            "Keep only essential programs in startup",
          ],
        },
        {
          step: 2,
          title: "Clean System",
          instructions: [
            "Run disk cleanup utility",
            "Clear browser cache and temporary files",
            "Uninstall unused programs",
            "Defragment hard drive (Windows only)",
          ],
        },
        {
          step: 3,
          title: "System Maintenance",
          instructions: [
            "Run antivirus full system scan",
            "Check for malware with anti-malware tools",
            "Update all software and drivers",
            "Consider adding more RAM if consistently slow",
          ],
        },
      ],
      severity: "medium",
      estimatedTime: "45-90 minutes",
    },
  ]

  const categories = [
    { id: "all", name: "All Issues", icon: <Book size={16} /> },
    { id: "hardware", name: "Hardware", icon: <Monitor size={16} /> },
    { id: "software", name: "Software", icon: <Settings size={16} /> },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    let filtered = knowledgeBase

    if (selectedCategory !== "all") {
      filtered = filtered.filter((issue) => issue.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (issue) =>
          issue.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          issue.symptoms.some((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredIssues(filtered)
  }, [searchTerm, selectedCategory])

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "severity-high"
      case "medium":
        return "severity-medium"
      case "low":
        return "severity-low"
      default:
        return "severity-medium"
    }
  }

  const handleIssueClick = (issue) => {
    if (isMobile) {
      setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)
    } else {
      setSelectedIssue(issue)
    }
  }

  const DetailsContent = ({ issue }) => (
    <div className="details-card">
      <div className="details-header">
        <div className="details-icon">{issue.icon}</div>
        <h2 className="details-title">{issue.type}</h2>
        <span className={`severity-badge ${getSeverityClass(issue.severity)}`}>{issue.severity}</span>
      </div>

      <div className="section-content">
        <h3 className="section-header">
          <AlertTriangle size={16} />
          Symptoms
        </h3>
        <ul className="symptoms-list">
          {issue.symptoms.map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
        </ul>
      </div>

      <div className="section-content">
        <h3 className="section-header">
          <Search size={16} />
          Diagnosis Steps
        </h3>
        <ol className="diagnosis-list">
          {issue.diagnosis.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="section-content">
        <h3 className="section-header">
          <CheckCircle size={16} />
          Step-by-Step Solutions
        </h3>

        {issue.solutions.map((solution, index) => (
          <div key={index} className="solution-step">
            <h4 className="solution-step-title">
              Step {solution.step}: {solution.title}
            </h4>
            <ul className="solution-instructions">
              {solution.instructions.map((instruction, instrIndex) => (
                <li key={instrIndex}>{instruction}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="warning-box">
        <p className="warning-time">
          <strong>Estimated Time:</strong> {issue.estimatedTime}
        </p>
        <p className="warning-note">
          If these steps don't resolve the issue, please contact technical support for further assistance.
        </p>
      </div>
    </div>
  )

  return (
    <div className="troubleshooting-container">
      <div className="troubleshooting-header">
        <h1 className="troubleshooting-title">
          <Book size={32} />
          IT Troubleshooting Knowledge Base
        </h1>
        <p className="troubleshooting-subtitle">
          Diagnose problems and get step-by-step solutions for common hardware and software issues
        </p>
      </div>

      <div className="search-filter-card">
        <div className="search-filter-container">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by issue type or symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <Filter size={16} className="filter-icon" />
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`content-grid ${selectedIssue && !isMobile ? "split-view" : ""}`}>
        <div className="issues-section">
          <h2 className="issues-header">Issues Found ({filteredIssues.length})</h2>

          <div className="issues-list">
            {filteredIssues.map((issue) => (
              <div key={issue.id}>
                <div
                  className={`issue-card ${selectedIssue?.id === issue.id ? "selected" : ""} ${
                    isMobile && selectedIssue?.id === issue.id ? "mobile-expanded" : ""
                  }`}
                  onClick={() => handleIssueClick(issue)}
                >
                  <div className="issue-content">
                    <div className="issue-icon">{issue.icon}</div>

                    <div className="issue-details">
                      <div className="issue-header">
                        <h3 className="issue-title">{issue.type}</h3>
                        <span className={`severity-badge ${getSeverityClass(issue.severity)}`}>
                          {issue.severity} priority
                        </span>
                      </div>

                      <p className="issue-symptoms">
                        Common symptoms: {issue.symptoms.slice(0, 2).join(", ")}
                        {issue.symptoms.length > 2 && "..."}
                      </p>

                      <div className="issue-meta">
                        <span className="issue-category">{issue.category} Issue</span>
                        <span className="issue-time">Est. time: {issue.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile inline details */}
                  {isMobile && selectedIssue?.id === issue.id && (
                    <div className="mobile-details">
                      <DetailsContent issue={selectedIssue} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredIssues.length === 0 && (
            <div className="empty-state">
              <AlertTriangle size={48} className="empty-icon" />
              <p className="empty-title">No issues found matching your search criteria</p>
              <p className="empty-description">Try different keywords or select a different category</p>
            </div>
          )}
        </div>

        {selectedIssue && !isMobile && (
          <div className="details-panel">
            <DetailsContent issue={selectedIssue} />
          </div>
        )}
      </div>
    </div>
  )
}

export default TroubleshootingKnowledgeBase
