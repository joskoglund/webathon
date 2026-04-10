'use client';

import dynamic from 'next/dynamic';

const DispalyMap = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <p>Laster kartet...</p>,
});

export default function MapPage() {
    return (

        <div>
      <DispalyMap />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
    </div>
    
)}