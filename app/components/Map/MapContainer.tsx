'use client';

import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState } from 'react';
import EventPopup from '../UI/EventPopup'; // Assuming you saved the previous component here
import eventsData from '@/public/testEvents.json';
import { StudentEvent } from '@/types/events';


// Standard Marker Icon Fix
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

// Your blue dot icon
const customIcon = L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color: #3b82f6; border-radius: 50%; width: 15px; height: 15px; border: 2px solid white;'></div>",
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});



interface MapProps {
  isSelectingLocation: boolean;
  onLocationSelected: (latlng: L.LatLng) => void;
}

// Sub-component to handle map interactions
function MapClickHandler({ isSelectingLocation, onLocationSelected, setTempMarker }: any) {
  useMapEvents({
    click(e) {
      if (isSelectingLocation) {
        setTempMarker(e.latlng); // Show a preview marker immediately
        onLocationSelected(e.latlng); // Tell the parent component
      }
    },
  });
  return null;
}

export default function Map({ isSelectingLocation, onLocationSelected }: MapProps) {
  const [tempMarker, setTempMarker] = useState<L.LatLng | null>(null);
  const position: [number, number] = [60.389, 5.332] // Bergen / Campus
  const events = eventsData as StudentEvent[];

  return (
    <LeafletMapContainer 
      center={position} 
      zoom={15} 
      zoomControl={false}
      style={{ height: '100dvh', width: '100%' }}
      className={isSelectingLocation ? "cursor-crosshair" : ""}
    >
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Logic Handler */}
      <MapClickHandler 
        isSelectingLocation={isSelectingLocation} 
        onLocationSelected={onLocationSelected}
        setTempMarker={setTempMarker}
      />

      {/* Pre-existing Demo Markers */}
      {events.map((event) => (
        <Marker key={event.id} position={event.coordinates} icon={customIcon}>
          <Popup>
            <EventPopup 
              event={event} 
              onJoin={(id) => console.log(`Joining event ${id}`)} 
            />
          </Popup>
        </Marker>
      ))}

      {/* Temporary "New Event" Marker */}
      {tempMarker && (
        <Marker position={tempMarker} icon={defaultIcon}>
          <Popup>
             <div className="p-2">
                <p className="font-bold text-indigo-600">New Event Location</p>
                <p className="text-xs text-gray-500">Finish setting up your event details.</p>
             </div>
          </Popup>
        </Marker>
      )}
    </LeafletMapContainer>
  )
}