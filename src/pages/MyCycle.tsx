import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Calendar, ChevronLeft, ChevronRight, Droplets, Heart } from 'lucide-react';

const MyCycle: React.FC = () => {
  const { cycleEntries, addCycleEntry } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [logForm, setLogForm] = useState<{ flow: 'none' | 'light' | 'medium' | 'heavy'; symptoms: string[]; mood: string; notes: string }>({ flow: 'none', symptoms: [], mood: '', notes: '' });

  const avgCycleLength = 28;
  const lastPeriodStart = cycleEntries.filter(e => e.flow !== 'none').sort((a, b) => b.date.localeCompare(a.date))[0]?.date;

  const symptoms = ['Cramps', 'Bloating', 'Headache', 'Fatigue', 'Acne', 'Back Pain', 'Mood Swings', 'Cravings', 'Breast Tenderness', 'Insomnia'];
  const moods = ['😊 Happy', '😐 Okay', '😢 Sad', '😤 Irritable', '😴 Tired', '🥰 Loving'];

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEntryForDate = (dateStr: string) => cycleEntries.find(e => e.date === dateStr);

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'heavy': return 'bg-red-400';
      case 'medium': return 'bg-rose-400';
      case 'light': return 'bg-pink-300';
      default: return '';
    }
  };

  const predictedPeriod = () => {
    if (!lastPeriodStart) return null;
    const last = new Date(lastPeriodStart);
    const next = new Date(last.getTime() + avgCycleLength * 24 * 60 * 60 * 1000);
    return next;
  };

  const nextPeriodDate = predictedPeriod();
  const fertileWindow = nextPeriodDate ? new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000) : null;

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const today = new Date().toISOString().split('T')[0];
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = getEntryForDate(dateStr);
      const isToday = dateStr === today;
      const isSelected = dateStr === selectedDate;

      let bgColor = '';
      let dotColor = '';
      if (entry && entry.flow !== 'none') {
        bgColor = 'bg-blush-100 dark:bg-burgundy-600/30';
        dotColor = getFlowColor(entry.flow);
      }

      // Predicted period days
      if (nextPeriodDate) {
        const predDate = nextPeriodDate.toISOString().split('T')[0];
        for (let i = 0; i < 5; i++) {
          const d = new Date(nextPeriodDate.getTime() + i * 24 * 60 * 60 * 1000);
          if (d.toISOString().split('T')[0] === dateStr) {
            bgColor = 'bg-peach-100 dark:bg-peach-200/20';
          }
        }
      }

      days.push(
        <button
          key={day}
          onClick={() => { setSelectedDate(dateStr); setShowLogForm(true); }}
          className={`h-10 w-full rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${bgColor} ${
            isToday ? 'ring-2 ring-blush-400' : ''
          } ${isSelected ? 'ring-2 ring-blush-500' : ''} hover:scale-105`}
          style={{ color: 'var(--text-primary)' }}
        >
          {day}
          {dotColor && <div className={`w-1.5 h-1.5 rounded-full ${dotColor} absolute bottom-1`}></div>}
        </button>
      );
    }

    return days;
  };

  const handleLog = () => {
    if (!selectedDate) return;
    addCycleEntry({
      date: selectedDate,
      flow: logForm.flow,
      symptoms: logForm.symptoms,
      mood: logForm.mood,
      notes: logForm.notes,
    });
    setLogForm({ flow: 'none', symptoms: [], mood: '', notes: '' });
    setShowLogForm(false);
  };

  const toggleSymptom = (s: string) => {
    setLogForm(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(s) ? prev.symptoms.filter(x => x !== s) : [...prev.symptoms, s],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="card p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-2" style={{ color: 'var(--text-primary)' }}>
          <Calendar className="w-6 h-6 text-blush-500" /> My Cycle
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track your menstrual cycle, symptoms, and predictions</p>
      </div>

      {/* Predictions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <Droplets className="w-6 h-6 mx-auto mb-2 text-rose-400" />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Next Period</p>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {nextPeriodDate ? nextPeriodDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Log to predict'}
          </p>
        </div>
        <div className="card p-4 text-center">
          <Heart className="w-6 h-6 mx-auto mb-2 text-pink-400" />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fertile Window</p>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>
            {fertileWindow ? `${fertileWindow.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${nextPeriodDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : 'Log to predict'}
          </p>
        </div>
        <div className="card p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-peach-400" />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cycle Length</p>
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{avgCycleLength} days (avg)</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-lg hover:bg-blush-50">
            <ChevronLeft className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
            {currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
          </h3>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-lg hover:bg-blush-50">
            <ChevronRight className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center text-xs font-medium py-2" style={{ color: 'var(--text-muted)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blush-200"></span> Period</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-peach-200"></span> Predicted</span>
        </div>
      </div>

      {/* Log Form */}
      {showLogForm && selectedDate && (
        <div className="card p-6 space-y-4">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Log for {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}</h3>
          
          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>Flow</label>
            <div className="flex gap-2">
              {(['none', 'light', 'medium', 'heavy'] as const).map(f => (
                <button key={f} onClick={() => setLogForm({...logForm, flow: f})}
                  className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${logForm.flow === f ? 'gradient-blush text-white' : ''}`}
                  style={logForm.flow !== f ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
                >{f}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {symptoms.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${logForm.symptoms.includes(s) ? 'gradient-blush text-white' : ''}`}
                  style={logForm.symptoms.includes(s) ? {} : { background: 'var(--accent-light)', color: 'var(--text-secondary)' }}
                >{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>Mood</label>
            <div className="flex flex-wrap gap-2">
              {moods.map(m => (
                <button key={m} onClick={() => setLogForm({...logForm, mood: m})}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${logForm.mood === m ? 'gradient-blush text-white' : ''}`}
                  style={logForm.mood !== m ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
                >{m}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--text-muted)' }}>Notes</label>
            <textarea value={logForm.notes} onChange={e => setLogForm({...logForm, notes: e.target.value})} className="input-field" rows={2} placeholder="How are you feeling today?"></textarea>
          </div>

          <div className="flex gap-3">
            <button onClick={handleLog} className="btn-primary">Save Entry</button>
            <button onClick={() => setShowLogForm(false)} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--text-secondary)' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCycle;
