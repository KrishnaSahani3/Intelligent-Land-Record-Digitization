"use client"

import { useState, useEffect } from "react"
import { Bell, ArrowLeft, AlertTriangle, Info, CheckCircle, AlertOctagon } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('http://localhost:5000/api/notifications')
        const data = await res.json()
        if (data.success) {
          setNotifications(data.notifications)
          setUnreadCount(data.unreadCount)
        }
      } catch (err) { console.error(err) }
      setLoading(false)
    }
    fetchNotifications()
  }, [])

  const markRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: 'PATCH' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
      setUnreadCount(Math.max(0, unreadCount - 1))
    } catch (err) { console.error(err) }
  }

  const typeIcon: Record<string, any> = {
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    alert: <AlertOctagon className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
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
              <Bell className="h-5 w-5" /> Notifications
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{unreadCount}</span>
              )}
            </h1>
          </div>
          <a href="/" className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Log Out</a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-6">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No notifications.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {notifications.map((n) => (
                <div key={n.id} className={`flex items-start gap-4 px-6 py-4 transition-colors ${n.read ? 'opacity-60' : 'bg-blue-50/50 dark:bg-blue-900/10'}`}>
                  <div className="mt-0.5">{typeIcon[n.type] || typeIcon.info}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">{n.title}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                    <div className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="shrink-0 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                      Mark read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
