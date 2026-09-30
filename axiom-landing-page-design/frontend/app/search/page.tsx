"use client"

import { useState } from "react"
import { Search, Map as MapIcon, ArrowLeft, Building2, MapPin, CheckCircle, FileWarning } from "lucide-react"

export default function RecordSearch() {
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")
  const [khasra, setKhasra] = useState("")
  const [owner, setOwner] = useState("")
  const [records, setRecords] = useState<any[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (district) params.append("district", district)
      if (village) params.append("village", village)
      if (khasra) params.append("khasraGataNumber", khasra)
      if (owner) params.append("ownerName", owner)

      const res = await fetch(`http://localhost:5000/api/records?${params.toString()}`)
      const data = await res.json()
      if (data.success) {
        setRecords(data.records)
      }
    } catch (err) {
      console.error(err)
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl items-center gap-4">
          <a href="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
            <ArrowLeft className="h-4 w-4" />
          </a>
          <h1 className="text-xl font-bold text-[#0f2c5c] dark:text-white flex items-center gap-2">
            <Search className="h-5 w-5" /> Land Record Search (Bhulekh)
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 md:grid-cols-12">
          {/* Search Panel */}
          <div className="md:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 h-fit">
            <h2 className="mb-4 text-lg font-semibold text-[#0f2c5c] dark:text-white">Search Parameters</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">District</label>
                <select 
                  value={district} onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-[#0f2c5c] focus:outline-none"
                >
                  <option value="">Any District</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Kanpur">Kanpur</option>
                  <option value="Agra">Agra</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Village</label>
                <input 
                  type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Kakori"
                  className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-[#0f2c5c] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Khasra / Gata Number</label>
                <input 
                  type="text" value={khasra} onChange={(e) => setKhasra(e.target.value)} placeholder="e.g. 145"
                  className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-[#0f2c5c] focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Owner Name</label>
                <input 
                  type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="e.g. Ramesh"
                  className="w-full rounded-md border border-slate-300 p-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white focus:border-[#0f2c5c] focus:outline-none"
                />
              </div>
              <button 
                type="submit" disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f2c5c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0a1e3f] disabled:opacity-70 dark:bg-[#3b6fd4] dark:hover:bg-[#2b55a8]"
              >
                {loading ? "Searching..." : <><Search className="h-4 w-4" /> Search Records</>}
              </button>
            </form>
          </div>

          {/* Results Panel */}
          <div className="md:col-span-8 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 p-5 dark:border-slate-800">
              <h2 className="text-lg font-semibold text-[#0f2c5c] dark:text-white">Search Results</h2>
            </div>
            
            <div className="p-5 overflow-x-auto">
              {!searched ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <Search className="h-12 w-12 opacity-20 mb-3" />
                  <p>Enter parameters to search land records</p>
                </div>
              ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                  <p>No records found matching your criteria</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Owner</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Khasra</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {records.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <a href={`/record/${r.id}`} className="text-[#0f2c5c] hover:underline dark:text-white flex items-center gap-1">
                            {r.ownerName}
                          </a>
                          <div className="text-xs text-slate-500 mt-1">{r.fatherHusbandName || 'N/A'}</div>
                        </td>
                        <td className="px-4 py-3">
                          {r.village}, {r.district}
                        </td>
                        <td className="px-4 py-3 font-mono text-[#0f2c5c] dark:text-[#7fa8ec]">{r.khasraGataNumber}</td>
                        <td className="px-4 py-3">
                          {r.status === "Verified" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="h-3 w-3" /> Verified</span>
                          ) : r.status === "Conflict Detected" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"><FileWarning className="h-3 w-3" /> Conflict</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Requires Review</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <a href="/bhunaksha" className="text-[#0f2c5c] hover:underline dark:text-[#7fa8ec] text-xs font-medium flex items-center gap-1">
                            <MapIcon className="h-3 w-3" /> Map
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
