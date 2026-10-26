import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Pill, Plus, Clock, Calendar, User, Trash2, CheckCircle } from 'lucide-react';

const Prescriptions: React.FC = () => {
  const { prescriptions, addPrescription } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ medicine: '', dosage: '', frequency: '', doctor: '', notes: '', startDate: '' });

  const handleAdd = () => {
    if (!form.medicine || !form.dosage) return;
    addPrescription({
      id: Date.now().toString(),
      ...form,
      startDate: form.startDate || new Date().toISOString().split('T')[0],
    });
    setForm({ medicine: '', dosage: '', frequency: '', doctor: '', notes: '', startDate: '' });
    setShowForm(false);
  };

  const activeMeds = prescriptions.filter(p => !p.endDate || new Date(p.endDate) >= new Date());
  const pastMeds = prescriptions.filter(p => p.endDate && new Date(p.endDate) < new Date());

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>💊 Prescriptions</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Manage your medications and dosage history</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Prescription
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>New Prescription</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Medicine Name *</label>
              <input type="text" value={form.medicine} onChange={e => setForm({...form, medicine: e.target.value})} className="input-field" placeholder="e.g., Iron Supplement" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Dosage *</label>
              <input type="text" value={form.dosage} onChange={e => setForm({...form, dosage: e.target.value})} className="input-field" placeholder="e.g., 65mg" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Frequency</label>
              <input type="text" value={form.frequency} onChange={e => setForm({...form, frequency: e.target.value})} className="input-field" placeholder="e.g., Once daily" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Prescribing Doctor</label>
              <input type="text" value={form.doctor} onChange={e => setForm({...form, doctor: e.target.value})} className="input-field" placeholder="e.g., Dr. Meera Kapoor" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Notes</label>
              <input type="text" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="input-field" placeholder="Special instructions..." />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary">Save Prescription</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Active Prescriptions */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <CheckCircle className="w-5 h-5 text-green-500" /> Active ({activeMeds.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMeds.map(rx => (
            <div key={rx.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-blush flex items-center justify-center">
                    <Pill className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{rx.medicine}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{rx.dosage} • {rx.frequency}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {rx.doctor && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                    <User className="w-3.5 h-3.5" /> {rx.doctor}
                  </div>
                )}
                <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <Calendar className="w-3.5 h-3.5" /> Since {rx.startDate}
                </div>
                {rx.notes && (
                  <p className="text-xs p-2 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    📝 {rx.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Past Prescriptions */}
      {pastMeds.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Clock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} /> Past ({pastMeds.length})
          </h3>
          <div className="space-y-2">
            {pastMeds.map(rx => (
              <div key={rx.id} className="card p-4 flex items-center gap-4 opacity-70">
                <Pill className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{rx.medicine} — {rx.dosage}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{rx.startDate} to {rx.endDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
