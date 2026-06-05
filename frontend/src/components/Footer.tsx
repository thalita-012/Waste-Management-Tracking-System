import { ScreenType } from '../types';

interface FooterProps {
  currentScreen: ScreenType;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export default function Footer({ currentScreen, onToast }: FooterProps) {
  const handleLinkClick = (name: string) => {
    onToast(`Opened ${name} window.`, 'info');
  };

  return (
    <footer className="w-full py-8 px-4 md:px-10 border-t border-outline-variant mt-auto flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest">
      <div className="flex flex-col items-center md:items-start gap-1">
        <span className="text-xl font-black text-on-surface tracking-tight">
          EcoTrack
        </span>
        <p className="text-xs text-on-surface-variant text-center md:text-left">
          © 2024 EcoTrack Waste Management. All rights reserved.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        <button 
          onClick={() => handleLinkClick('Privacy Policy')}
          className="text-xs text-on-surface-variant hover:text-secondary hover:underline transition-colors cursor-pointer"
        >
          Privacy Policy
        </button>
        <button 
          onClick={() => handleLinkClick('Terms of Service')}
          className="text-xs text-on-surface-variant hover:text-secondary hover:underline transition-colors cursor-pointer"
        >
          Terms of Service
        </button>
        <button 
          onClick={() => handleLinkClick('Accessibility')}
          className="text-xs text-on-surface-variant hover:text-secondary hover:underline transition-colors cursor-pointer"
        >
          Accessibility
        </button>
        <button 
          onClick={() => handleLinkClick('Contact Support')}
          className="text-xs text-on-surface-variant hover:text-secondary hover:underline transition-colors cursor-pointer"
        >
          Contact Support
        </button>
      </div>
    </footer>
  );
}
