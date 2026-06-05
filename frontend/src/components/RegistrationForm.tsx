import { useState, FormEvent } from 'react';
import { ShieldCheck, MapPin, Compass, Loader2, AlertCircle } from 'lucide-react';
import { ScreenType } from '../types';
import imageFile from '../image/image.png';
import { AuthAPI } from '../utils/api';

interface RegistrationFormProps {
  setScreen: (screen: ScreenType) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export default function RegistrationForm({ setScreen, onToast }: RegistrationFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('--.------');
  const [lng, setLng] = useState('--.------');
  
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleGetLocation = () => {
    setIsLocating(true);
    onToast('Requesting GPS location permissions...', 'info');

    setTimeout(() => {
      // Simulate real coordinates
      const generatedLat = (37.7749 + (Math.random() - 0.5) * 0.02).toFixed(6);
      const generatedLng = (-122.4194 + (Math.random() - 0.5) * 0.02).toFixed(6);
      
      setLat(generatedLat);
      setLng(generatedLng);
      setIsLocating(false);
      onToast('Precise GPS home coordinate captured!', 'success');
    }, 1200);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !password) {
      setFormError('Please fill out your name, email, and password to create the account.');
      return;
    }

    setFormError('');
    setIsSubmitting(true);
    
    try {
      const response = await AuthAPI.register({
        full_name: fullName,
        email,
        password,
        phone_number: phone || undefined,
        address: address || undefined,
        latitude: lat !== '--.------' ? parseFloat(lat) : undefined,
        longitude: lng !== '--.------' ? parseFloat(lng) : undefined
      });

      if (response.success) {
        onToast('Welcome to the Green Revolution! Account created.', 'success');
        // Store token in localStorage
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        // Direct user into the truck dashboard
        setScreen('TRUCK');
      } else {
        setFormError(response.message || 'We could not create the account. Please review the form and try again.');
      }
    } catch (error) {
      setFormError('Unable to reach the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant overflow-hidden">
      {/* Visual / Inspiration Column */}
      <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-b from-primary to-primary-container text-on-primary relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white">
            Join the Green Revolution
          </h2>
          <p className="text-base opacity-90 leading-relaxed text-emerald-100">
            Help your community manage waste more efficiently and track your environmental impact in real-time.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-center my-6">
          <img src={imageFile} alt="Waste Management" className="max-w-md h-auto rounded-lg shadow-lg" />
        </div>

        <div className="relative z-10 mt-16">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 shadow-inner">
            <div className="flex items-center gap-2 mb-3 text-white">
              <ShieldCheck className="text-emerald-300 w-5 h-5 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Operational Trust
              </span>
            </div>
            <p className="text-sm italic text-emerald-100">
              "EcoTrack has helped us divert over 40% of our household waste from landfills in just three months."
            </p>
          </div>
        </div>

        {/* Abstract background pattern matching mockup style leaf background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
          <img 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWCA-gy982kttTS9cWjnHmKCZOx8pqYdcFi8ORsTnFGrDtDeVWyBrKOLJwAK38O4B5CH344qUVcTO5wJMysKzsBRDw6J8QICaD4M1nq6JP-LiVGNUy97hhL2qQY8x5aEH78iWNTXdkHH3mSRkUEv7LkoPurllQqJUZxKtSY-oDNqKVJFna3ry4qUxee6y4x0e5q6MYCGt2DFjmh0-GYSLpCC4_pUW52WSiac2PJWqFSQ13dPAqFVfcLxN3FNFzdA24Kd6xKsvMkPF7" 
            alt="Leaf silhouettes background"
          />
        </div>
      </div>

      {/* Registration Form Column */}
      <div className="p-8 md:p-10 flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-1">
            Create Resident Account
          </h2>
          <p className="text-sm text-on-surface-variant">
            Register your household to start tracking waste metrics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block">
                Full Name
              </label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block">
                Email
              </label>
              <input 
                type="email" 
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block">
                Phone Number
              </label>
              <input 
                type="tel" 
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant block">
                Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Home Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant block">
              Home Address
            </label>
            <input 
              type="text" 
              placeholder="123 Eco Street, Greenway City"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
            />
          </div>

          {/* GPS Location Section */}
          <div className="pt-2">
            <div className="p-4 bg-surface rounded-lg border border-outline-variant space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="text-secondary w-5 h-5" />
                  <h3 className="text-sm font-semibold text-on-surface">
                    Set GPS Location
                  </h3>
                </div>
                
                <button 
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLocating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Compass className="w-3.5 h-3.5" />
                  )}
                  {isLocating ? 'Locating...' : 'Get Current Location'}
                </button>
              </div>

              {/* Map Preview container matching styling */}
              <div className="relative w-full h-[140px] rounded border border-outline-variant overflow-hidden map-gradient select-none">
                <img 
                  className="w-full h-full object-cover opacity-80" 
                  referrerPolicy="no-referrer"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYgZjA3-l3pUPxcj1n1hsy7QgLWf6ct_qoou46SmQblsSZupecrdlf8vVKTliNh7zVBXkgNAYUF8g2WOQ47OUzLDPkGZC9I21EJPKI-4_QPKXqq_GarK6nSk_oZncg27sOxX5UjTwO7_LQlsSlFentqYWCAo2fb4wBzKjgl5tr3CcFAfEfGYQZIdzJ4Gv5Z-oOLb4Hu6f5b7FnIHSx9SjhIfbVss2v0o9b7QNpKdu1qYuMfP-0fZxC08pdqivEsXIASpHRczc9E5pU" 
                  alt="Interactive map preview"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <span className="bg-white/95 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-md border border-outline-variant text-on-surface">
                    Interactive Map Preview
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Latitude
                  </span>
                  <div className={`text-sm font-semibold bg-surface-container-lowest px-3 py-2 border rounded transition-all ${lat !== '--.------' ? 'border-primary text-primary' : 'border-outline-variant text-on-surface/50'}`}>
                    {lat}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                    Longitude
                  </span>
                  <div className={`text-sm font-semibold bg-surface-container-lowest px-3 py-2 border rounded transition-all ${lng !== '--.------' ? 'border-primary text-primary' : 'border-outline-variant text-on-surface/50'}`}>
                    {lng}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {formError && (
            <div className="rounded-lg border border-error/25 bg-error-container/70 px-4 py-3 text-left">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-error" />
                <p className="text-xs font-semibold leading-relaxed text-on-error-container">
                  {formError}
                </p>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold shadow-md hover:bg-opacity-95 active:scale-[0.98] transition-all flex justify-center items-center gap-2 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-center text-xs text-on-surface-variant mt-4">
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setScreen('SIGN_IN')}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
