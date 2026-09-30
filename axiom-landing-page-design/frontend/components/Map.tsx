"use client"

import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'

export default function Map() {
  const center: [number, number] = [26.8467, 80.9462] // Lucknow roughly

  // Dummy land parcels with coordinates (Bhunaksha)
  const parcels = [
    {
      id: "Khasra 145",
      owner: "Ram Kumar",
      area: "2.5 Acres",
      coords: [
        [26.8467, 80.9462],
        [26.8467, 80.9482],
        [26.8487, 80.9482],
        [26.8487, 80.9462],
      ] as [number, number][]
    },
    {
      id: "Khasra 146",
      owner: "Sunita Devi",
      area: "1.2 Acres",
      coords: [
        [26.8467, 80.9482],
        [26.8467, 80.9502],
        [26.8487, 80.9502],
        [26.8487, 80.9482],
      ] as [number, number][]
    },
    {
      id: "Khasra 147 (Disputed)",
      owner: "State Government",
      area: "5.0 Acres",
      isDisputed: true,
      coords: [
        [26.8487, 80.9462],
        [26.8487, 80.9502],
        [26.8517, 80.9502],
        [26.8517, 80.9462],
      ] as [number, number][]
    }
  ]

  return (
    <MapContainer center={center} zoom={15} style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {parcels.map((parcel, idx) => (
        <Polygon 
          key={idx}
          positions={parcel.coords} 
          pathOptions={{ 
            color: parcel.isDisputed ? 'red' : '#1f8a4c', 
            fillColor: parcel.isDisputed ? '#fee2e2' : '#dcfce7',
            fillOpacity: 0.5 
          }}
        >
          <Popup>
            <div className="font-sans">
              <strong className="text-lg text-[#0f2c5c]">{parcel.id}</strong><br/>
              <span className="text-sm font-medium">Owner:</span> {parcel.owner}<br/>
              <span className="text-sm font-medium">Area:</span> {parcel.area}<br/>
              <span className="text-sm font-medium">Coordinates:</span> {parcel.coords[0][0].toFixed(5)}, {parcel.coords[0][1].toFixed(5)}<br/>
              {parcel.isDisputed && <span className="text-sm font-bold text-red-600">⚠ Disputed Land</span>}
            </div>
          </Popup>
        </Polygon>
      ))}
    </MapContainer>
  )
}
