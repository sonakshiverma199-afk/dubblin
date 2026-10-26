import React, { useState } from 'react';
import { Phone, AlertTriangle, Shield } from 'lucide-react';

const EmergencySOS: React.FC = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const emergencyNumbers = [
    { name: 'National Emergency', number: '112', icon: '🚨', desc: 'All emergencies (Police, Fire, Ambulance)' },
    { name: 'Women Helpline', number: '1091', icon: '👩', desc: 'Women in distress' },
    { name: 'Ambulance', number: '108', icon: '🚑', desc: 'Medical emergency' },
    { name: 'Police', number: '100', icon: '👮', desc: 'Police assistance' },
    { name: 'Mental Health', number: '08046110007', icon: '🧠', desc: 'NIMHANS helpline (iCall)' },
    { name: 'Poison Control', number: '1800112030', icon: '☠️', desc: 'Poison information center' },
  ];

  const handleEmergencyCall = (number: string) => {
    setShowConfirm(true);
  };

  const confirmCall = () => {
    setIsCalling(true);
    // In production, this would use window.location.href = `tel:${number}`
    setTimeout(() => {
      setIsCalling(false);
      setShowConfirm(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* SOS Header */}
      <div className="card p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 gradient-rose"></div>
        <div className="relative">
          <div className="w-20 h-20 rounded-full gradient-rose flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Emergency SOS</h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quick access to emergency services. Stay safe 💗</p>
        </div>
      </div>

      {/* Quick Call Button */}
      <div className="card p-6">
        <h3 className="font-semibold text-center mb-4" style={{ color: 'var(--text-primary)' }}>Quick Emergency Call</h3>
        <button
          onClick={() => handleEmergencyCall('112')}
          className="w-full py-6 rounded-2xl gradient-rose text-white font-bold text-xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-lg"
        >
          <Phone className="w-7 h-7" />
          Call 112 — National Emergency
        </button>
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
            <button
              onClick={() => handleEmergencyCall(contact.number)}
              className="w-10 h-10 rounded-full gradient-blush flex items-center justify-center flex-shrink-0 hover:scale-110 transition-all"
            >
              <Phone className="w-5 h-5 text-white" />
            </button>
          </div>
        ))}
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
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Keep your blood group (B+) and allergies (Penicillin, Pollen) accessible. Add to your phone's emergency info.</p>
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

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-sm text-center space-y-4">
            {isCalling ? (
              <>
                <div className="w-16 h-16 rounded-full gradient-rose flex items-center justify-center mx-auto animate-pulse-soft">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Connecting to Emergency...</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Please stay calm. Help is on the way.</p>
              </>
            ) : (
              <>
                <AlertTriangle className="w-12 h-12 mx-auto text-amber-500" />
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Confirm Emergency Call</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Are you sure you want to call emergency services? Only call in genuine emergencies.
                </p>
                <div className="flex gap-3">
                  <button onClick={confirmCall} className="btn-primary flex-1">Yes, Call Now</button>
                  <button onClick={() => setShowConfirm(false)} className="flex-1 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--text-secondary)' }}>Cancel</button>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  ⚠️ This is a demo. In production, this would dial the actual emergency number on your device.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
        <Shield className="w-5 h-5 text-blush-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>Important:</strong> This feature is designed for demonstration. In a real app, tapping emergency buttons would use <code>tel:</code> links to dial actual numbers. Always call real emergency services (112 in India) in genuine emergencies. Misuse of emergency services is punishable by law.
        </p>
      </div>
    </div>
  );
};

export default EmergencySOS;
