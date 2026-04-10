'use client';

import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for manglende ikoner i Next.js/Leaflet
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

export default function Map() {
  const position: [number, number] = [60.389, 5.332] // Bergen / Campus

  return (
    <LeafletMapContainer 
      center={position} 
      zoom={15} 
      style={{ height: '1000px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>
          Her skjer det! <br /> Hackathon hub.
        </Popup>
      </Marker>
    </LeafletMapContainer>
  )
}