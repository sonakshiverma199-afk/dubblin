import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Bell, Shield, Moon, Sun, Monitor, Save, Heart, Trash2 } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, setUser, notifications, setNotifications } = useApp();
  const { theme, setTheme } = useTheme();
  const [editUser, setEditUser] = useState({ ...user });
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const handleSave = () => {
    setUser(editUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const sections = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'appearance', label: 'Appearance', icon: Sun },
    { key: 'privacy', label: 'Privacy & Data', icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="card p-6">
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Heart className="w-6 h-6 text-blush-500" /> Settings
        </h2>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Customize your SheCare experience</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeSection === s.key ? 'gradient-blush text-white' : ''
            }`}
            style={activeSection !== s.key ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
          >
            <s.icon className="w-4 h-4" /> {s.label}
          </button>
        ))}
      </div>

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Full Name</label>
              <input type="text" value={editUser.name} onChange={e => setEditUser({...editUser, name: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Age</label>
              <input type="number" value={editUser.age} onChange={e => setEditUser({...editUser, age: parseInt(e.target.value) || 0})} className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Blood Group</label>
              <select value={editUser.bloodGroup} onChange={e => setEditUser({...editUser, bloodGroup: e.target.value})} className="input-field">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-muted)' }}>Emergency Contact</label>
              <input type="tel" value={editUser.emergencyContact} onChange={e => setEditUser({...editUser, emergencyContact: e.target.value})} className="input-field" />
            </div>
          </div>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" /> {saved ? 'Saved! ✓' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h3>
          <div className="space-y-3">
            {[
              { label: 'Pill Reminders', desc: 'Get notified when it\'s time to take medicine', enabled: true },
              { label: 'Cycle Tracking', desc: 'Period predictions and logging reminders', enabled: true },
              { label: 'Health Tips', desc: 'Daily health and wellness tips', enabled: false },
              { label: 'Report Updates', desc: 'When new reports are analyzed', enabled: true },
              { label: 'Appointment Reminders', desc: 'Upcoming doctor appointment alerts', enabled: true },
            ].map((notif, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{notif.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{notif.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blush-500"></div>
                </label>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl flex items-center justify-between" style={{ background: 'var(--bg-secondary)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Master Toggle</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enable/disable all notifications</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blush-500"></div>
            </label>
          </div>
        </div>
      )}

      {/* Appearance Section */}
      {activeSection === 'appearance' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Theme & Appearance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { key: 'light' as const, icon: Sun, label: 'Light Mode', desc: 'Warm cream & blush pink', colors: ['#fef9ef', '#ff8fab'] },
              { key: 'dark' as const, icon: Moon, label: 'Dark Mode', desc: 'Charcoal & burgundy', colors: ['#1a1a22', '#a84060'] },
              { key: 'system' as const, icon: Monitor, label: 'System', desc: 'Follow device settings', colors: ['#fef9ef', '#1a1a22'] },
            ].map(t => (
              <button key={t.key} onClick={() => setTheme(t.key)}
                className={`p-4 rounded-2xl text-left transition-all border-2 ${theme === t.key ? 'border-blush-400 scale-[1.02]' : 'border-transparent'}`}
                style={{ background: 'var(--bg-secondary)' }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <t.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                  <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
                <div className="flex gap-2">
                  {t.colors.map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border" style={{ background: c, borderColor: 'var(--border-color)' }}></div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Section */}
      {activeSection === 'privacy' && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Privacy & Data</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>🔒 Local Storage</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>All your health data is stored locally on your device. No data is sent to external servers without your explicit consent.</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>🛡️ Data Encryption</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>For production use, integrate with HIPAA-compliant cloud storage (AWS HealthLake, Google Cloud Healthcare API) for encrypted backup.</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>📤 Data Export</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You can export all your data at any time. Your health records belong to you.</p>
            </div>
          </div>
          <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <button onClick={clearData} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
              <Trash2 className="w-4 h-4" /> Clear All Local Data
            </button>
          </div>
        </div>
      )}

      {/* App Info */}
      <div className="text-center py-4">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>SheCare v1.0 💗</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your AI-powered healthcare companion</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Made with love for your wellbeing</p>
      </div>
    </div>
  );
};

export default Settings;
