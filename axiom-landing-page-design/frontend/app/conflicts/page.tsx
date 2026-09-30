"use client"

import { useState, useEffect } from "react"

export default function ConflictCenter() {
  const [conflicts, setConflicts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const fetchConflicts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filterSeverity) params.append("severity", filterSeverity)
      if (filterType) params.append("type", filterType)
      if (filterStatus) params.append("status", filterStatus)

      const res = await fetch(`http://localhost:5000/api/conflicts?${params.toString()}`)
      const data = await res.json()
      if (data.success) setConflicts(data.conflicts)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  useEffect(() => { fetchConflicts() }, [filterSeverity, filterType, filterStatus])

  const getSevStyle = (s: string) => {
    if (s === "CRITICAL") return { backgroundColor: "#fecaca", color: "#991b1b", fontWeight: "bold" }
    if (s === "HIGH") return { backgroundColor: "#fee2e2", color: "#b91c1c" }
    if (s === "MEDIUM") return { backgroundColor: "#fef3c7", color: "#92400e" }
    return { backgroundColor: "#dbeafe", color: "#1e40af" }
  }

  const getStatStyle = (s: string) => {
    if (s === "Open") return { backgroundColor: "#fee2e2", color: "#b91c1c", border: "1px solid #fca5a5" }
    if (s === "Under Review") return { backgroundColor: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }
    if (s === "Resolved") return { backgroundColor: "#dcfce7", color: "#166534", border: "1px solid #86efac" }
    return { backgroundColor: "#f1f5f9", color: "#475569", border: "1px solid #cbd5e1" }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", color: "#1e293b", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <header style={{ borderBottom: "1px solid #e2e8f0", backgroundColor: "#ffffff", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/dashboard" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", border: "1px solid #e2e8f0", borderRadius: "6px", color: "#64748b", textDecoration: "none", fontSize: "16px" }}>←</a>
            <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "#b91c1c", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠ Conflict Detection Center
            </h1>
          </div>
          <a href="/" style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>Log Out</a>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Title + Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f2c5c" }}>Active Conflicts ({conflicts.length})</h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>AI-detected inconsistencies between OCR data, database records, and GIS mapping.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ color: "#94a3b8", fontSize: "14px" }}>🔍</span>
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px 10px", fontSize: "14px", color: "#1e293b", backgroundColor: "#fff" }}>
              <option value="">All Severities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px 10px", fontSize: "14px", color: "#1e293b", backgroundColor: "#fff" }}>
              <option value="">All Types</option>
              <option value="Owner Mismatch">Owner Mismatch</option>
              <option value="Area Mismatch">Area Mismatch</option>
              <option value="Khasra Mismatch">Khasra Mismatch</option>
              <option value="ULPIN Mismatch">ULPIN Mismatch</option>
              <option value="Duplicate Record">Duplicate Record</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "6px 10px", fontSize: "14px", color: "#1e293b", backgroundColor: "#fff" }}>
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
        </div>

        {/* Conflicts List */}
        <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", backgroundColor: "#ffffff", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>Loading conflicts...</div>
          ) : conflicts.length === 0 ? (
            <div style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>
              <p style={{ fontSize: "40px", marginBottom: "12px" }}>✅</p>
              <p>No conflicts match your filters.</p>
            </div>
          ) : (
            conflicts.map((c, i) => (
              <div key={i} style={{ padding: "20px", borderBottom: i < conflicts.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "16px" }}>
                  {/* Left: Conflict Info */}
                  <div style={{ flex: "1", minWidth: "300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <span style={{ ...getSevStyle(c.severity), padding: "2px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: "600" }}>{c.severity}</span>
                      <span style={{ ...getStatStyle(c.status), padding: "2px 8px", borderRadius: "100px", fontSize: "12px", fontWeight: "500" }}>{c.status}</span>
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>{new Date(c.detectedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#0f2c5c", marginBottom: "4px" }}>{c.type}</h3>
                    <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>{c.description}</p>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "8px" }}>
                      Khasra: <strong style={{ color: "#334155" }}>{c.landRecord?.khasraGataNumber}</strong> · 
                      Village: <strong style={{ color: "#334155" }}>{c.landRecord?.village}</strong> · 
                      District: <strong style={{ color: "#334155" }}>{c.landRecord?.district}</strong> · 
                      Owner: <strong style={{ color: "#334155" }}>{c.landRecord?.ownerName}</strong>
                    </div>
                  </div>

                  {/* Right: Comparison Panel */}
                  {c.digitalValue && c.uploadedValue && (
                    <div style={{ width: "280px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#f8fafc", padding: "16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "8px" }}>Comparison</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Digital Record</div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#16a34a" }}>{c.digitalValue}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: "12px", color: "#94a3b8" }}>Uploaded Doc</div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#dc2626" }}>{c.uploadedValue}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Advisory Notice */}
        <div style={{ marginTop: "16px", border: "1px solid #fcd34d", borderRadius: "8px", backgroundColor: "#fefce8", padding: "12px 16px", fontSize: "14px", color: "#92400e" }}>
          <strong>Advisory:</strong> AI does NOT make legal ownership decisions. All conflicts must be reviewed by an authorized Revenue Officer before any action is taken.
        </div>
      </main>
    </div>
  )
}
