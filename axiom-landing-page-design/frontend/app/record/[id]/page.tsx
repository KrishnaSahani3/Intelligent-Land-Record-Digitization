"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, User, MapPin, FileText, CheckCircle, AlertTriangle, ShieldCheck, History, Map as MapIcon, ArrowRight } from "lucide-react"

export default function RecordDetail() {
  const params = useParams()
  const id = params?.id as string
  
  const [record, setRecord] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function fetchRecord() {
      try {
        const res = await fetch(`http://localhost:5000/api/records/${id}`)
        const data = await res.json()
        if (data.success) setRecord(data.record)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchRecord()
  }, [id])

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 dark:bg-slate-950">Loading detailed record...</div>
  if (!record) return <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-500 dark:bg-slate-950">Land Record not found.</div>

  const isDisputed = record.status === "Conflict Detected"

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "mutations", label: `Mutations (${record.mutations?.length || 0})` },
    { id: "documents", label: `Documents (${record.documents?.length || 0})` },
    { id: "conflicts", label: `Conflicts (${record.conflicts?.length || 0})` },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/search" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <div>
              <h1 className="text-xl font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2">
                {record.ulpin || record.id.substring(0,8).toUpperCase() + '-UP'}
                {isDisputed ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3" /> Conflict
                  </span>
                ) : record.status === "Verified" ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                    <CheckCircle className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                    Requires Review
                  </span>
                )}
              </h1>
              <p className="text-sm text-slate-500">OCR Confidence: <strong>{record.ocrConfidence ? `${record.ocrConfidence}%` : 'N/A'}</strong> · Last updated: {new Date(record.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/bhunaksha" className="flex items-center gap-2 rounded-md border border-[#0f2c5c] px-3 py-1.5 text-sm font-medium text-[#0f2c5c] hover:bg-slate-50 dark:border-[#7fa8ec] dark:text-[#7fa8ec]">
              <MapIcon className="h-4 w-4" /> View Map
            </a>
            <a href="/dispute" className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" /> Report Dispute
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="flex gap-4 border-b border-slate-200 mb-6 dark:border-slate-800 overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap ${activeTab === t.id ? 'border-[#0f2c5c] text-[#0f2c5c] dark:border-[#7fa8ec] dark:text-[#7fa8ec]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>{t.label}</button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2"><User className="h-5 w-5" /> Owner Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div><div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Owner Name</div><div className="mt-1 font-semibold text-lg">{record.ownerName}</div></div>
                <div><div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Father/Husband</div><div className="mt-1 font-medium">{record.fatherHusbandName || 'N/A'}</div></div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2"><MapPin className="h-5 w-5" /> Location</h2>
              <div className="grid grid-cols-3 gap-4">
                <div><div className="text-xs font-medium text-slate-500 uppercase tracking-wide">District</div><div className="mt-1 font-medium">{record.district}</div></div>
                <div><div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tehsil</div><div className="mt-1 font-medium">{record.tehsil}</div></div>
                <div><div className="text-xs font-medium text-slate-500 uppercase tracking-wide">Village</div><div className="mt-1 font-medium">{record.village}</div></div>
              </div>
            </div>
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-lg font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2"><FileText className="h-5 w-5" /> Land Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Khasra / Plot No", value: record.khasraGataNumber, highlight: true },
                  { label: "Khata No", value: record.khataNumber },
                  { label: "Area", value: record.landArea },
                  { label: "Land Type", value: record.landType || 'N/A' },
                  { label: "ULPIN", value: record.ulpin || 'N/A' },
                  { label: "Registration No", value: record.registrationNumber || 'N/A' },
                  { label: "Registration Date", value: record.registrationDate || 'N/A' },
                  { label: "Mutation No", value: record.mutationNumber || 'N/A' },
                ].map((f, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg dark:bg-slate-800/50">
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{f.label}</div>
                    <div className={`mt-1 font-semibold ${f.highlight ? 'text-xl text-[#0f2c5c] dark:text-[#7fa8ec]' : ''}`}>{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "mutations" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            {record.mutations?.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Previous Owner</th>
                    <th className="px-5 py-3">New Owner</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Reason</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Verified By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {record.mutations.map((m: any) => (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-5 py-3">{m.previousOwner}</td>
                      <td className="px-5 py-3 font-medium">{m.newOwner}</td>
                      <td className="px-5 py-3 text-slate-500">{new Date(m.date).toLocaleDateString()}</td>
                      <td className="px-5 py-3">{m.reason}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${m.status === 'Approved' ? 'bg-green-100 text-green-700' : m.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{m.status}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{m.verifiedBy || 'Pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <History className="h-12 w-12 opacity-20 mb-3" />
                <p>No mutation history found for this record.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "documents" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            {record.documents?.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3">Document Type</th>
                    <th className="px-5 py-3">Upload Date</th>
                    <th className="px-5 py-3">OCR Status</th>
                    <th className="px-5 py-3">Confidence</th>
                    <th className="px-5 py-3">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {record.documents.map((d: any) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-5 py-3 font-medium">{d.type}</td>
                      <td className="px-5 py-3 text-slate-500">{new Date(d.uploadDate).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${d.ocrStatus === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{d.ocrStatus}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`font-mono font-bold ${(d.confidence || 0) >= 80 ? 'text-green-600' : 'text-red-600'}`}>{d.confidence ? `${d.confidence}%` : 'N/A'}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${d.verificationStatus === 'Auto-Verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.verificationStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <FileText className="h-12 w-12 opacity-20 mb-3" />
                <p>No documents associated with this record.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "conflicts" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            {record.conflicts?.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {record.conflicts.map((c: any) => (
                  <div key={c.id} className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${c.severity === 'CRITICAL' ? 'bg-red-200 text-red-900' : c.severity === 'HIGH' ? 'bg-red-100 text-red-800' : c.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>{c.severity}</span>
                      <span className="font-bold text-[#0f2c5c] dark:text-white">{c.type}</span>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${c.status === 'Open' ? 'border-red-200 text-red-700' : c.status === 'Resolved' ? 'border-green-200 text-green-700' : 'border-amber-200 text-amber-700'}`}>{c.status}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{c.description}</p>
                    {c.digitalValue && c.uploadedValue && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="rounded bg-green-50 px-3 py-2 dark:bg-green-900/20">
                          <div className="text-xs text-slate-400">Digital Record</div>
                          <div className="font-semibold text-green-700 dark:text-green-400">{c.digitalValue}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300" />
                        <div className="rounded bg-red-50 px-3 py-2 dark:bg-red-900/20">
                          <div className="text-xs text-slate-400">Uploaded Document</div>
                          <div className="font-semibold text-red-700 dark:text-red-400">{c.uploadedValue}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <CheckCircle className="h-12 w-12 text-green-400 opacity-40 mb-3" />
                <p>No conflicts detected for this record.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
