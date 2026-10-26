import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Heart, Activity, FileText, Pill, Calendar, TrendingUp, Droplets, Moon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, reports, pillReminders, cycleEntries } = useApp();
  const todayPills = pillReminders.filter(p => p.date === new Date().toISOString().split('T')[0]);
  const takenPills = todayPills.filter(p => p.taken).length;

  const healthScore = 78;
  const nextPeriod = 'Feb 14, 2025';
  const waterIntake = 5;
  const sleepHours = 7.5;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome Banner */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 gradient-blush rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Good Morning, {user.name.split(' ')[0]}! 🌸
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            Your health overview for today. You're doing great — keep it up! 💗
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Heart className="w-5 h-5 text-blush-500" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">Good</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{healthScore}%</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Health Score</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Pill className="w-5 h-5 text-blush-500" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>{takenPills}/{todayPills.length}</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{todayPills.length}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Today's Medicines</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Droplets className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">{waterIntake}/8</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{waterIntake}</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Glasses of Water</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">Great</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{sleepHours}h</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last Night's Sleep</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Reports</h3>
            <FileText className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="space-y-3">
            {reports.slice(0, 3).map(report => (
              <div key={report.id} className="flex items-center gap-4 p-3 rounded-xl transition-all hover:scale-[1.01]"
                style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-10 h-10 rounded-lg gradient-blush flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{report.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.date} • {report.type}</p>
                </div>
                <Activity className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Upcoming</h3>
            <Calendar className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="space-y-4">
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-blush-500" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Expected Period</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{nextPeriod}</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Pill className="w-4 h-4 text-blush-500" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Vitamin D Dose</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Today at 1:00 PM</p>
            </div>
            <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blush-500" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Follow-up Checkup</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Feb 5, 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>💡 Today's Health Tip</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-2xl mb-2">🥗</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Iron-Rich Foods</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Pair your iron supplement with vitamin C for better absorption. Try spinach salad with lemon dressing!</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-2xl mb-2">🧘‍♀️</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Stress Relief</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>5 minutes of deep breathing can reduce cortisol levels. Try box breathing: 4-4-4-4 pattern.</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-2xl mb-2">💧</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Stay Hydrated</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>You've had 5 glasses today. Aim for 8 glasses — your skin and energy levels will thank you!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
