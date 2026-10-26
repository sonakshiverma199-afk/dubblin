import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Upload, FileText, CheckCircle, AlertCircle, Save, X, Loader2 } from 'lucide-react';

const ReportAnalyzer: React.FC = () => {
  const { addReport } = useApp();
  const [isUploading, setIsUploading] = useState(false);
  const [analyzedReport, setAnalyzedReport] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setSaved(false);

    // Simulate analysis
    setTimeout(() => {
      const report = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        date: new Date().toISOString().split('T')[0],
        type: file.type.includes('pdf') ? 'PDF Report' : 'Image Report',
        summary: generateAnalysis(file.name),
        values: generateValues(),
      };
      setAnalyzedReport(report);
      setIsUploading(false);
    }, 2500);
  };

  const generateAnalysis = (filename: string) => {
    const analyses = [
      "Complete Blood Count shows hemoglobin at 11.2 g/dL (slightly below normal range of 12-16 g/dL for women). RBC count is normal. WBC and platelet counts are within normal limits. Iron studies suggest mild iron deficiency.",
      "Liver Function Test results are within normal limits. ALT: 22 U/L, AST: 19 U/L, ALP: 68 U/L, Total Bilirubin: 0.8 mg/dL. No signs of liver dysfunction.",
      "Thyroid Function Test: TSH 2.8 mIU/L (normal: 0.4-4.0), Free T4: 1.2 ng/dL (normal: 0.8-1.8), Free T3: 3.1 pg/mL (normal: 2.3-4.2). All values within normal range — euthyroid status.",
    ];
    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const generateValues = () => {
    return [
      { name: 'Hemoglobin', value: '11.2', unit: 'g/dL', range: '12.0 - 16.0', status: 'low' },
      { name: 'RBC Count', value: '4.5', unit: 'million/µL', range: '3.8 - 5.1', status: 'normal' },
      { name: 'WBC Count', value: '7,200', unit: '/µL', range: '4,000 - 11,000', status: 'normal' },
      { name: 'Platelets', value: '2,45,000', unit: '/µL', range: '1,50,000 - 4,50,000', status: 'normal' },
      { name: 'Iron', value: '45', unit: 'µg/dL', range: '60 - 160', status: 'low' },
      { name: 'Ferritin', value: '12', unit: 'ng/mL', range: '15 - 150', status: 'low' },
    ];
  };

  const handleSave = () => {
    if (analyzedReport) {
      addReport({
        id: analyzedReport.id,
        name: analyzedReport.name,
        date: analyzedReport.date,
        type: analyzedReport.type,
        summary: analyzedReport.summary,
      });
      setSaved(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Upload Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          📄 Upload Medical Report
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
          Upload a PDF or image of your medical report. Our AI will extract key values, explain results, and create a summary.
        </p>

        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover:border-blush-400"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-blush-500 animate-spin mb-3" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Analyzing your report...</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Extracting values and generating summary</p>
            </>
          ) : (
            <>
              <Upload className="w-10 h-10 text-blush-400 mb-3" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Click to upload or drag & drop</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PDF, PNG, JPG up to 10MB</p>
            </>
          )}
          <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" onChange={handleUpload} disabled={isUploading} />
        </label>

        <div className="mt-4 p-3 rounded-xl flex items-start gap-3" style={{ background: 'var(--bg-secondary)' }}>
          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <strong>Note:</strong> Report analysis is performed locally. Your data never leaves your device. For clinical interpretation, always consult your healthcare provider.
          </p>
        </div>
      </div>

      {/* Analyzed Results */}
      {analyzedReport && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                📋 Analysis Summary
              </h3>
              <div className="flex gap-2">
                {!saved ? (
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" /> Save Report
                  </button>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" /> Saved!
                  </span>
                )}
                <button onClick={() => { setAnalyzedReport(null); setSaved(false); }}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {analyzedReport.summary}
            </p>
          </div>

          {/* Extracted Values */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              🔬 Extracted Values
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Parameter</th>
                    <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Value</th>
                    <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Normal Range</th>
                    <th className="text-left py-3 px-2 font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analyzedReport.values.map((v: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="py-3 px-2 font-medium" style={{ color: 'var(--text-primary)' }}>{v.name}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--text-primary)' }}>{v.value} {v.unit}</td>
                      <td className="py-3 px-2" style={{ color: 'var(--text-muted)' }}>{v.range}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          v.status === 'normal' ? 'bg-green-100 text-green-700' :
                          v.status === 'low' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {v.status === 'normal' ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              💡 Recommendations
            </h3>
            <div className="space-y-3">
              {[
                { icon: '🥗', text: 'Increase iron-rich foods: spinach, lentils, dates, jaggery, red meat' },
                { icon: '🍊', text: 'Pair iron sources with Vitamin C (lemon, oranges, bell peppers) for better absorption' },
                { icon: '☕', text: 'Avoid tea/coffee 1 hour before and after meals (tannins block iron absorption)' },
                { icon: '💊', text: 'Continue iron supplementation as prescribed by your doctor' },
                { icon: '📅', text: 'Schedule a follow-up blood test in 3 months to monitor improvement' },
              ].map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-lg">{rec.icon}</span>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportAnalyzer;
