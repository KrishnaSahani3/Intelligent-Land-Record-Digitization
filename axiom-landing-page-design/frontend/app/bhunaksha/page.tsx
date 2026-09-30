"use client"

import dynamic from 'next/dynamic'
import { Landmark, Map as MapIcon, Search, Layers, Crosshair } from 'lucide-react'

import { useState } from 'react'

// Dynamic import with ssr: false is REQUIRED for react-leaflet in Next.js
const MapWithNoSSR = dynamic(() => import('../../components/Map'), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800"><p className="text-slate-500">Loading Map Engine...</p></div>
})

export default function BhunakshaPage() {
  const [khasraQuery, setKhasraQuery] = useState('');

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 flex-none">
        <div className="mx-auto flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0f2c5c] text-white">
               <Landmark className="h-5 w-5" />
             </div>
             <a href="/" className="text-lg font-semibold text-[#0f2c5c] dark:text-white">AXIOM Bhunaksha (GIS)</a>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
             <a href="/" className="text-sm font-medium hover:underline text-slate-500">← Back to Home</a>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex-none border-r border-slate-200 bg-white p-6 overflow-y-auto dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-bold flex items-center gap-2"><MapIcon className="h-5 w-5"/> Plot Search</h2>
          
          <div className="mb-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">District</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option>Agra</option>
                <option>Aligarh</option>
                <option>Ayodhya</option>
                <option>Bareilly</option>
                <option>Ghaziabad</option>
                <option>Gorakhpur</option>
                <option>Kanpur</option>
                <option selected>Lucknow</option>
                <option>Meerut</option>
                <option>Prayagraj</option>
                <option>Varanasi</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tehsil</label>
              <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">
                <option>Sadar</option>
                <option>BKT</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Khasra / Plot No.</label>
              <input 
                type="text" 
                placeholder="e.g. 145" 
                value={khasraQuery}
                onChange={(e) => setKhasraQuery(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800" 
              />
            </div>
            <button 
              onClick={() => alert(`Locating Khasra / Plot No: ${khasraQuery || '145'} on the map...`)}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0f2c5c] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a1e3f]"
            >
              <Search className="h-4 w-4" /> Locate on Map
            </button>
          </div>

          <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
             <h3 className="mb-3 text-sm font-semibold flex items-center gap-2"><Layers className="h-4 w-4"/> Map Layers</h3>
             <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
               <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Cadastral Boundaries
             </label>
             <label className="flex items-center gap-2 text-sm mb-2 cursor-pointer">
               <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Satellite View
             </label>
             <label className="flex items-center gap-2 text-sm cursor-pointer">
               <input type="checkbox" defaultChecked className="rounded border-slate-300" /> Highlight Disputed Land
             </label>
          </div>
          
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-500">
            <strong>Feature Highlight:</strong> This GIS module integrates directly with Bhulekh records. You can visually inspect land coordinates and see instantly if a parcel is disputed (marked in red).
          </div>
        </aside>

        {/* Map Area */}
        <section className="relative flex-1 bg-slate-200 dark:bg-slate-800 p-4">
           <div className="absolute top-6 left-6 z-10 rounded-md bg-white p-3 shadow-md dark:bg-slate-900 text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
             <Crosshair className="h-4 w-4 text-blue-600"/> Lat: 26.8487 / Lng: 80.9482
           </div>
           <MapWithNoSSR />
        </section>
      </main>
    </div>
  )
}
