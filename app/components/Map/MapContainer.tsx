'use client';

import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import EventPopup from '../UI/EventPopup'; // Assuming you saved the previous component here
import { StudentEvent } from '@/types/events';
import { getMapEvents } from '../Event/EventGetter';

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
  draftLocation?: { lat: number; lng: number } | null;
  showDraftMarker?: boolean;
  onDraftLocationChange?: (latlng: L.LatLng) => void;
  onRefreshEvents?: () => void;
  onOpenChat: (event: StudentEvent) => void;
  events: StudentEvent[];
}

// Sub-component to handle map interactions
function MapClickHandler({ isSelectingLocation, onLocationSelected }: { isSelectingLocation: boolean; onLocationSelected: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      if (isSelectingLocation) {
        onLocationSelected(e.latlng); // Tell the parent component
      }
    },
  });
  return null;
}

export default forwardRef(function CampusMap(
  {
    isSelectingLocation,
    onLocationSelected,
    draftLocation = null,
    showDraftMarker = false,
    onDraftLocationChange,
    onOpenChat
  }: Readonly<MapProps>,
  ref
  ) {
  const popupRefs = useRef<Record<number, L.Popup | null>>({});
  const position: [number, number] = [60.389, 5.332] // Bergen / Campus
  const [events, setEvents] = useState<StudentEvent[]>([]);


  const refreshEvents = async () => {
    const dbEvents = await getMapEvents();
    setEvents(dbEvents);
  };

  useImperativeHandle(ref, () => ({
    refresh: refreshEvents,
  }), []);

  useEffect(() => {
    refreshEvents();
  }, []);

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
      />

      {/* Pre-existing Demo Markers */}
      {events.map((event) => (
        <Marker key={event.id} position={[event.latitude, event.longitude]} icon={customIcon}>
          <Popup ref={(ref) => { popupRefs.current[event.id] = ref; }}>
            <EventPopup
              eventId={event.id}
              onOpenChat={onOpenChat}
              onJoin={(id) => console.log(`Joining event ${id}`)}
              onContentReady={() => popupRefs.current[event.id]?.update()}
            />
          </Popup>
        </Marker>
      ))}

      {/* Temporary "New Event" Marker */}
      {showDraftMarker && draftLocation && (
        <Marker
          position={[draftLocation.lat, draftLocation.lng]}
          icon={defaultIcon}
          draggable
          eventHandlers={{
            dragend: (event) => {
              const marker = event.target as L.Marker;
              onDraftLocationChange?.(marker.getLatLng());
            },
          }}
        >
          <Popup>
             <div className="p-2">
                <p className="font-bold text-indigo-600">New Event Location</p>
                <p className="text-xs text-gray-500">Drag this pin to adjust the event location.</p>
             </div>
          </Popup>
        </Marker>
      )}
    </LeafletMapContainer>
  );
});