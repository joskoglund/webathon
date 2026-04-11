'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import CreateEventBtn from './components/UI/CreateEventBtn';
import JoinedEventsSidebar from './components/UI/JoinedEventsSidebar';
import ChatWindow from './components/Chat/ChatWindow';
import { StudentEvent } from '@/types/events';
import { getMapEvents } from './components/Event/EventGetter';

const DisplayMap = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <div className="h-screen w-full bg-slate-100 animate-pulse flex items-center justify-center">Laster kartet...</div>,
});

export default function MapPage() {
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeChatEvent, setActiveChatEvent] = useState<StudentEvent | null>(null);
 



  const toggleSelectionMode = () => {
    setIsSelectingLocation((prev) => !prev);
  };

  return (
    <div className="relative h-screen w-full">
      <CreateEventBtn 
        onClick={toggleSelectionMode} 
        isSelectingLocation={isSelectingLocation} 
      />
      {/* Settings button */}
      <button
        type="button"
        aria-label="Open settings menu"
        onClick={() => setIsSettingsOpen((prev) => !prev)}
        className="absolute top-4 right-4 z-[1000] h-14 w-14 rounded-full bg-white/95 shadow-lg backdrop-blur-md border border-gray-200 flex items-center justify-center hover:bg-white"
      >
        <Image
          src="/settings.png"
          alt="Settings"
          width={28}
          height={28}
          priority
        />
      </button>

      {/* Settings menu */}
      {isSettingsOpen && (
        <div className="absolute top-20 right-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg w-72 border border-gray-200">
          <h2 className="text-lg font-bold mb-2">Settings</h2>
          <p className="text-sm text-gray-600 mb-3">Legg til innstillinger her.</p>
        </div>
      )}
      {/* Pass the state to the map */}
      <DisplayMap 
        isSelectingLocation={isSelectingLocation} 
        onLocationSelected={(latlng) => {
          console.log("New Event at:", latlng);
          setIsSelectingLocation(false); // Turn off mode after placement
          // Logic to open your form or popup goes here
        }}
      />
      {/* See joined events / chats */}
      <JoinedEventsSidebar 
        onOpenChat={setActiveChatEvent}/>
      
      {activeChatEvent && (
        <ChatWindow 
          event={activeChatEvent} 
          userName="Demo_User"
          onClose={() => setActiveChatEvent(null)} 
        />
      )}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
    </div>
  );
}