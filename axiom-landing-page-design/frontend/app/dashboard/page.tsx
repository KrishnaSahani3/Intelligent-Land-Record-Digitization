"use client"

import { useState, useEffect } from "react"
import { Users, FileText, AlertTriangle, CheckCircle, Search, Filter, Landmark } from "lucide-react"

export default function DashboardPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("All")

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/complaints').then(res => res.json()),
      fetch('http://localhost:5000/api/records').then(res => res.json())
    ]).then(([compData, recData]) => {
      if (compData.success) setComplaints(compData.complaints)
      if (recData.success) setRecords(recData.records)
      setLoading(false)
    }).catch(console.error)
  }, [])

  const updateComplaintStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setComplaints(complaints.map(c => c.id === id ? { ...c, status } : c))
    } catch (e) {
      console.error(e)
    }
  }

  const filteredComplaints = filterStatus === "All" ? complaints : complaints.filter(c => c.status === filterStatus)

  const stats = {
    totalRecords: records.length,
    conflicts: records.filter(r => r.status === 'Conflict Detected').length,
    activeComplaints: complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length,
    resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f2c5c] text-white">
               <Landmark className="h-5 w-5" />
             </div>
             <a href="/" className="text-lg font-semibold text-[#0f2c5c] dark:text-white">AXIOM Officer Portal</a>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
             <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-green-500"></div>
               Officer Online
             </div>
             <a href="/" className="ml-4 flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
               Log Out
             </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold text-[#0f2c5c] dark:text-white">Overview Dashboard</h1>
          <div className="flex flex-wrap items-center gap-3">
            <a href="/search" className="flex items-center gap-2 rounded-md bg-[#0f2c5c] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0a1e3f] dark:bg-[#3b6fd4] dark:hover:bg-[#2b55a8]">
              Search Records
            </a>
            <a href="/conflicts" className="flex items-center gap-2 rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:bg-red-100 border border-red-200 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
              Conflict Center
            </a>
            <a href="/notifications" className="flex items-center gap-2 rounded-md bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-100 border border-blue-200 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">
              Notifications
            </a>
            <a href="/audit" className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Audit Logs
            </a>
            <a href="/digitize" className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              Upload Document
            </a>
            <a href="/system-health" className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
              System Health
            </a>
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-slate-500"><FileText className="h-5 w-5" /> Total Digitized</div>
            <div className="mt-2 text-3xl font-bold">{stats.totalRecords}</div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm dark:border-red-900/30 dark:bg-red-900/10">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400"><AlertTriangle className="h-5 w-5" /> Conflicts Detected</div>
            <div className="mt-2 text-3xl font-bold text-red-700 dark:text-red-400">{stats.conflicts}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/30 dark:bg-amber-900/10">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400"><Users className="h-5 w-5" /> Active Complaints</div>
            <div className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-400">{stats.activeComplaints}</div>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm dark:border-green-900/30 dark:bg-green-900/10">
            <div className="flex items-center gap-3 text-green-600 dark:text-green-400"><CheckCircle className="h-5 w-5" /> Resolved Cases</div>
            <div className="mt-2 text-3xl font-bold text-green-700 dark:text-green-400">{stats.resolvedComplaints}</div>
          </div>
        </div>

        {/* Recent Land Records */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold" style={{ color: "#0f2c5c" }}>Recent Land Records</h2>
            <a href="/search" style={{ color: "#0f2c5c", fontSize: "14px", fontWeight: "600" }}>View All →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: "#f8fafc", color: "#64748b" }}>
                <tr>
                  <th className="px-5 py-3 font-medium">Owner</th>
                  <th className="px-5 py-3 font-medium">Khasra</th>
                  <th className="px-5 py-3 font-medium">Village</th>
                  <th className="px-5 py-3 font-medium">District</th>
                  <th className="px-5 py-3 font-medium">Area</th>
                  <th className="px-5 py-3 font-medium">OCR %</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={8} className="p-5 text-center" style={{ color: "#64748b" }}>Loading...</td></tr>
                ) : records.length === 0 ? (
                  <tr><td colSpan={8} className="p-5 text-center" style={{ color: "#64748b" }}>No records found.</td></tr>
                ) : (
                  records.slice(0, 10).map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4" style={{ fontWeight: "600", color: "#0f2c5c" }}>
                        {r.ownerName}
                        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{r.fatherHusbandName || ''}</div>
                      </td>
                      <td className="px-5 py-4" style={{ fontFamily: "monospace", color: "#0f2c5c", fontWeight: "600" }}>{r.khasraGataNumber}</td>
                      <td className="px-5 py-4">{r.village}</td>
                      <td className="px-5 py-4">{r.district}</td>
                      <td className="px-5 py-4">{r.landArea}</td>
                      <td className="px-5 py-4">
                        {r.ocrConfidence ? (
                          <span style={{ fontWeight: "700", color: r.ocrConfidence >= 80 ? "#16a34a" : "#dc2626" }}>{r.ocrConfidence}%</span>
                        ) : (
                          <span style={{ color: "#94a3b8" }}>—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span style={{
                          display: "inline-flex", padding: "2px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: "600",
                          backgroundColor: r.status === "Verified" ? "#dcfce7" : r.status === "Conflict Detected" ? "#fee2e2" : "#fef3c7",
                          color: r.status === "Verified" ? "#166534" : r.status === "Conflict Detected" ? "#991b1b" : "#92400e",
                        }}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <a href={`/record/${r.id}`} style={{ color: "#0f2c5c", fontWeight: "600", fontSize: "13px" }}>View Details →</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="text-lg font-semibold" style={{ color: "#0f2c5c" }}>Recent Complaints</h2>
            <div className="flex items-center gap-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "4px 10px", fontSize: "14px", color: "#1e293b" }}
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead style={{ backgroundColor: "#f8fafc", color: "#64748b" }}>
                <tr>
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={6} className="p-5 text-center" style={{ color: "#64748b" }}>Loading...</td></tr>
                ) : filteredComplaints.length === 0 ? (
                  <tr><td colSpan={6} className="p-5 text-center" style={{ color: "#64748b" }}>No complaints found.</td></tr>
                ) : (
                  filteredComplaints.map(c => (
                    <tr key={c.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-4" style={{ fontWeight: "600", color: "#0f2c5c" }}>{c.complaintId}</td>
                      <td className="px-5 py-4">{c.disputeType}</td>
                      <td className="px-5 py-4">{c.village}, {c.district}</td>
                      <td className="px-5 py-4">
                        <span style={{
                          display: "inline-flex", padding: "2px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: "600",
                          backgroundColor: c.priority === 'High' || c.priority === 'Critical' ? '#fee2e2' : '#f1f5f9',
                          color: c.priority === 'High' || c.priority === 'Critical' ? '#991b1b' : '#475569',
                        }}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select 
                          value={c.status}
                          onChange={(e) => updateComplaintStatus(c.id, e.target.value)}
                          style={{ border: "1px solid #cbd5e1", borderRadius: "6px", padding: "2px 6px", fontSize: "12px", color: "#1e293b" }}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Document Verification">Document Verification</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Under Investigation">Under Investigation</option>
                          <option value="Field Verification">Field Verification</option>
                          <option value="Resolution Proposed">Resolution Proposed</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <a href={`/track?id=${c.complaintId}`} style={{ color: "#0f2c5c", fontWeight: "600", fontSize: "13px" }}>View →</a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
