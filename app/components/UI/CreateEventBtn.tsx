import React from 'react';
import { Plus, MapPin } from 'lucide-react';

interface CreateEventBtnProps {
  onClick: () => void;
  isSelectingLocation?: boolean;
}

const CreateEventBtn: React.FC<CreateEventBtnProps> = ({ onClick, isSelectingLocation }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
      <button
        
        className={`
          flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-2xl transition-all active:scale-95
          ${isSelectingLocation 
            ? 'bg-orange-500 text-white animate-pulse' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'}
        `}
      >
        {isSelectingLocation ? (
          <>
            <MapPin size={20} />
            <span>Tap on the map...</span>
          </>
        ) : (
          <>
            <Plus size={20} />
            <span>Pin New Event</span>
          </>
        )}
      </button>
      
      {/* Optional helper tooltip */}
      {!isSelectingLocation && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-max bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Start an event here
        </div>
      )}
    </div>
  );
};

export default CreateEventBtn;