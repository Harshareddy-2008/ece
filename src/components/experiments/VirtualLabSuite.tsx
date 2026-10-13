import React, { useState } from 'react';
import { experimentsData } from '../../data/experimentsData';
import { Experiment } from '../../types';
import { FileText, Play, Sliders, CheckCircle, HelpCircle, Printer, Download, Sparkles, Bot, Table } from 'lucide-react';

interface VirtualLabSuiteProps {
  onAskAi: (prompt: string, context?: any) => void;
}

export const VirtualLabSuite: React.FC<VirtualLabSuiteProps> = ({ onAskAi }) => {
  const [selectedExpId, setSelectedExpId] = useState(experimentsData[0].id);
  const [params, setParams] = useState<Record<string, any>>(experimentsData[0].defaultParams);
  const [activeTab, setActiveTab] = useState<'procedure' | 'simulation' | 'viva' | 'report'>('simulation');

  // Viva quiz answers state: { [qIdx]: selectedOptionIdx }
  const [vivaAnswers, setVivaAnswers] = useState<Record<number, number>>({});
  const [showVivaResults, setShowVivaResults] = useState(false);

  const activeExp = experimentsData.find(e => e.id === selectedExpId) || experimentsData[0];

  const handleSelectExp = (id: string) => {
    setSelectedExpId(id);
    const exp = experimentsData.find(x => x.id === id);
    if (exp) {
      setParams(exp.defaultParams);
      setVivaAnswers({});
      setShowVivaResults(false);
    }
  };

  const handleParamChange = (key: string, val: any) => {
    setParams(prev => ({ ...prev, [key]: val }));
  };

  // Compute live observation rows
  const observationRows = activeExp.calculateObservations(params);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Virtual ECE Engineering Laboratory
          </h2>
          <p className="text-sm text-slate-400">
            Conduct curriculum experiments, calibrate parameters, record observation tables, verify viva questions, and export reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskAi && (
            <button
              onClick={() => onAskAi(`Help me understand the experimental procedure, theory, and possible errors for: ${activeExp.title}`, { experiment: activeExp.id })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI About Experiment</span>
            </button>
          )}

          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'simulation' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Simulation & Tables
            </button>
            <button
              onClick={() => setActiveTab('procedure')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'procedure' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Theory & Apparatus
            </button>
            <button
              onClick={() => setActiveTab('viva')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'viva' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Viva Voce Quiz
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'report' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Lab Report View
            </button>
          </div>
        </div>
      </div>

      {/* Experiment Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {experimentsData.map((exp) => (
          <button
            key={exp.id}
            onClick={() => handleSelectExp(exp.id)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              selectedExpId === exp.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <span className="text-[10px] text-cyan-400 font-mono block mb-1">Sem {exp.semester} • {exp.subjectCode}</span>
            <div className="font-medium text-xs text-slate-200 line-clamp-2 leading-snug">{exp.title}</div>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {activeTab === 'simulation' && (
          <div className="space-y-6">
            {/* Top row: Aim & Parameters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Experiment Aim</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{activeExp.aim}</p>
              </div>

              {/* Editable Parameters */}
              <div className="lg:col-span-4 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  Calibrate Parameters
                </span>

                <div className="space-y-2">
                  {Object.entries(params).map(([k, val]) => (
                    <div key={k} className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">{k}:</span>
                      {typeof val === 'number' ? (
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => handleParamChange(k, parseFloat(e.target.value) || 0)}
                          className="w-24 bg-slate-900 border border-slate-700 px-2 py-1 rounded text-right font-mono text-cyan-300 text-xs focus:outline-none focus:border-cyan-500"
                        />
                      ) : (
                        <select
                          value={val}
                          onChange={(e) => handleParamChange(k, e.target.value)}
                          className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-right text-cyan-300 text-xs focus:outline-none"
                        >
                          <option value="Low-Pass">Low-Pass</option>
                          <option value="High-Pass">High-Pass</option>
                          <option value="Inverting">Inverting</option>
                          <option value="Non-Inverting">Non-Inverting</option>
                          <option value="ADD">ADD</option>
                          <option value="SUB">SUB</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Observation Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Table className="w-4 h-4 text-cyan-400" />
                  Live Observation Table ({observationRows.length} Data Points Recorded)
                </span>
                <span className="text-xs text-slate-400 font-mono">Real-time Calculated</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-slate-500">S.No</th>
                      {activeExp.observationColumns.map((col) => (
                        <th key={col} className="p-3 text-cyan-400 whitespace-nowrap">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {observationRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 text-slate-300">
                        <td className="p-3 text-slate-500">{idx + 1}</td>
                        {activeExp.observationColumns.map((col) => (
                          <td key={col} className="p-3 whitespace-nowrap">{row[col] ?? '-'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Observation Graph Plot */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">
                  Experiment Graph: {activeExp.graphConfig.title}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  X: {activeExp.graphConfig.xLabel} | Y: {activeExp.graphConfig.yLabel}
                </span>
              </div>

              <div className="h-52 w-full flex items-center justify-center relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="2,2" />
                  <line x1="40" y1="80" x2="480" y2="80" stroke="#1e293b" strokeDasharray="2,2" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#334155" strokeWidth="1.5" />
                  <line x1="40" y1="20" x2="40" y2="140" stroke="#334155" strokeWidth="1.5" />

                  {/* Polyline from row.x and row.y */}
                  {(() => {
                    const xVals = observationRows.map(r => Number(r.x) || 0);
                    const yVals = observationRows.map(r => Number(r.y) || 0);
                    const minX = Math.min(...xVals);
                    const maxX = Math.max(...xVals) || 1;
                    const minY = Math.min(...yVals);
                    const maxY = Math.max(...yVals) || 1;

                    const pts = observationRows.map((r) => {
                      const px = 40 + ((r.x - minX) / (maxX - minX || 1)) * 430;
                      const py = 140 - ((r.y - minY) / (maxY - minY || 1)) * 115;
                      return `${px},${py}`;
                    }).join(' ');

                    return (
                      <>
                        <polyline
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pts}
                        />
                        {observationRows.map((r, i) => {
                          const cx = 40 + ((r.x - minX) / (maxX - minX || 1)) * 430;
                          const cy = 140 - ((r.y - minY) / (maxY - minY || 1)) * 115;
                          return (
                            <circle key={i} cx={cx} cy={cy} r="3" fill="#38bdf8" />
                          );
                        })}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'procedure' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">Theoretical Background</span>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                {activeExp.theory}
              </p>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Apparatus & Software Required</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {activeExp.apparatus.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'viva' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Laboratory Viva Voce Examination Questions</h3>
                <p className="text-xs text-slate-400">Test your conceptual understanding before facing the examiner.</p>
              </div>
              <button
                onClick={() => setShowVivaResults(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs rounded-xl shadow-md transition-all"
              >
                Submit & Check Answers
              </button>
            </div>

            <div className="space-y-4">
              {activeExp.vivaQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-200">
                    <span className="text-cyan-400 mr-2">Q{qIdx + 1}.</span>
                    {q.question}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = vivaAnswers[qIdx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700';

                      if (showVivaResults) {
                        if (isCorrect) btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                        else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300';
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-950/60 border-cyan-500 text-cyan-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => setVivaAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                          className={`text-left p-3 rounded-xl border text-xs transition-all ${btnStyle}`}
                        >
                          <span className="font-mono text-slate-500 mr-2">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showVivaResults && (
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 mt-2 space-y-1">
                      <span className="font-semibold text-cyan-400">Explanation:</span>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Formal Laboratory Practical Report</h3>
                <p className="text-xs text-slate-400">Standard engineering lab format ready for print or PDF archiving.</p>
              </div>
              <button
                onClick={handlePrintReport}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            {/* Printable Formal Lab Sheet */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 text-slate-300 text-xs">
              <div className="border-b border-slate-800 pb-4 text-center space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-slate-500">Department of Electronics & Communication Engineering</span>
                <h2 className="text-base font-bold text-white uppercase">{activeExp.subjectName}</h2>
                <div className="text-xs text-cyan-400 font-semibold">{activeExp.title}</div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-[11px] font-mono">
                <div><span className="text-slate-500">Subject Code:</span> {activeExp.subjectCode}</div>
                <div><span className="text-slate-500">Semester:</span> {activeExp.semester}</div>
                <div><span className="text-slate-500">Status:</span> Verified (Simulated)</div>
                <div><span className="text-slate-500">Date:</span> {new Date().toLocaleDateString()}</div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">1. AIM:</span>
                <p className="leading-relaxed pl-3">{activeExp.aim}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-white text-xs block">2. APPARATUS & SOFTWARE:</span>
                <p className="leading-relaxed pl-3">{activeExp.apparatus.join(', ')}.</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-white text-xs block">3. OBSERVATIONS & READINGS:</span>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-left text-[11px] font-mono">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        {activeExp.observationColumns.map(col => <th key={col} className="p-2">{col}</th>)}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {observationRows.slice(0, 6).map((r, i) => (
                        <tr key={i}>
                          {activeExp.observationColumns.map(col => <td key={col} className="p-2">{r[col]}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <span className="font-bold text-white text-xs block">4. CONCLUSION & RESULT:</span>
                <p className="leading-relaxed pl-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-emerald-300">
                  The {activeExp.title} experiment was executed successfully on ECE LabHub simulation engine. Observed values closely conform to theoretical models.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
