import React, { useState, useEffect } from 'react';
import { Phone, AlertTriangle, Shield, MapPin, Navigation, Save, X } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
}

const EmergencySOS: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [savedDoctor, setSavedDoctor] = useState(() => localStorage.getItem('emergency-doctor') || '');
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [doctorNumber, setDoctorNumber] = useState(savedDoctor);

  const emergencyNumbers = [
    { name: 'National Emergency', number: '112', icon: '🚨', desc: 'All emergencies (Police, Fire, Ambulance)' },
    { name: 'Women Helpline', number: '1091', icon: '👩', desc: 'Women in distress' },
    { name: 'Ambulance', number: '108', icon: '🚑', desc: 'Medical emergency' },
    { name: 'Police', number: '100', icon: '👮', desc: 'Police assistance' },
    { name: 'Mental Health', number: '08046110007', icon: '🧠', desc: 'NIMHANS helpline (iCall)' },
    { name: 'Poison Control', number: '1800112030', icon: '☠️', desc: 'Poison information center' },
  ];

  // Request location permission
  const requestLocation = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLocationLoading(false);
      },
      (error) => {
        let message = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        setLocationError(message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Open map with location
  const openMap = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    } else if (manualAddress.trim()) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(manualAddress)}`;
      window.open(url, '_blank');
    }
  };

  // Open dialer with number pre-filled (user must tap call)
  const openDialer = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  // Save emergency doctor
  const saveDoctor = () => {
    if (doctorNumber.trim()) {
      localStorage.setItem('emergency-doctor', doctorNumber);
      setSavedDoctor(doctorNumber);
      setShowDoctorForm(false);
    }
  };

  // Call saved doctor
  const callDoctor = () => {
    if (savedDoctor) {
      window.location.href = `tel:${savedDoctor}`;
    }
  };

  useEffect(() => {
    // Auto-request location on mount
    requestLocation();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* SOS Header */}
      <div className="card p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 gradient-teal"></div>
        <div className="relative">
          <div className="w-20 h-20 rounded-full gradient-teal flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Emergency SOS</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quick access to emergency services. Stay safe.</p>
        </div>
      </div>

      {/* Location Section */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <MapPin className="w-5 h-5 text-teal-500" /> Your Location
        </h3>
        
        {locationLoading && (
          <div className="text-center py-4">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Detecting your location...</p>
          </div>
        )}

        {locationError && (
          <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <p className="text-sm" style={{ color: '#ef4444' }}>{locationError}</p>
            <button onClick={requestLocation} className="mt-2 text-xs font-medium text-teal-600 hover:underline">
              Try Again
            </button>
          </div>
        )}

        {location && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'var(--bg-secondary)' }}>
              <Navigation className="w-5 h-5 text-teal-500" />
              <div className="flex-1">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Coordinates</p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Accuracy: ±{Math.round(location.accuracy)}m</p>
              </div>
            </div>
            <button onClick={openMap} className="btn-primary w-full flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4" /> Open in Google Maps
            </button>
          </div>
        )}

        {!location && !locationLoading && (
          <div className="space-y-3">
            <button onClick={requestLocation} className="btn-primary w-full flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Detect My Location
            </button>
            <div className="relative">
              <input
                type="text"
                value={manualAddress}
                onChange={e => setManualAddress(e.target.value)}
                placeholder="Or enter address manually..."
                className="input-field pr-10"
              />
              {manualAddress && (
                <button onClick={openMap} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-teal-50">
                  <MapPin className="w-4 h-4 text-teal-500" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Call Button */}
      <div className="card p-6">
        <h3 className="font-semibold text-center mb-4" style={{ color: 'var(--text-primary)' }}>Quick Emergency Call</h3>
        <a
          href="tel:112"
          className="w-full py-6 rounded-2xl gradient-teal text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg block"
        >
          <Phone className="w-7 h-7" />
          Call 112 — National Emergency
        </a>
        <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
          India's unified emergency number for Police, Fire & Ambulance
        </p>
      </div>

      {/* Emergency Contacts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {emergencyNumbers.map(contact => (
          <div key={contact.number} className="card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'var(--accent-light)' }}>
              {contact.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{contact.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{contact.desc}</p>
              <p className="text-sm font-bold mt-1" style={{ color: 'var(--accent)' }}>{contact.number}</p>
            </div>
            <a
              href={`tel:${contact.number}`}
              className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all"
            >
              <Phone className="w-5 h-5 text-white" />
            </a>
          </div>
        ))}
      </div>

      {/* Emergency Doctor */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Phone className="w-5 h-5 text-teal-500" /> Emergency Doctor
          </h3>
          {!showDoctorForm && (
            <button onClick={() => setShowDoctorForm(true)} className="text-xs font-medium text-teal-600 hover:underline flex items-center gap-1">
              <Save className="w-3 h-3" /> {savedDoctor ? 'Update' : 'Save'}
            </button>
          )}
        </div>

        {savedDoctor && !showDoctorForm && (
          <div className="p-4 rounded-xl flex items-center gap-4" style={{ background: 'var(--bg-secondary)' }}>
            <div className="w-12 h-12 rounded-full gradient-teal flex items-center justify-center text-white font-bold text-lg">
              {doctorName ? doctorName.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{doctorName || 'Emergency Doctor'}</p>
              <p className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{savedDoctor}</p>
            </div>
            <a
              href={`tel:${savedDoctor}`}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
          </div>
        )}

        {showDoctorForm && (
          <div className="space-y-3">
            <input
              type="text"
              value={doctorName}
              onChange={e => setDoctorName(e.target.value)}
              placeholder="Doctor's name (optional)"
              className="input-field"
            />
            <input
              type="tel"
              value={doctorNumber}
              onChange={e => setDoctorNumber(e.target.value)}
              placeholder="Phone number"
              className="input-field"
            />
            <div className="flex gap-2">
              <button onClick={saveDoctor} className="btn-primary flex-1">Save</button>
              <button onClick={() => setShowDoctorForm(false)} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--text-secondary)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Tips */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🆘 Emergency Preparedness</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>📍 Share Your Location</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>In an emergency, share your live location with trusted contacts via WhatsApp or Google Maps.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>🏥 Know Your Blood Group</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Keep your blood group and allergies accessible. Add to your phone's emergency info.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>📱 ICE Contacts</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set In-Case-of-Emergency contacts on your phone. Most phones support this in Settings.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <h4 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>💊 Medical ID</h4>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set up Medical ID on iPhone or Android with your conditions, allergies, and medications.</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
        <Shield className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>Important:</strong> Tapping emergency buttons opens your device's dialer with the number pre-filled. You must tap "Call" to make the call. Always call real emergency services (112 in India) in genuine emergencies. Misuse of emergency services is punishable by law.
        </p>
      </div>
    </div>
  );
};

export default EmergencySOS;
