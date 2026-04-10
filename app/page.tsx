'use client';

// ...existing code...
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <p>Laster kartet...</p>,
});

export default function Home() {
  return (
    <div>
      <Map />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
    </div>
  );
}