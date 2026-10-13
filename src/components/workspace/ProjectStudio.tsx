import React, { useState, useEffect } from 'react';
import { ProjectItem, ToolCategory } from '../../types';
import { FolderGit2, Plus, Download, Copy, Trash2, ExternalLink, Play, CheckCircle2, Clock } from 'lucide-react';

interface ProjectStudioProps {
  onOpenProject: (project: ProjectItem) => void;
}

export const ProjectStudio: React.FC<ProjectStudioProps> = ({ onOpenProject }) => {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ToolCategory>('hdl');
  const [newDesc, setNewDesc] = useState('');

  // Fetch projects from backend or fallback to local templates
  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch {
      // Local fallback
      const local = localStorage.getItem('ece_labhub_projects');
      if (local) {
        setProjects(JSON.parse(local));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj: ProjectItem = {
      id: 'proj-' + Date.now(),
      title: newTitle,
      category: newCategory,
      author: 'Student',
      updatedAt: new Date().toISOString(),
      description: newDesc,
      data: { type: newCategory, code: '// New project scratchpad' }
    };

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProj)
      });
    } catch {
      // ignore
    }

    const updated = [newProj, ...projects];
    setProjects(updated);
    localStorage.setItem('ece_labhub_projects', JSON.stringify(updated));

    setShowNewModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    } catch {
      // ignore
    }
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('ece_labhub_projects', JSON.stringify(updated));
  };

  const handleExportProject = (proj: ProjectItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(proj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${proj.title.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-cyan-400" />
            Student Engineering Project Studio
          </h2>
          <p className="text-sm text-slate-400">
            Organize personal circuit schematics, HDL modules, and numerical models. Reopen, duplicate, and export anytime.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Engineering Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/80 text-cyan-300 font-bold">
                  {proj.category}
                </span>
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(proj.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-100 mb-1 group-hover:text-cyan-400 transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {proj.description || 'Custom engineering design and simulation script.'}
              </p>
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => onOpenProject(proj)}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <Play className="w-3 h-3 fill-cyan-400" />
                <span>Launch in Studio</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleExportProject(proj, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Export Project JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => handleDeleteProject(proj.id, e)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">Create New Project</h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Project Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., 8-Bit ALU Verilog Design"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Engineering Domain / Tool</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="hdl">ModelSim & HDL (Verilog / VHDL)</option>
                  <option value="matlab">MATLAB & Numerical Computing</option>
                  <option value="circuit">SPICE Circuit Schematic</option>
                  <option value="digital-logic">Digital Logic Gates</option>
                  <option value="signal">Signal Processing & FFT</option>
                  <option value="microcontroller">Arduino / Embedded C</option>
                  <option value="pcb-fpga">PCB & FPGA Layout</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Description (Optional)</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief objective of this experiment or design..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-xl shadow-md"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
