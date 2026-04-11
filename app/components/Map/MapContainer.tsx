'use client';

import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import EventPopup from '../UI/EventPopup'; // Assuming you saved the previous component here
import { StudentEvent } from '@/types/events';
import { getMapEvents, joinEvent, leaveEvent, isEventJoinedLocally } from '../Event/EventGetter';
import { useMap } from 'react-leaflet';

// Standard Marker Icon Fix
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

// Your blue dot icon
const categoryColors: Record<StudentEvent['category'], string> = {
  Sports: '#10b981',
  Volunteer: '#3b82f6',
  Study: '#8b5cf6',
  Social: '#f59e0b',
};

const createCategoryIcon = (category: StudentEvent['category']) =>
  L.divIcon({
    className: 'custom-div-icon',
    html: `<div style='background-color: ${categoryColors[category]}; border-radius: 50%; width: 15px; height: 15px; border: 2px solid white;'></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });


/**
 * Enhanced MapFocuser: 
 * Handles both the camera "FlyTo" and triggering the marker's popup.
 */
function MapController({ 
  event, 
  markerRefs 
}: { 
  event: StudentEvent | null; 
  markerRefs: React.MutableRefObject<Record<number, L.Marker | null>> 
}) {
  const map = useMap();

  useEffect(() => {
    if (!event) return;

    // 1. Move the camera
    map.flyTo([event.latitude, event.longitude], 16, {
      duration: 1.5,
    });

    // 2. Find the marker in our "phonebook" and open its popup
    const marker = markerRefs.current[event.id];
    if (marker) {
      marker.openPopup();
    }
  }, [event, map, markerRefs]);

  return null;  
}

interface MapProps {
  isSelectingLocation: boolean;
  onLocationSelected: (latlng: L.LatLng) => void;
  searchQuery: string;
  selectedType: 'All' | StudentEvent['category'];
  selectedJoinState: 'All' | 'Joined' | 'Not Joined';
  draftLocation?: { lat: number; lng: number } | null;
  showDraftMarker?: boolean;
  onDraftLocationChange?: (latlng: L.LatLng) => void;
  onRefreshEvents?: () => void;

  selectedEventId: number | null;
  setSelectedEventId: (eventId: number | null) => void;
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
    searchQuery,
    selectedType,
    selectedJoinState,
    draftLocation = null,
    showDraftMarker = false,
    onDraftLocationChange,
    selectedEventId,
    setSelectedEventId
  }: Readonly<MapProps>,
  ref
  ) {
  const markerRefs = useRef<Record<number, L.Marker | null>>({});
  const position: [number, number] = [60.389, 5.332] // Bergen / Campus
  const [events, setEvents] = useState<StudentEvent[]>([]);

  const currentEvent = events.find(e => e.id === selectedEventId);

  const refreshEvents = async () => {
    const dbEvents = await getMapEvents();
    setEvents(dbEvents);
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === 'All' || event.category === selectedType;
    const isJoined = isEventJoinedLocally(event.id);
    const matchesJoinState =
      selectedJoinState === 'All' ||
      (selectedJoinState === 'Joined' && isJoined) ||
      (selectedJoinState === 'Not Joined' && !isJoined);

    const safeTitle = (event.title ?? '').toLowerCase();
    const safeDescription = (event.description ?? '').toLowerCase();
    const safeCategory = (event.category ?? '').toLowerCase();
    const matchesSearch =
      normalizedQuery.length === 0 ||
      safeTitle.includes(normalizedQuery) ||
      safeDescription.includes(normalizedQuery) ||
      safeCategory.includes(normalizedQuery);

    return matchesType && matchesJoinState && matchesSearch;
  });

  const handleJoinToggle = async (eventId: number) => {
    if (isEventJoinedLocally(eventId)) {
      return await leaveEvent(eventId);
    }

    return await joinEvent(eventId);
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
      <MapController event={currentEvent} markerRefs={markerRefs}/>
      {filteredEvents.map((event) => (
        <Marker 
          key={event.id} 
          position={[event.latitude, event.longitude]} 
          icon={createCategoryIcon(event.category)}
          // Capture the Marker instance
          ref={(ref) => { markerRefs.current[event.id] = ref; }}
        >
          <Popup>
            <EventPopup
              eventId={event.id}
              onOpenChat={setSelectedEventId}
              onJoin={handleJoinToggle}
              onContentReady={() => markerRefs.current[event.id]?.getPopup()?.update()}
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