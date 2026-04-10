'use client';

import dynamic from 'next/dynamic';
import CreateEventBtn from './components/UI/CreateEventBtn';


const DisplayMap = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <p>Laster kartet...</p>,
});

export default function MapPage() {
    return (

        <div>
        <CreateEventBtn />
      <DisplayMap />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
    </div>
    
)}