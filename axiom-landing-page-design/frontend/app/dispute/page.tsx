"use client"

import { useState } from "react"
import { AlertTriangle, Send, Loader2, ArrowRight, CheckCircle, Search, Landmark } from "lucide-react"

export default function DisputePage() {
  const [formData, setFormData] = useState({
    complainantName: '',
    mobileNumber: '',
    district: '',
    tehsil: '',
    village: '',
    khasraGataNumber: '',
    khataNumber: '',
    disputeType: 'Ownership Dispute',
    description: '',
    oppositePartyName: '',
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [complaintId, setComplaintId] = useState<string | null>(null)

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    try {
      const res = await fetch('http://localhost:8000/api/ml/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setAnalysisResult(data.analysis)
      }
    } catch (e) {
      console.error(e)
    }
    setAnalyzing(false)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setComplaintId(data.complaint.complaintId)
      }
    } catch (e) {
      console.error(e)
    }
    setSubmitting(false)
  }

  if (complaintId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-[#1f8a4c] dark:text-[#4ade80]" />
          <h2 className="text-2xl font-bold text-[#0f2c5c] dark:text-white">Complaint Submitted</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Your complaint has been successfully registered in the system.</p>
          <div className="mt-6 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
            <span className="text-xs font-semibold uppercase text-slate-500">Complaint ID</span>
            <div className="text-xl font-bold tracking-wider text-slate-800 dark:text-slate-200">{complaintId}</div>
          </div>
          <p className="mt-4 text-sm text-amber-600 dark:text-amber-400">Please save this ID to track your complaint status.</p>
          <div className="mt-8 flex flex-col gap-3">
            <a href={`/track?id=${complaintId}`} className="flex items-center justify-center gap-2 rounded-md bg-[#0f2c5c] py-3 text-sm font-semibold text-white transition hover:bg-[#0a1e3f]">
              <Search className="h-4 w-4" /> Track Status
            </a>
            <a href="/" className="text-sm font-medium text-slate-500 hover:underline">Return Home</a>
          </div>
        </div>
      </div>
    )
  }

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
            <a href="/" className="text-sm font-medium hover:underline text-slate-500">← Back to Home</a>
            <a href="/track" className="text-sm font-medium hover:underline">Track Complaint</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-[#0f2c5c] dark:text-white">Report Land Dispute</h1>
          <p className="mx-auto mt-2 max-w-2xl text-slate-600 dark:text-slate-400">File a complaint to report ownership conflicts, boundary disputes, or incorrect land records. Our AI-assisted system will route this directly to the appropriate officer.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold">1. Complainant Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input required type="text" name="complainantName" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mobile Number</label>
                <input required type="text" name="mobileNumber" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold">2. Land/Property Details</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">District</label>
                <input required type="text" name="district" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tehsil</label>
                <input required type="text" name="tehsil" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Village</label>
                <input required type="text" name="village" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Khasra/Gata Number</label>
                <input type="text" name="khasraGataNumber" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Khata Number</label>
                <input type="text" name="khataNumber" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Opposite Party Name (Optional)</label>
                <input type="text" name="oppositePartyName" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-semibold">3. Dispute Information</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Type of Dispute</label>
                <select name="disputeType" onChange={handleChange} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                  <option>Ownership Dispute</option>
                  <option>Boundary Dispute</option>
                  <option>Encroachment</option>
                  <option>Mutation Not Updated</option>
                  <option>Duplicate Ownership Claim</option>
                  <option>Area Mismatch</option>
                  <option>Incorrect Land Record</option>
                  <option>Missing Land Record</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Detailed Description</label>
                <textarea required name="description" onChange={handleChange} rows={4} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"></textarea>
              </div>
              
              {!analysisResult ? (
                 <button 
                   type="button" 
                   onClick={handleAnalyze} 
                   disabled={analyzing || !formData.description}
                   className="flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
                 >
                   {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
                   Pre-Analyze Dispute (AI)
                 </button>
              ) : (
                 <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                   <h3 className="font-semibold text-amber-800 dark:text-amber-500">AI Dispute Analysis Summary</h3>
                   <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">{analysisResult.summary}</p>
                   
                   <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                     <div className="rounded bg-white p-2 shadow-sm dark:bg-slate-800">
                       <span className="block text-xs font-semibold text-slate-500">Risk Level</span>
                       <span className={`font-bold ${analysisResult.riskLevel === 'High' ? 'text-red-600' : 'text-amber-600'}`}>{analysisResult.riskLevel}</span>
                     </div>
                     <div className="rounded bg-white p-2 shadow-sm dark:bg-slate-800">
                       <span className="block text-xs font-semibold text-slate-500">Recommended Action</span>
                       <span className="font-medium text-slate-800 dark:text-slate-200">{analysisResult.recommendedAction}</span>
                     </div>
                   </div>
                   
                   <div className="mt-3">
                     <span className="text-xs font-semibold text-slate-500">Detected Issues:</span>
                     <ul className="list-inside list-disc text-sm text-slate-700 dark:text-slate-300">
                       {analysisResult.detectedConflicts.map((c: string, i: number) => <li key={i}>{c}</li>)}
                     </ul>
                   </div>
                 </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="flex items-center gap-2 rounded-md bg-[#0f2c5c] px-6 py-3 font-semibold text-white transition hover:bg-[#0a1e3f] disabled:opacity-70"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              Submit Complaint
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
