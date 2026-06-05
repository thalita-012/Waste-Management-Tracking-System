import { useEffect, useState } from 'react';
import { ArrowLeft, Truck, MapPin, ShieldCheck, PackageCheck } from 'lucide-react';
import { ScreenType } from '../types';

interface TruckDashboardProps {
  setScreen: (screen: ScreenType) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export default function TruckDashboard({ setScreen, onToast }: TruckDashboardProps) {
  const [userName, setUserName] = useState('User');
  const [email, setEmail] = useState('you@example.com');

  useEffect(() => {
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.full_name || 'User');
        setEmail(parsed.email || 'you@example.com');
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-2xl bg-secondary-container p-4 text-secondary">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Next Step</p>
              <h1 className="text-3xl font-bold text-on-surface">Truck Dispatch Dashboard</h1>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-on-surface-variant mb-8">
            Welcome back, {userName}. Your account has been created successfully and is now connected to the waste management tracking system.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-outline-variant bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-3">Assigned Route</p>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-on-surface">Northside Collection</p>
                  <p className="text-xs text-on-surface-variant">Next pickup: 07:30 AM</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-3">Account</p>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-on-surface">{userName}</p>
                <p className="text-xs text-on-surface-variant">{email}</p>
                <p className="text-xs text-on-surface-variant">Status: <span className="font-semibold text-primary">Active</span></p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setScreen('PROFILE')}
              className="inline-flex items-center justify-center gap-2 rounded-3xl border border-outline-variant bg-surface py-3 text-sm font-semibold text-on-surface hover:border-primary hover:text-primary transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              View Profile
            </button>
            <button
              type="button"
              onClick={() => setScreen('SIGN_IN')}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-primary py-3 text-sm font-semibold text-on-primary transition-all hover:opacity-90"
            >
              <ArrowLeft className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </section>

        <aside className="rounded-3xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-2xl bg-primary-container p-4 text-primary">
              <PackageCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Overview</p>
              <h2 className="text-xl font-bold text-on-surface">Active Truck Status</h2>
            </div>
          </div>

          <div className="space-y-4 text-sm text-on-surface-variant">
            <div className="rounded-3xl border border-outline-variant bg-surface p-4">
              <p className="font-semibold text-on-surface">Eco Runner 11</p>
              <p>Currently available near 105 Main St.</p>
            </div>
            <div className="rounded-3xl border border-outline-variant bg-surface p-4">
              <p className="font-semibold text-on-surface">Recycelo 23</p>
              <p>On route to Northside Collection.</p>
            </div>
            <div className="rounded-3xl border border-outline-variant bg-surface p-4">
              <p className="font-semibold text-on-surface">Fuel efficiency</p>
              <p>73% optimized for today’s pickup schedule.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
