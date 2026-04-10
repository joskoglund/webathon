'use client';

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

// Components (Assuming these paths match your structure)
import MapView from './pages/index';
import LoginView from './components/UI/LoginView'; // A simple overlay for the name
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/Map/MapContainer'), {
  ssr: false,
  loading: () => <p>Laster kartet...</p>,
});

// Protected Route Wrapper
const ProtectedMap = () => {
  const { username } = useUser();
  
  if (!username) {
    return <LoginView />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* The Map stays in the background */}
      <div>
      <Map />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      </div>
      <MapView />

      {/* Overlays appear here */}
      <div className="absolute inset-0 pointer-events-none z-[2000]">
        <Outlet />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedMap />}>
            {/* These render into the <Outlet /> above */}
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}