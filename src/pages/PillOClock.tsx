import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../contexts/AppContext';
import { Clock, Bell, Check, Plus, Pill, Sun, Moon, Sunrise, Volume2, VolumeX, Play, TestTube } from 'lucide-react';

// Ringtone definitions using Web Audio API
const ringtones = [
  {
    id: 'gentle-chime',
    name: 'Gentle Chime',
    description: 'Soft ascending notes',
    play: (ctx: AudioContext) => {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.2);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.2 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.2 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.2);
        osc.stop(ctx.currentTime + i * 0.2 + 0.5);
      });
    },
  },
  {
    id: 'soft-bell',
    name: 'Soft Bell',
    description: 'Single resonant tone',
    play: (ctx: AudioContext) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    },
  },
  {
    id: 'calm-wave',
    name: 'Calm Wave',
    description: 'Gentle sine wave',
    play: (ctx: AudioContext) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(392, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    },
  },
];

const PillOClock: React.FC = () => {
  const { pillReminders, addPillReminder, togglePillTaken } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newPill, setNewPill] = useState({ medicine: '', dosage: '', time: '' });
  const [selectedRingtone, setSelectedRingtone] = useState(() =>
    localStorage.getItem('pill-ringtone') || 'gentle-chime'
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(() =>
    localStorage.getItem('pill-notifications') === 'true'
  );
  const [isMuted, setIsMuted] = useState(false);
  const [testNotification, setTestNotification] = useState<{ medicine: string; dosage: string; time: string } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const todayPills = pillReminders.filter(p => p.date === today);
  const takenCount = todayPills.filter(p => p.taken).length;
  const progress = todayPills.length > 0 ? (takenCount / todayPills.length) * 100 : 0;

  const morningPills = todayPills.filter(p => parseInt(p.time.split(':')[0]) < 12);
  const afternoonPills = todayPills.filter(p => {
    const h = parseInt(p.time.split(':')[0]);
    return h >= 12 && h < 17;
  });
  const eveningPills = todayPills.filter(p => parseInt(p.time.split(':')[0]) >= 17);

  // Save ringtone preference
  useEffect(() => {
    localStorage.setItem('pill-ringtone', selectedRingtone);
  }, [selectedRingtone]);

  useEffect(() => {
    localStorage.setItem('pill-notifications', String(notificationsEnabled));
  }, [notificationsEnabled]);

  // Play ringtone preview
  const playRingtone = (ringtoneId: string) => {
    if (isMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const ringtone = ringtones.find(r => r.id === ringtoneId);
      if (ringtone) ringtone.play(ctx);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser.');
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
    }
  };

  // Send test notification
  const sendTestNotification = (pill: { medicine: string; dosage: string; time: string }) => {
    setTestNotification(pill);
    playRingtone(selectedRingtone);

    if (notificationsEnabled && Notification.permission === 'granted') {
      const notification = new Notification('💊 Medicine Reminder', {
        body: `Time to take ${pill.medicine} (${pill.dosage}) at ${pill.time}`,
        icon: '/favicon.ico',
        tag: 'pill-reminder',
        requireInteraction: true,
      });
      setTimeout(() => notification.close(), 10000);
    }

    setTimeout(() => setTestNotification(null), 5000);
  };

  const handleAdd = () => {
    if (!newPill.medicine || !newPill.time) return;
    addPillReminder({
      id: Date.now().toString(),
      ...newPill,
      taken: false,
      date: today,
    });
    setNewPill({ medicine: '', dosage: '', time: '' });
    setShowForm(false);
  };

  const PillCard = ({ pill }: { pill: typeof todayPills[0] }) => (
    <div className={`card p-4 flex items-center gap-4 transition-all ${pill.taken ? 'opacity-60' : ''}`}>
      <button
        onClick={() => togglePillTaken(pill.id)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          pill.taken ? 'bg-green-100 text-green-600' : 'border-2 border-dashed'
        }`}
        style={!pill.taken ? { borderColor: 'var(--border-color)' } : {}}
      >
        {pill.taken ? <Check className="w-5 h-5" /> : <Pill className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />}
      </button>
      <div className="flex-1">
        <p className={`font-medium text-sm ${pill.taken ? 'line-through' : ''}`} style={{ color: 'var(--text-primary)' }}>
          {pill.medicine}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pill.dosage} • {pill.time}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => sendTestNotification(pill)}
          className="p-2 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
          title="Test notification"
        >
          <Bell className="w-4 h-4 text-teal-500" />
        </button>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          pill.taken ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {pill.taken ? '✓ Taken' : 'Pending'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header with Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Clock className="w-6 h-6 text-teal-500" /> Pill O'Clock
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Never miss a dose</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Reminder
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 flex items-center justify-between text-sm">
          <span style={{ color: 'var(--text-secondary)' }}>Today's Progress</span>
          <span className="font-bold" style={{ color: 'var(--accent)' }}>{takenCount}/{todayPills.length}</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-full rounded-full gradient-teal transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        {progress === 100 && todayPills.length > 0 && (
          <p className="text-sm mt-2 text-center font-medium text-green-600">All medicines taken today! Great job!</p>
        )}
      </div>

      {/* Ringtone & Notification Settings */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Volume2 className="w-5 h-5 text-teal-500" /> Reminder Sound & Notifications
        </h3>

        {/* Ringtone Selection */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Choose Ringtone</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ringtones.map(ringtone => (
              <button
                key={ringtone.id}
                onClick={() => { setSelectedRingtone(ringtone.id); playRingtone(ringtone.id); }}
                className={`p-3 rounded-xl text-left transition-all border-2 ${
                  selectedRingtone === ringtone.id ? 'border-teal-400 scale-[1.02]' : 'border-transparent'
                }`}
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Play className="w-3.5 h-3.5 text-teal-500" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ringtone.name}</span>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{ringtone.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Notification Toggle & Test */}
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-3">
            {notificationsEnabled ? <Bell className="w-5 h-5 text-teal-500" /> : <VolumeX className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Push Notifications</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {notificationsEnabled ? 'Enabled — you\'ll receive reminders' : 'Disabled — tap to enable'}
              </p>
            </div>
          </div>
          <button
            onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestNotificationPermission}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              notificationsEnabled ? 'bg-teal-100 text-teal-700' : 'gradient-teal text-white'
            }`}
          >
            {notificationsEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* Mute Toggle */}
        <div className="flex items-center justify-between mt-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-3">
            {isMuted ? <VolumeX className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> : <Volume2 className="w-5 h-5 text-teal-500" />}
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Sound Preview</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{isMuted ? 'Muted' : 'Tap a ringtone to preview'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isMuted ? 'bg-red-100 text-red-700' : 'bg-teal-100 text-teal-700'
            }`}
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>

      {/* Test Notification Display */}
      {testNotification && (
        <div className="card p-4 border-2 border-teal-300 animate-fade-in-up" style={{ background: 'var(--accent-light)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-teal flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>💊 Medicine Reminder</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                Time to take <strong>{testNotification.medicine}</strong> ({testNotification.dosage}) at {testNotification.time}
              </p>
            </div>
            <button onClick={() => setTestNotification(null)} className="p-1">
              <Check className="w-4 h-4 text-teal-500" />
            </button>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Medicine Reminder</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Medicine *</label>
              <input type="text" value={newPill.medicine} onChange={e => setNewPill({...newPill, medicine: e.target.value})} className="input-field" placeholder="Medicine name" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Dosage</label>
              <input type="text" value={newPill.dosage} onChange={e => setNewPill({...newPill, dosage: e.target.value})} className="input-field" placeholder="e.g., 500mg" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Time *</label>
              <input type="time" value={newPill.time} onChange={e => setNewPill({...newPill, time: e.target.value})} className="input-field" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary">Set Reminder</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Schedule */}
      <div className="space-y-6">
        {morningPills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sunrise className="w-4 h-4 text-amber-500" /> Morning
            </h3>
            <div className="space-y-3">{morningPills.map(pill => <PillCard key={pill.id} pill={pill} />)}</div>
          </div>
        )}
        {afternoonPills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sun className="w-4 h-4 text-orange-500" /> Afternoon
            </h3>
            <div className="space-y-3">{afternoonPills.map(pill => <PillCard key={pill.id} pill={pill} />)}</div>
          </div>
        )}
        {eveningPills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Moon className="w-4 h-4 text-sky-400" /> Evening
            </h3>
            <div className="space-y-3">{eveningPills.map(pill => <PillCard key={pill.id} pill={pill} />)}</div>
          </div>
        )}
        {todayPills.length === 0 && (
          <div className="card p-8 text-center">
            <Bell className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>No reminders for today</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Add a medicine reminder to get started!</p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
        <Bell className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>Background Notifications:</strong> For reliable reminders, keep this tab open. For best results on mobile, add this app to your home screen. Browser notifications work when the tab is in the background.
        </p>
      </div>
    </div>
  );
};

export default PillOClock;
