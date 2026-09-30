"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Search, MapPin, Calendar, User, FileText, CheckCircle2, Circle, AlertCircle, Landmark } from "lucide-react"

function TrackContent() {
  const searchParams = useSearchParams()
  const initialId = searchParams?.get("id") || ""
  
  const [complaintId, setComplaintId] = useState(initialId)
  const [loading, setLoading] = useState(false)
  const [complaint, setComplaint] = useState<any>(null)
  const [error, setError] = useState("")

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!complaintId.trim()) return

    setLoading(true)
    setError("")
    try {
      const res = await fetch(`http://localhost:5000/api/complaints?complaintId=${complaintId}`)
      const data = await res.json()
      if (data.success && data.complaint) {
        setComplaint(data.complaint)
      } else {
        setError("Complaint not found. Please check the ID.")
        setComplaint(null)
      }
    } catch (err) {
      setError("Failed to fetch complaint status.")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (initialId) {
      handleSearch()
    }
  }, [initialId])

  const stages = [
    "Submitted",
    "Document Verification",
    "Assigned to Officer",
    "Under Investigation",
    "Field Verification",
    "Resolution Proposed",
    "Resolved"
  ]

  const getCurrentStageIndex = () => {
    if (!complaint) return -1
    const idx = stages.indexOf(complaint.status)
    // If it's a special status like Rejected, we handle it separately
    return idx >= 0 ? idx : stages.length
  }

  const currentStageIdx = getCurrentStageIndex()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f2c5c] text-white">
               <Landmark className="h-5 w-5" />
             </div>
             <a href="/" className="text-lg font-semibold text-[#0f2c5c] dark:text-white">AXIOM</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/dispute" className="text-sm font-medium hover:underline text-slate-500 mr-2">Report Dispute</a>
            <a href="/" className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
              Log Out
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#0f2c5c] dark:text-white">Track Complaint Status</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Enter your Complaint ID to check the current progress of your dispute.</p>
        </div>

        <form onSubmit={handleSearch} className="mb-10 flex gap-3">
          <input 
            type="text" 
            placeholder="e.g. LRD-2026-000001" 
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
            className="w-full flex-1 rounded-lg border border-slate-300 px-4 py-3 text-lg focus:border-[#0f2c5c] focus:outline-none focus:ring-1 focus:ring-[#0f2c5c] dark:border-slate-700 dark:bg-slate-900"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#0f2c5c] px-6 py-3 font-semibold text-white transition hover:bg-[#0a1e3f] disabled:opacity-70"
          >
            <Search className="h-5 w-5" /> Search
          </button>
        </form>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-center text-sm font-medium text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {complaint && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Complaint ID</span>
                  <h2 className="text-2xl font-bold text-[#0f2c5c] dark:text-white">{complaint.complaintId}</h2>
                </div>
                <div className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {complaint.status}
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><Calendar className="h-4 w-4" /> Date</div>
                  <div className="mt-1 font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><User className="h-4 w-4" /> Complainant</div>
                  <div className="mt-1 font-medium">{complaint.complainantName}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="h-4 w-4" /> Location</div>
                  <div className="mt-1 font-medium">{complaint.village}, {complaint.tehsil}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><FileText className="h-4 w-4" /> Type</div>
                  <div className="mt-1 font-medium">{complaint.disputeType}</div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative border-l border-slate-200 ml-3 mt-6 space-y-6 dark:border-slate-700">
                {stages.map((stage, idx) => {
                  const isCompleted = idx < currentStageIdx;
                  const isCurrent = idx === currentStageIdx;
                  
                  return (
                    <div key={stage} className="relative pl-6">
                      <span className="absolute -left-3 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-slate-900">
                        {isCompleted ? (
                           <CheckCircle2 className="h-6 w-6 text-[#1f8a4c] dark:text-[#4ade80]" />
                        ) : isCurrent ? (
                           <div className="h-4 w-4 rounded-full bg-blue-600 ring-4 ring-blue-100 dark:bg-blue-500 dark:ring-blue-900/50" />
                        ) : (
                           <Circle className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                        )}
                      </span>
                      <h3 className={`font-semibold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                        {stage}
                      </h3>
                      {isCurrent && (
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                          {stage === "Submitted" && "Your complaint has been received and is awaiting initial verification."}
                          {stage === "Document Verification" && "Officers are verifying the uploaded documents against digital records."}
                          {stage === "Assigned to Officer" && `Assigned to: ${complaint.assignedOfficer || 'Pending Assignment'}`}
                          {stage === "Under Investigation" && "The case is currently under active investigation by the assigned officer."}
                          {stage === "Field Verification" && "A physical verification or measurement is being scheduled/conducted."}
                          {stage === "Resolution Proposed" && "A resolution has been proposed and is awaiting final approval."}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              {complaint.status === "Rejected" && (
                 <div className="mt-6 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                   <h3 className="flex items-center gap-2 font-semibold text-red-700 dark:text-red-400">
                     <AlertCircle className="h-5 w-5" /> Complaint Rejected
                   </h3>
                   <p className="mt-1 text-sm text-red-600 dark:text-red-300">
                     This complaint was reviewed and rejected. Please contact your local Tehsildar office for more details.
                   </p>
                 </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TrackContent />
    </Suspense>
  )
}
