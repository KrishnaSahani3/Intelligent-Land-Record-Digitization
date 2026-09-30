"use client"

import { useState, useEffect } from "react"
import { Shield, ArrowLeft, Clock, User, Activity, ArrowRight } from "lucide-react"

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('http://localhost:5000/api/audit-logs')
        const data = await res.json()
        if (data.success) setLogs(data.logs)
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
    fetchLogs()
  }, [])

  const formatDate = (isoString: string) => {
    const d = new Date(isoString)
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <h1 className="text-xl font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2">
              <Shield className="h-5 w-5" /> System Audit Trail
            </h1>
          </div>
          <a href="/" className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Log Out</a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#0f2c5c] dark:text-white">Audit Logs ({logs.length})</h2>
          <p className="text-sm text-slate-500">Immutable record of all system modifications, verifications, and user actions.</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading audit trail...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No audit logs found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log, i) => (
                <div key={log.id || i} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">{log.user}</span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            {log.action}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{log.details}</p>
                        {log.oldValue && log.newValue && (
                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="rounded bg-red-50 px-2 py-1 font-mono text-red-700 dark:bg-red-900/30 dark:text-red-400">{log.oldValue}</span>
                            <ArrowRight className="h-3 w-3 text-slate-400" />
                            <span className="rounded bg-green-50 px-2 py-1 font-mono text-green-700 dark:bg-green-900/30 dark:text-green-400">{log.newValue}</span>
                          </div>
                        )}
                        {log.recordId && (
                          <div className="mt-1 text-xs text-slate-400">Record: {log.recordId}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
