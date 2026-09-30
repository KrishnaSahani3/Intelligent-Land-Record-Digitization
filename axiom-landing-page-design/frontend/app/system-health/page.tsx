"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Activity, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"

export default function SystemHealthPage() {
  const [services, setServices] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('http://localhost:5000/api/system-health')
        const data = await res.json()
        if (data.success) setServices(data.services)
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchHealth()
  }, [])

  const statusIcon = (status: string) => {
    if (status === 'ONLINE') return <CheckCircle className="h-5 w-5 text-green-500" />
    if (status === 'DEMO MODE') return <Info className="h-5 w-5 text-amber-500" />
    return <XCircle className="h-5 w-5 text-red-500" />
  }
  const statusBg = (status: string) => {
    if (status === 'ONLINE') return 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10'
    if (status === 'DEMO MODE') return 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/10'
    return 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <h1 className="text-xl font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2">
              <Activity className="h-5 w-5" /> System Health
            </h1>
          </div>
          <a href="/" className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Log Out</a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f2c5c] dark:text-white">Service Status</h2>
          <p className="text-sm text-slate-500 mt-1">Real-time health check of all connected services and data providers.</p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Checking services...</div>
        ) : services ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(services).map(([key, svc]: [string, any]) => (
              <div key={key} className={`rounded-xl border p-6 shadow-sm ${statusBg(svc.status)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{svc.name}</h3>
                    <p className="mt-1 text-sm font-bold"
                       style={{ color: svc.status === 'ONLINE' ? '#16a34a' : svc.status === 'DEMO MODE' ? '#d97706' : '#dc2626' }}>
                      {svc.status}
                    </p>
                  </div>
                  {statusIcon(svc.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-red-500">Failed to fetch system health.</div>
        )}

        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
          <strong>Note:</strong> Government Data Provider is in DEMO MODE. Synthetic data is being used. Do NOT treat this as official government data.
        </div>
      </main>
    </div>
  )
}
