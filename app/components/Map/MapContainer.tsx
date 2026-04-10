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

const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color: #3b82f6; border-radius: 50%; width: 15px; height: 15px; border: 2px solid white;'></div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export default function Map() {
  const position: [number, number] = [60.389, 5.332] // Bergen / Campus

  return (
    <LeafletMapContainer 
      center={position} 
      zoom={15} 
      zoomControl={false}
      style={{ height: '100dvh', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={position} icon={customIcon}>
        <Popup>
          Her skjer det! <br /> Hackathon hub.
        </Popup>
      </Marker>
    </LeafletMapContainer>
  )
}