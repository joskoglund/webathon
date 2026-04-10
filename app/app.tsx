import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';

// Components (Assuming these paths match your structure)
import MapView from './pages/index';
import LoginView from './components/UI/LoginView'; // A simple overlay for the name

// Protected Route Wrapper
const ProtectedMap = () => {
  const { username } = useUser();
  
  if (!username) {
    return <LoginView />;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* The Map stays in the background */}
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