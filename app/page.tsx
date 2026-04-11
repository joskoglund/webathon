'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import CreateEventBtn from './components/UI/CreateEventBtn';
import CreateEventPopup from './components/UI/CreateEventPopup';
import JoinedEventsSidebar from './components/UI/JoinedEventsSidebar';
import { createEvent } from './components/Event/EventGetter';
import ChatWindow from './components/Chat/ChatWindow';
import { StudentEvent } from '@/types/events';
import NameEntryPopup from './components/UI/EntryPopup';

const DisplayMap = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-100 animate-pulse flex items-center justify-center">Laster kartet...</div>,
});

export default function MapPage() {
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | StudentEvent['category']>('All');
  const [selectedJoinState, setSelectedJoinState] = useState<'All' | 'Joined' | 'Not Joined'>('All');
  const mapRef = useRef<{ refresh: () => Promise<void> } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const toggleSelectionMode = () => {
    setIsSelectingLocation((prev) => !prev);
  };
 
  return (
    
    <div className="relative h-screen w-full">
      <NameEntryPopup />
      <CreateEventBtn 
        onClick={toggleSelectionMode} 
        isSelectingLocation={isSelectingLocation} 
      />
      {/* Pass the state to the map */}
      <DisplayMap 
        ref={mapRef}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}

        isSelectingLocation={isSelectingLocation} 
        searchQuery={searchQuery}
        selectedType={selectedType}
        selectedJoinState={selectedJoinState}
        draftLocation={selectedLocation}
        showDraftMarker={isCreatePopupOpen}
        onDraftLocationChange={(latlng) => setSelectedLocation({ lat: latlng.lat, lng: latlng.lng })}
        onLocationSelected={(latlng) => {
          setIsSelectingLocation(false); // Turn off mode after placement
          setSelectedLocation({ lat: latlng.lat, lng: latlng.lng });
          setIsCreatePopupOpen(true);
        }}
      />

      {selectedLocation && (
        <CreateEventPopup
          open={isCreatePopupOpen}
          latitude={selectedLocation.lat}
          longitude={selectedLocation.lng}
          onRepositionPin={() => {
            setIsCreatePopupOpen(false);
            setIsSelectingLocation(true);
          }}
          onClose={() => {
            setIsCreatePopupOpen(false);
            setSelectedLocation(null);
          }}
          onCreate={async (newEvent) => {
            const savedEvent = await createEvent(newEvent);

            if (!savedEvent) {
              throw new Error('Failed to save event');
            }

            await mapRef.current?.refresh();
            setIsCreatePopupOpen(false);
            setSelectedLocation(null);
          }}
        />
      )}
      {/* See joined events / chats */}
      <JoinedEventsSidebar 
        onSelectedEvent={setSelectedEventId}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedType={selectedType}
        onSelectedTypeChange={setSelectedType}
        selectedJoinState={selectedJoinState}
        onSelectedJoinStateChange={setSelectedJoinState}
      />
      
      {selectedEventId && (
        <ChatWindow 
          eventId={selectedEventId} 
          onClose={() => setSelectedEventId(null)} 
        />
      )}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
    </div>
  );
}