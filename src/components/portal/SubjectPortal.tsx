import React, { useState } from 'react';
import { subjectsData } from '../../data/subjectsData';
import { EceSubject, ToolCategory } from '../../types';
import { BookOpen, Bookmark, ChevronRight, Cpu, Layers, Play, Search, Sparkles } from 'lucide-react';

interface SubjectPortalProps {
  onOpenTool: (tool: ToolCategory) => void;
  onAskAi: (prompt: string, context?: any) => void;
}

export const SubjectPortal: React.FC<SubjectPortalProps> = ({ onOpenTool, onAskAi }) => {
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<EceSubject>(subjectsData[0]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['edc', 'dld']);

  const filteredSubjects = subjectsData.filter((sub) => {
    const matchesSem = selectedSemester === 'all' || sub.semester === selectedSemester;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.overview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSem && matchesSearch;
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            B.Tech ECE Academic Curriculum & Subject Portal
          </h2>
          <p className="text-sm text-slate-400">
            Comprehensive course syllabus, key mathematical formulas, module summaries, and exam preparation notes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, formulas, or codes..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Semester Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedSemester('all')}
          className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
            selectedSemester === 'all'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Semesters
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              selectedSemester === sem
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Semester {sem}
          </button>
        ))}
      </div>

      {/* Main Grid: Subjects List + Selected Subject Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subject Cards Sidebar */}
        <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {filteredSubjects.map((sub) => {
            const isSelected = selectedSubject.id === sub.id;
            const isBookmarked = bookmarkedIds.includes(sub.id);

            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                      {sub.code}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sem {sub.semester} • {sub.credits} Credits
                    </span>
                  </div>
                  <button
                    onClick={(e) => toggleBookmark(sub.id, e)}
                    className="text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-slate-100 mb-1">{sub.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{sub.overview}</p>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/60 text-[11px]">
                  <span className="text-slate-500">{sub.modules.length} Modules</span>
                  <span className="text-cyan-400 flex items-center gap-1 font-medium">
                    View Course Details <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredSubjects.length === 0 && (
            <div className="p-8 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
              No subjects found matching your search.
            </div>
          )}
        </div>

        {/* Selected Subject Detail Panel */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono text-xs font-bold">
                  {selectedSubject.code}
                </span>
                <span className="text-xs text-slate-400">Semester {selectedSubject.semester}</span>
              </div>
              <h2 className="text-lg font-bold text-white">{selectedSubject.name}</h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {selectedSubject.recommendedTools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => onOpenTool(tool)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3 h-3 fill-cyan-300" />
                  <span className="capitalize">{tool} Lab</span>
                </button>
              ))}

              <button
                onClick={() => onAskAi(`Help me revise key formulas, derivations, and exam questions for ${selectedSubject.name} (${selectedSubject.code}).`, { subject: selectedSubject.id })}
                className="px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3 h-3" />
                <span>AI Tutor Prep</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {selectedSubject.overview}
          </p>

          {/* Modules & Key Formulas */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Syllabus Modules & Essential Formulas
            </h3>

            <div className="space-y-3">
              {selectedSubject.modules.map((mod) => (
                <div key={mod.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-slate-200">{mod.title}</h4>

                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-medium">Core Topics Covered:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.topics.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                    <span className="text-[11px] text-cyan-400 font-semibold">Key Formulas:</span>
                    <div className="space-y-1">
                      {mod.keyFormulas.map((f, fIdx) => (
                        <div key={fIdx} className="font-mono text-[11px] text-emerald-300 bg-slate-900/80 p-2 rounded border border-slate-800/80">
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exam Questions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              High-Frequency University Exam Questions
            </h3>
            <div className="space-y-2">
              {selectedSubject.examTopics.map((topic, qIdx) => (
                <div key={qIdx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">{qIdx + 1}.</span>
                  <span className="leading-relaxed">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
