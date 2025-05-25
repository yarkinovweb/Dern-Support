"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import toast from "react-hot-toast"
import { Send, Edit, Eye } from "lucide-react"

const Services = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([])
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateForm, setUpdateForm] = useState({
    price: "",
    finishedAt: "",
    components: [],
  })

  useEffect(() => {
    fetchServices()
    if (user?.role === "master") {
      fetchComponents()
    }
  }, [user])

  const fetchServices = async () => {
    try {
      const response = await api.get("/service-request")
      setServices(response.data)
    } catch (error) {
      toast.error("Error fetching services")
    } finally {
      setLoading(false)
    }
  }

  const fetchComponents = async () => {
    try {
      const response = await api.get("/components")
      setComponents(response.data)
    } catch (error) {
      toast.error("Error fetching components")
    }
  }

  const sendToMaster = async (serviceId) => {
    try {
      await api.post(`/service/send/${serviceId}`)
      toast.success("Service sent to master successfully")
      fetchServices()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending to master")
    }
  }

  const handleUpdateService = (service) => {
    setSelectedService(service)
    setUpdateForm({
      price: "",
      finishedAt: "",
      components: [],
    })
    setShowUpdateModal(true)
  }

  const addComponent = () => {
    setUpdateForm({
      ...updateForm,
      components: [...updateForm.components, { componentId: "", quantity: 1 }],
    })
  }

  const updateComponent = (index, field, value) => {
    const newComponents = [...updateForm.components]
    newComponents[index][field] = value
    setUpdateForm({
      ...updateForm,
      components: newComponents,
    })
  }

  const removeComponent = (index) => {
    const newComponents = updateForm.components.filter((_, i) => i !== index)
    setUpdateForm({
      ...updateForm,
      components: newComponents,
    })
  }

  const submitUpdate = async () => {
    try {
      await api.put("/service-request/update", {
        requestId: selectedService._id,
        price: Number.parseFloat(updateForm.price),
        finishedAt: updateForm.finishedAt,
        components: updateForm.components,
      })
      toast.success("Service updated successfully")
      setShowUpdateModal(false)
      fetchServices()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating service")
    }
  }


  const updateStatus = async (id, status) => {
    try {
      await api.put(`/service-request/set-status/${id}`, { status })
      toast.success("Service updated successfully")
      setShowUpdateModal(false)
      fetchServices()
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating service")
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
      <h1 style={{ marginBottom: "32px", color: "#1f2937" }}>Service Requests</h1>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Issue</th>
              <th>Problem</th>
              <th>Owner</th>
              <th>Status</th>
              {/* <th>Master</th> */}
              <th>Price</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td>{service.device_model}</td>
                <td>{service.issue_type}</td>
                <td>{service.problem_area}</td>
                <td>{service.owner.firstName}</td>
                <td>
                  <span className={`badge badge-${service.status}`}>
                    {service.status}
                  </span>
                </td>
                {/* <td>
                  {service.master?.firstname} {service.master?.lastname || "Not assigned"}
                </td> */}
                <td>{service.price ? `$${service.price}` : "Not set"}</td>
                <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {user?.role === "manager" && service.status === "pending" && (
                      <button
                        onClick={() => sendToMaster(service._id)}
                        className="btn btn-primary"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        <Send size={14} />
                        Send to Master
                      </button>
                    )}

                    {
                      service.status === "approved" && user.role === "user" && (
                        <>

                          <button onClick={() => updateStatus(service._id, "in progress")}
                            className="badge-approved ">
                            Approve
                          </button>

                          <button onClick={() => updateStatus(service._id, "rejected")}
                            className="badge-reject">
                            Reject
                          </button>
                        </>
                      )
                    }
                    {
                      service.status === "in progress" && user.role === "master" && (
                        <button onClick={() => updateStatus(service._id, "completed")}
                          className="btn btn-success">
                          Complete
                        </button>
                      )
                    }


                    {user?.role === "master" && service.status === "in_review" && (
                      <button
                        onClick={() => handleUpdateService(service)}
                        className="btn btn-succes"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                      >
                        <Edit size={14} />
                        Update
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedService(service)}
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px", fontSize: "12px" }}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showUpdateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2 style={{ marginBottom: "24px" }}>Update Service</h2>

            <div className="form-group">
              <label className="form-label">Price ($)</label>
              <input
                type="number"
                value={updateForm.price}
                onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Finished Date</label>
              <input
                type="datetime-local"
                value={updateForm.finishedAt}
                onChange={(e) => setUpdateForm({ ...updateForm, finishedAt: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Components Used</label>
              {updateForm.components.map((comp, index) => (
                <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <select
                    value={comp.componentId}
                    onChange={(e) => updateComponent(index, "componentId", e.target.value)}
                    className="form-select"
                    style={{ flex: 2 }}
                  >
                    <option value="">Select Component</option>
                    {components.map((component) => (
                      <option key={component._id} value={component._id}>
                        {component.name} (Available: {component.quantity})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="1"
                    value={comp.quantity}
                    onChange={(e) => updateComponent(index, "quantity", Number.parseInt(e.target.value))}
                    className="form-input"
                    style={{ flex: 1 }}
                    placeholder="Qty"
                  />
                  <button
                    type="button"
                    onClick={() => removeComponent(index)}
                    className="btn btn-danger"
                    style={{ padding: "8px" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addComponent} className="btn btn-secondary" style={{ marginTop: "8px" }}>
                Add Component
              </button>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowUpdateModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={submitUpdate} className="btn btn-success">
                Update Service
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedService && !showUpdateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "80vh",
              overflow: "auto",
            }}
          >
            <h2 style={{ marginBottom: "24px" }}>Service Details</h2>

            <div style={{ marginBottom: "16px" }}>
              <strong>Device Model:</strong> {selectedService.device_model}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Issue Type:</strong> {selectedService.issue_type}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Problem Area:</strong> {selectedService.problem_area}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Description:</strong> {selectedService.description}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Location:</strong> {selectedService.location}
            </div>
            <div style={{ marginBottom: "16px" }}>
              <strong>Status:</strong>
              <span className={`badge badge-${selectedService.status}`} style={{ marginLeft: "8px" }}>
                {selectedService.status}
              </span>
            </div>
            {selectedService.price && (
              <div style={{ marginBottom: "16px" }}>
                <strong>Price:</strong> ${selectedService.price}
              </div>
            )}
            {selectedService.updatedProducts && selectedService.updatedProducts.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <strong>Components Used:</strong>
                <ul style={{ marginTop: "8px" }}>
                  {selectedService.updatedProducts.map((product, index) => (
                    <li key={index}>
                      {product.name} - Quantity: {product.usedQuantity} - Price: ${product.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setSelectedService(null)} className="btn btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Services
