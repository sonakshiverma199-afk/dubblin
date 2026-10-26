import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Clock, Bell, Check, Plus, Pill, Sun, Moon, Sunrise } from 'lucide-react';

const PillOClock: React.FC = () => {
  const { pillReminders, addPillReminder, togglePillTaken } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newPill, setNewPill] = useState({ medicine: '', dosage: '', time: '' });

  const today = new Date().toISOString().split('T')[0];
  const todayPills = pillReminders.filter(p => p.date === today);
  const takenCount = todayPills.filter(p => p.taken).length;
  const progress = todayPills.length > 0 ? (takenCount / todayPills.length) * 100 : 0;

  const morningPills = todayPills.filter(p => {
    const hour = parseInt(p.time.split(':')[0]);
    return hour < 12;
  });
  const afternoonPills = todayPills.filter(p => {
    const hour = parseInt(p.time.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  const eveningPills = todayPills.filter(p => {
    const hour = parseInt(p.time.split(':')[0]);
    return hour >= 17;
  });

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
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
        pill.taken ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {pill.taken ? '✓ Taken' : 'Pending'}
      </span>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header with Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Clock className="w-6 h-6 text-blush-500" /> Pill O'Clock
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Never miss a dose 💊</p>
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
          <div className="h-full rounded-full gradient-blush transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        {progress === 100 && todayPills.length > 0 && (
          <p className="text-sm mt-2 text-center font-medium text-green-600">🎉 All medicines taken today! Great job!</p>
        )}
      </div>

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
            <div className="space-y-3">
              {morningPills.map(pill => <PillCard key={pill.id} pill={pill} />)}
            </div>
          </div>
        )}

        {afternoonPills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Sun className="w-4 h-4 text-orange-500" /> Afternoon
            </h3>
            <div className="space-y-3">
              {afternoonPills.map(pill => <PillCard key={pill.id} pill={pill} />)}
            </div>
          </div>
        )}

        {eveningPills.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Moon className="w-4 h-4 text-indigo-400" /> Evening
            </h3>
            <div className="space-y-3">
              {eveningPills.map(pill => <PillCard key={pill.id} pill={pill} />)}
            </div>
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

      {/* Note */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
        <Bell className="w-5 h-5 text-blush-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <strong>Push Notifications:</strong> To receive real-time medicine reminders, enable browser notifications in Settings. Reminders are stored locally on your device.
        </p>
      </div>
    </div>
  );
};

export default PillOClock;
