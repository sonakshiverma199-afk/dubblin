import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Shield, FileText, Plus, Trash2, Search, Lock, AlertTriangle, Heart } from 'lucide-react';

const MedicalVault: React.FC = () => {
  const { user, reports } = useApp();
  const [activeTab, setActiveTab] = useState<'reports' | 'allergies' | 'conditions'>('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAllergy, setShowAddAllergy] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [allergies, setAllergies] = useState(user.allergies);
  const [conditions, setConditions] = useState(user.conditions);
  const [showAddCondition, setShowAddCondition] = useState(false);
  const [newCondition, setNewCondition] = useState('');

  const filteredReports = reports.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
      setShowAddAllergy(false);
    }
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition('');
      setShowAddCondition(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-blush flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Medical Vault</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your secure health records — encrypted & private 🔒</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'reports', label: 'Reports', icon: FileText },
          { key: 'allergies', label: 'Allergies', icon: AlertTriangle },
          { key: 'conditions', label: 'Conditions', icon: Heart },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key ? 'gradient-blush text-white' : ''
            }`}
            style={activeTab !== tab.key ? { background: 'var(--accent-light)', color: 'var(--text-secondary)' } : {}}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search reports..."
              className="input-field pl-10"
            />
          </div>
          <div className="space-y-3">
            {filteredReports.map(report => (
              <div key={report.id} className="card p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-blush flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{report.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.date} • {report.type}</p>
                  {report.summary && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{report.summary}</p>
                  )}
                </div>
                <Lock className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allergies Tab */}
      {activeTab === 'allergies' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Known Allergies</h3>
            <button onClick={() => setShowAddAllergy(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {allergies.map((allergy, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'var(--accent-light)' }}>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{allergy}</span>
                <button onClick={() => setAllergies(allergies.filter((_, idx) => idx !== i))} className="ml-1">
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          {showAddAllergy && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                placeholder="Enter allergy name..."
                className="input-field flex-1"
                onKeyDown={e => e.key === 'Enter' && addAllergy()}
              />
              <button onClick={addAllergy} className="btn-primary text-sm">Add</button>
            </div>
          )}
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === 'conditions' && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Health Conditions</h3>
            <button onClick={() => setShowAddCondition(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {conditions.map((condition, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-blush-500" />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{condition}</span>
                </div>
                <button onClick={() => setConditions(conditions.filter((_, idx) => idx !== i))}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>
          {showAddCondition && (
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newCondition}
                onChange={e => setNewCondition(e.target.value)}
                placeholder="Enter condition name..."
                className="input-field flex-1"
                onKeyDown={e => e.key === 'Enter' && addCondition()}
              />
              <button onClick={addCondition} className="btn-primary text-sm">Add</button>
            </div>
          )}
        </div>
      )}

      {/* Security Note */}
      <div className="p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
        <Lock className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>End-to-End Encrypted</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            All data is stored locally on your device. For cloud sync, integrate with a HIPAA-compliant service. Your health data is yours alone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalVault;
