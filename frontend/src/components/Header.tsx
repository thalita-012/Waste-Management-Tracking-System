import { MouseEvent } from 'react';
import { Recycle, ArrowRight, Menu, LogOut } from 'lucide-react';
import { ScreenType } from '../types';

interface HeaderProps {
  currentScreen: ScreenType;
  setScreen: (screen: ScreenType) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export default function Header({ currentScreen, setScreen, onToast }: HeaderProps) {
  const isAuthenticated = currentScreen === 'PROFILE' || currentScreen === 'TRUCK';

  const handleSupportClick = (e: MouseEvent) => {
    e.preventDefault();
    onToast('Connecting with EcoTrack Support team...', 'info');
  };

  const handleAboutClick = (e: MouseEvent) => {
    e.preventDefault();
    onToast('waste management system is a state-of-the-art sustainable community waste management logistics solution.', 'info');
  };

  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant select-none">
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-7xl mx-auto h-16">
        <div 
          className="flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          onClick={() => setScreen('REGISTRATION')}
        >
          <Recycle className="text-primary w-8 h-8 self-center" />
          <h1 className="font-sans text-2xl font-bold text-primary tracking-tight leading-none">
            Waste Management System
          </h1>
        </div>

        <nav className="flex items-center gap-4 md:gap-8">
          <a 
            href="#support" 
            onClick={handleSupportClick}
            className="text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            Support
          </a>
          <a 
            href="#about" 
            onClick={handleAboutClick}
            className="hidden md:inline-block text-on-surface-variant font-medium hover:text-primary transition-colors text-sm"
          >
            About
          </a>

          {isAuthenticated ? (
            <button 
              onClick={() => {
                setScreen('SIGN_IN');
                onToast('Signed out successfully.', 'info');
              }}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          ) : (
            <button 
              onClick={() => setScreen('SIGN_IN')}
              className="bg-primary text-on-primary px-5 py-2 rounded font-semibold text-xs leading-5 hover:opacity-90 active:scale-95 transition-all font-sans cursor-pointer"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
