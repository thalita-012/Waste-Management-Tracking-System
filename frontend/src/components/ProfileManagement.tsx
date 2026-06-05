import { useState, useRef, MouseEvent, FormEvent, useEffect } from 'react';
import { Camera, LockKeyhole, MapPin, Compass, CheckCircle, RefreshCw, Undo, Save, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';
import { AuthAPI } from '../utils/api';

interface ProfileManagementProps {
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

const INITIAL_PROFILE: UserProfile = {
  fullName: 'Marcus Chen',
  email: 'm.chen@ecotrack.org',
  phoneNumber: '+1 (555) 012-3456',
  address: '452 Industrial Way, San Francisco, CA',
  latitude: '37.774929',
  longitude: '-122.419416',
  memberSince: 'January 2024',
  accountStatus: 'Verified',
  totalPickups: 142
};

export default function ProfileManagement({ onToast }: ProfileManagementProps) {
  const [profile, setProfile] = useState<UserProfile>({ ...INITIAL_PROFILE });
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Track visual marker position percent inside map container for custom map target
  const [markerPos, setMarkerPos] = useState({ x: 50, y: 50 });
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapScale, setMapScale] = useState(1);
  const [mapTranslate, setMapTranslate] = useState({ x: 0, y: 0 });

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await AuthAPI.getProfile(token);
        if (response.success && response.user) {
          const userData = response.user;
          setProfile({
            fullName: userData.full_name,
            email: userData.email,
            phoneNumber: userData.phone_number || '',
            address: userData.address || '',
            latitude: userData.latitude ? userData.latitude.toString() : '37.774929',
            longitude: userData.longitude ? userData.longitude.toString() : '-122.419416',
            memberSince: new Date(userData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
            accountStatus: 'Verified',
            totalPickups: 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field: keyof UserProfile, val: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: val
    }));
  };

  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate percentage click coordinates
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;
    
    setMarkerPos({ x: xPercent, y: yPercent });

    // Derive mock geographical points based on San Francisco bounds
    // Rect center matches SF Coordinates (37.7749, -122.4194)
    const normalizedX = (x / rect.width) - 0.5;
    const normalizedY = 0.5 - (y / rect.height); // coordinate systems invert
    
    const calculatedLat = (37.774929 + (normalizedY * 0.04)).toFixed(6);
    const calculatedLng = (-122.419416 + (normalizedX * 0.06)).toFixed(6);

    setProfile(prev => ({
      ...prev,
      latitude: calculatedLat,
      longitude: calculatedLng
    }));

    onToast('Collection point updated.', 'success');
  };

  // Map mouse move parallax lookahead effect as specified in the mockup JavaScript script
  const handleMapMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const { left, top, width, height } = mapRef.current.getBoundingClientRect();
    const xPercent = (e.clientX - left) / width - 0.5;
    const yPercent = (e.clientY - top) / height - 0.5;
    
    setMapScale(1.08);
    setMapTranslate({ x: xPercent * 18, y: yPercent * 18 });
  };

  const handleMapMouseLeave = () => {
    setMapScale(1);
    setMapTranslate({ x: 0, y: 0 });
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);

    setTimeout(() => {
      // Pull original SF or slightly offset
      const latOffset = (37.774929 + (Math.random() - 0.5) * 0.01).toFixed(6);
      const lngOffset = (-122.419416 + (Math.random() - 0.5) * 0.01).toFixed(6);
      
      // Map marker pos randomly within 30-70 percent bounds
      setMarkerPos({
        x: 30 + Math.random() * 40,
        y: 30 + Math.random() * 40
      });

      setProfile(prev => ({
        ...prev,
        latitude: latOffset,
        longitude: lngOffset
      }));

      setIsLocating(false);
      onToast('Current location selected.', 'success');
    }, 1000);
  };

  const handleDiscardChanges = () => {
    setProfile({ ...INITIAL_PROFILE });
    setMarkerPos({ x: 50, y: 50 });
    onToast('All unsaved edits have been discarded.', 'info');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        onToast('Not authenticated. Please login again.', 'info');
        setIsSaving(false);
        return;
      }

      const response = await AuthAPI.updateProfile(token, {
        full_name: profile.fullName,
        phone_number: profile.phoneNumber,
        address: profile.address,
        latitude: parseFloat(profile.latitude),
        longitude: parseFloat(profile.longitude)
      });

      if (response.success) {
        onToast('Profile saved successfully.', 'success');
      } else {
        onToast(response.error || response.message, 'info');
      }
    } catch (error) {
      onToast('Failed to save profile. Please try again.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const triggerPasswordChange = () => {
    onToast('A secure password reset verification link was dispatched to your email address.', 'success');
  };

  const updateAvatarClick = () => {
    onToast('Upload feature is disabled in sandbox mode. Profile photo is verified.', 'info');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in select-none">
      
      {/* Left Column: Identity & Security Box */}
      <aside className="lg:col-span-4 space-y-6">
        
        {/* Profile Details Container */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col items-center text-center">
          <div 
            onClick={updateAvatarClick}
            className="relative group cursor-pointer mb-4 select-none"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-high relative transition-all shadow-md group-hover:border-emerald-500">
              <img 
                alt="Profile Avatar of Marcus Chen" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnk5iU0Lj2G5rPEFNWMmcTO1Z0y3LqOgDGm6G8orR91BtZxwqzqTMoU7EbZSzZ-9vu-lMFshpD2A9o7on6cCvEK8ixtdq7VfFgGcKz-gmFMtI8YRgiEuBh5YcKHAzV-XU0czB9xbJh80P2fX76991AfkKlemqb90n5tn9-JBQFLaH0JewjAJVCYkQ8JZ9qnc4UwPUPky_BpHkotLehGa-MrUGk_EeDAFv2VFNBrO7iwEw0EhBB1rO8w2KHIjH2d9MrrotJMGBRJi8W" 
              />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-on-primary w-6 h-6" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-on-surface">
            {profile.fullName}
          </h2>
          <p className="text-sm font-semibold text-on-surface-variant mb-6 uppercase tracking-wide">
            Regional Operations Manager
          </p>

          <button 
            type="button"
            onClick={triggerPasswordChange}
            className="w-full py-3 border border-outline text-primary font-bold text-sm rounded-xl hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 active:scale-95 duration-200 cursor-pointer"
          >
            <LockKeyhole className="w-4 h-4 text-primary" />
            Change Password
          </button>
        </div>

        {/* Account Health stats card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
          <h3 className="text-base font-bold text-on-surface mb-4">
            Account Summary
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2.5 border-b border-outline-variant/30 text-sm">
              <span className="text-on-surface-variant font-medium">Member Since</span>
              <span className="font-semibold text-on-surface">{profile.memberSince}</span>
            </div>
            
            <div className="flex justify-between items-center py-2.5 border-b border-outline-variant/30 text-sm">
              <span className="text-on-surface-variant font-medium">Account Status</span>
              <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed text-xs font-bold rounded-lg flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {profile.accountStatus}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 text-sm">
              <span className="text-on-surface-variant font-medium">Total Pickups</span>
              <span className="font-bold text-primary text-base">{profile.totalPickups}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Column: Editable Information Inputs */}
      <section className="lg:col-span-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
          
          <div className="flex items-center justify-between mb-8 select-none">
            <h2 className="text-xl font-bold text-on-surface">
              Personal Information
            </h2>
            <span className="text-xs text-on-surface-variant italic font-medium">
              Last updated: 3 days ago
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">
                  Full Name
                </label>
                <input 
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full h-12 px-4 bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">
                  Email Address
                </label>
                <input 
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full h-12 px-4 bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant">
                  Phone Number
                </label>
                <input 
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full h-12 px-4 bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface-variant font-sans">
                  Address
                </label>
                <input 
                  type="text"
                  value={profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full h-12 px-4 bg-transparent border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>

            {/* Interactive GPS map tracking point */}
            <div className="space-y-3">
              <div className="flex justify-between items-center select-none">
                <label className="text-xs font-bold text-on-surface-variant">
                  Primary Collection Point (GPS) — <span className="text-emerald-700 italic">Click on map to choose new coordinate</span>
                </label>
                
                <button 
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="text-primary text-xs font-bold hover:underline flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLocating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Compass className="w-3.5 h-3.5" />
                  )}
                  {isLocating ? 'Locating...' : 'Use current location'}
                </button>
              </div>

              {/* Map Box */}
              <div 
                ref={mapRef}
                onClick={handleMapClick}
                onMouseMove={handleMapMouseMove}
                onMouseLeave={handleMapMouseLeave}
                className="w-full h-64 rounded-xl overflow-hidden border border-outline-variant relative group shadow-inner cursor-crosshair select-none bg-surface-container-low"
              >
                {/* High quality map view with zoom/parallax translate */}
                <img 
                  alt="High Resolution Satellite Map background" 
                  className="w-full h-full object-cover grayscale-[0.1] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                  style={{
                    transform: `scale(${mapScale}) translate(${mapTranslate.x}px, ${mapTranslate.y}px)`,
                    transition: mapScale === 1 ? 'transform 0.5s ease-out' : 'none'
                  }}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAu_V0jIfMgj5dA7a3ShlCoc9hxeCBrpOiuXWx20TLhHxInxN4Q-sdH2EfzYtzt0lAOGN9FceGSYjIpm71Zxzby0cjbDUMw4WwM87-fegYNfn1u9hrA5pJHbLaXsKbNZpA3vva_a2CW33CBah2kw6sX_C-9XQVWbBcjJ2wu6ZTQ5yq4xMhWBTUwrW_IUHrjgnHj2K4A-uq8e-ANZSp4ThEPD3P50CBimKhArJE-A3isXpRBRQK_7VQv8NweJ8wGYLFdAaw9LzwzYQF" 
                />

                {/* Floating thick overlay grid to represent coordinate guides */}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-surface-container-lowest/15 rounded-xl"></div>
                
                {/* Custom responsive coordinates map pin that matches markerPos state click percentages */}
                <div 
                  className="absolute pointer-events-none -translate-x-1/2 -translate-y-[80%] transition-all duration-100 ease-out"
                  style={{
                    left: `${markerPos.x}%`,
                    top: `${markerPos.y}%`
                  }}
                >
                  {/* Glowing map marker badge details */}
                  <div className="w-9 h-9 bg-primary text-white rounded-full border-4 border-on-primary flex items-center justify-center animate-bounce shadow-xl">
                    <MapPin className="w-4 h-4 text-emerald-100 fill-emerald-100" />
                  </div>
                  {/* Ring highlight surrounding the marker */}
                  <div className="w-16 h-16 rounded-full border border-emerald-500 bg-emerald-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] animate-pulse z-[-1]"></div>
                </div>

                {/* Helpful coordinates display in the bottom margin */}
                <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-[10px] font-bold text-on-surface border border-outline-variant shadow-sm uppercase tracking-wider">
                  Target: {profile.latitude}, {profile.longitude}
                </span>
              </div>
            </div>

            {/* Latitude & Longitude displays matching visual guidelines */}
            <div className="grid grid-cols-2 gap-4 select-none pb-2">
              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Latitude
                </span>
                <div className="text-sm font-semibold text-primary bg-surface-container-lowest px-4 py-2.5 border border-primary rounded-lg shadow-sm">
                  {profile.latitude}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                  Longitude
                </span>
                <div className="text-sm font-semibold text-primary bg-surface-container-lowest px-4 py-2.5 border border-primary rounded-lg shadow-sm">
                  {profile.longitude}
                </div>
              </div>
            </div>

            {/* Form actions submitting column */}
            <div className="pt-6 flex flex-col md:flex-row gap-4 justify-end border-t border-outline-variant select-none">
              <button 
                type="button"
                onClick={handleDiscardChanges}
                className="px-6 py-3 text-on-surface-variant font-bold text-sm rounded-xl hover:bg-surface-container-low transition-colors duration-200 cursor-pointer"
              >
                Discard Changes
              </button>
              
              <button 
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-md hover:bg-opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
