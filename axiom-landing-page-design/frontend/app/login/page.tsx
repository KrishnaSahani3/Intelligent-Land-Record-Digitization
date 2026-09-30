"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Landmark, UserCircle2, ShieldCheck, ArrowRight, Lock, User, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const initialRole = searchParams?.get("role") || "citizen"
  
  const [role, setRole] = useState(initialRole)
  const [username, setUsername] = useState(initialRole === "officer" ? "admin" : "citizen")
  const [password, setPassword] = useState(initialRole === "officer" ? "admin" : "citizen")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (role === "officer") {
      setUsername("admin")
      setPassword("admin")
    } else {
      setUsername("citizen")
      setPassword("citizen")
    }
  }, [role])

  const handleLogin = (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      // Dummy Credential Check
      if (role === "officer") {
        if (username === "admin" && password === "admin") {
          window.location.href = "/dashboard"
        } else {
          setError("Invalid officer credentials. Try admin / admin")
        }
      } else {
        if (username === "citizen" && password === "citizen") {
          window.location.href = "/track"
        } else {
          setError("Invalid citizen credentials. Try citizen / citizen")
        }
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f2c5c] text-white">
               <Landmark className="h-5 w-5" />
             </div>
             <a href="/" className="text-lg font-semibold text-[#0f2c5c] dark:text-white">AXIOM</a>
          </div>
          <a href="/" className="text-sm font-medium hover:underline text-slate-500">← Back to Home</a>
        </div>
      </header>
      
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-800/50">
            <h1 className="text-2xl font-bold text-[#0f2c5c] dark:text-white">Sign In to AXIOM</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter your credentials to access the portal</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Access Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("citizen")}
                    className={`flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition ${
                      role === "citizen" 
                        ? "border-[#0f2c5c] bg-[#0f2c5c] text-white dark:bg-[#3b6fd4] dark:border-[#3b6fd4]" 
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <UserCircle2 className="h-4 w-4" /> Citizen
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("officer")}
                    className={`flex items-center justify-center gap-2 rounded-md border py-2 text-sm font-medium transition ${
                      role === "officer" 
                        ? "border-[#0f2c5c] bg-[#0f2c5c] text-white dark:bg-[#3b6fd4] dark:border-[#3b6fd4]" 
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" /> Officer
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Username / ID</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-sm text-slate-900 focus:border-[#0f2c5c] focus:outline-none focus:ring-1 focus:ring-[#0f2c5c] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder={role === "officer" ? "Enter officer ID (try: admin)" : "Enter citizen ID (try: citizen)"}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 pl-10 text-sm text-slate-900 focus:border-[#0f2c5c] focus:outline-none focus:ring-1 focus:ring-[#0f2c5c] dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f2c5c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0a1e3f] disabled:opacity-70 dark:bg-[#3b6fd4] dark:hover:bg-[#2b55a8]"
              >
                {loading ? "Authenticating..." : "Sign In Securely"} <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
