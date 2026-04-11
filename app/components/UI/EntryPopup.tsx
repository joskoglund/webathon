import React, { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';

const NameEntryPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    // Check if name already exists in localStorage on mount
    const storedName = localStorage.getItem('userName');
    if (!storedName) {
      setIsVisible(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length >= 2) {
      localStorage.setItem('userName', name.trim());
      setIsVisible(false);
      // Optional: Refresh page or trigger a state update in parent
      window.location.reload(); 
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <User size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome!</h2>
          <p className="text-slate-500 mb-6">
            Please enter your name to start chatting and joining events.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700"
              />
            </div>
            
            <button
              type="submit"
              disabled={name.trim().length < 2}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NameEntryPopup;