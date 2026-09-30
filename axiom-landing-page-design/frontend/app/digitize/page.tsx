"use client"

import { useState } from "react"
import { UploadCloud, CheckCircle, AlertTriangle, FileText, ArrowRight, Loader2, Landmark } from "lucide-react"

export default function DigitizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [confidenceScores, setConfidenceScores] = useState<any>(null)
  const [overallConfidence, setOverallConfidence] = useState<number | null>(null)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0]
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setExtractedData(null)
      setConfidenceScores(null)
      setOverallConfidence(null)
      setValidationResult(null)
      setSaved(false)
      setVerificationSent(false)
    }
  }

  const handleOcrProcess = async () => {
    if (!file) return
    setProcessing(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (demoMode) formData.append('demo', 'true')

      const res = await fetch('http://localhost:8000/api/ml/ocr', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      if (data.success) {
        const values: any = {}
        const scores: any = {}
        Object.entries(data.fields).forEach(([key, obj]: [string, any]) => {
          values[key] = obj.value
          scores[key] = obj.confidence
        })
        setExtractedData(values)
        setConfidenceScores(scores)
        setOverallConfidence(data.overallConfidence)
      } else {
        alert("OCR failed: " + data.error)
      }
    } catch (error) {
      console.error(error)
      alert("Error processing document.")
    }
    setProcessing(false)
  }

  const handleValidate = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/records/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(extractedData),
      })
      const data = await res.json()
      setValidationResult(data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extractedData,
          status: validationResult?.status || 'Requires Review'
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSaved(true)
      }
    } catch (error) {
      console.error(error)
    }
    setSaving(false)
  }

  const handleSendToVerification = async () => {
    setSaving(true)
    try {
      const res = await fetch('http://localhost:5000/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extractedData,
          status: 'Requires Manual Verification'
        }),
      })
      const data = await res.json()
      if (data.success) {
        setVerificationSent(true)
      }
    } catch (error) {
      console.error(error)
    }
    setSaving(false)
  }

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 80) return "text-amber-500 dark:text-amber-400"
    return "text-red-600 dark:text-red-400"
  }

  const getConfidenceBg = (score: number) => {
    if (score >= 90) return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
    if (score >= 80) return "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
    return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f2c5c] text-white">
               <Landmark className="h-5 w-5" />
             </div>
             <a href="/" className="text-lg font-semibold text-[#0f2c5c] dark:text-white">AXIOM</a>
          </div>
          <div className="flex items-center gap-4">
             <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={demoMode} onChange={(e) => setDemoMode(e.target.checked)} className="rounded border-slate-300" />
                Demo Mode (Fast OCR)
             </label>
             <a href="/dashboard" className="text-sm font-medium hover:underline text-slate-500">Dashboard</a>
             <a href="/" className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">
               Log Out
             </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0f2c5c] dark:text-white">Digitize Land Record</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Upload a scanned land document to extract fields automatically using AI OCR.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column: Upload & Preview */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-semibold">1. Upload Document</h2>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-12 transition-colors hover:border-[#1f8a4c] hover:bg-green-50/50 dark:border-slate-700 dark:bg-slate-800/50">
                <UploadCloud className="mb-3 h-10 w-10 text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Click to upload or drag and drop</span>
                <span className="mt-1 text-xs text-slate-500">PDF, JPG, PNG up to 10MB</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
              </label>
            </div>

            {preview && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Document Preview</h3>
                <div className="relative h-64 w-full overflow-hidden rounded-lg bg-slate-100">
                  <img src={preview} alt="Preview" className="h-full w-full object-contain" />
                </div>
                {!extractedData && (
                  <button 
                    onClick={handleOcrProcess} 
                    disabled={processing}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#0f2c5c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0a1e3f] disabled:opacity-70"
                  >
                    {processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
                    {processing ? "Processing AI OCR..." : "Extract Data with AI OCR"}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Extracted Data */}
          <div className="flex flex-col gap-6">
            {extractedData ? (
              <div className="flex flex-col gap-6">
                
                {/* Overall Confidence Card */}
                {overallConfidence !== null && (
                  <div className={`rounded-xl border p-6 text-center shadow-sm ${getConfidenceBg(overallConfidence)}`}>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">OCR Confidence</h3>
                    <div className={`mt-2 text-5xl font-bold ${getConfidenceColor(overallConfidence)}`}>
                      {overallConfidence}%
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-2 font-medium">
                      {overallConfidence >= 90 ? (
                        <span className="flex items-center gap-1 text-green-700 dark:text-green-400"><CheckCircle className="h-5 w-5" /> HIGH CONFIDENCE</span>
                      ) : overallConfidence >= 80 ? (
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400"><CheckCircle className="h-5 w-5" /> ACCEPTABLE CONFIDENCE</span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-600 dark:text-red-400"><AlertTriangle className="h-5 w-5" /> HUMAN VERIFICATION REQUIRED</span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {overallConfidence >= 80 
                        ? "Record can proceed to automated validation." 
                        : "This document contains low-confidence extracted information and must be reviewed by an authorized verifier before proceeding."}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
                  <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Extracted Fields</h2>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-6 py-3 font-medium">Field</th>
                          <th className="px-6 py-3 font-medium">Extracted Value</th>
                          <th className="px-6 py-3 font-medium">Confidence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {Object.entries(extractedData).map(([key, value]) => (
                          <tr key={key}>
                            <td className="px-6 py-3 font-medium capitalize text-slate-700 dark:text-slate-300">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </td>
                            <td className="px-6 py-3">
                              <input 
                                type="text" 
                                value={value as string} 
                                onChange={(e) => setExtractedData({...extractedData, [key]: e.target.value})}
                                className="w-full rounded-md border-0 bg-transparent py-1 focus:ring-2 focus:ring-[#0f2c5c] dark:focus:ring-slate-700"
                              />
                            </td>
                            <td className="px-6 py-3">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getConfidenceBg(confidenceScores?.[key] || 0)} ${getConfidenceColor(confidenceScores?.[key] || 0)}`}>
                                {confidenceScores?.[key] || 0}%
                              </span>
                              {(confidenceScores?.[key] || 0) < 80 && (
                                <AlertTriangle className="ml-2 inline h-4 w-4 text-red-500" title="Low confidence field" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions Based on Confidence */}
                {overallConfidence !== null && overallConfidence >= 80 ? (
                  !validationResult ? (
                    <button 
                      onClick={handleValidate} 
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
                    >
                      <CheckCircle className="h-4 w-4" /> Validate Record
                    </button>
                  ) : (
                    <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700">
                      <h3 className={`font-semibold ${validationResult.status === 'Conflict Detected' ? 'text-red-600' : 'text-green-600'}`}>
                        Validation Status: {validationResult.status}
                      </h3>
                      {validationResult.conflicts?.length > 0 && (
                        <ul className="mt-2 flex flex-col gap-1 text-sm text-red-600 dark:text-red-400">
                          {validationResult.conflicts.map((c: string, i: number) => (
                            <li key={i} className="flex gap-2"><AlertTriangle className="h-4 w-4 shrink-0" /> {c}</li>
                          ))}
                        </ul>
                      )}
                      
                      {!saved ? (
                         <button 
                           onClick={handleSave} 
                           disabled={saving}
                           className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#1f8a4c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#166c3a]"
                         >
                           {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                           Save Digital Record
                         </button>
                      ) : (
                         <div className="mt-4 rounded bg-green-100 p-3 text-center text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                           Record Saved Successfully!
                         </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                    <h3 className="font-semibold text-red-800 dark:text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" /> Automated Validation Disabled
                    </h3>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-300">Because the OCR confidence is below the 80% threshold, this record must be sent to a human officer for manual verification.</p>
                    
                    {!verificationSent ? (
                      <button 
                        onClick={handleSendToVerification} 
                        disabled={saving}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
                      >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                        Send to Verification Queue
                      </button>
                    ) : (
                      <div className="mt-4 rounded bg-amber-100 p-3 text-center text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        Record sent to Verification Queue!
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
                <FileText className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">No Data Extracted Yet</h3>
                <p className="mt-1 max-w-sm text-sm text-slate-400">Upload a document and run AI extraction to see the fields here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
