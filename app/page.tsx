'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const DisplayMap = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <p>Laster kartet...</p>,
});

export default function MapPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="relative h-screen w-full">
      <DisplayMap />

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

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
    </div>
  );
}