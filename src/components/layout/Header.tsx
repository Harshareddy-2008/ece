import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import {
  Cpu,
  Layers,
  BookOpen,
  FileText,
  FolderGit2,
  Bot,
  ShieldCheck,
  Search,
  Menu,
  X,
  User,
  GraduationCap
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  student: StudentProfile;
  onOpenProfile: () => void;
  onGlobalSearch: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  student,
  onOpenProfile,
  onGlobalSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onGlobalSearch(searchTerm);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'tools', label: 'Engineering Hub', icon: Cpu },
    { id: 'subjects', label: 'Subject Portal', icon: BookOpen },
    { id: 'experiments', label: 'Virtual Labs', icon: FileText },
    { id: 'projects', label: 'Project Studio', icon: FolderGit2 },
    { id: 'ai', label: 'AI Tutor', icon: Bot },
    { id: 'admin', label: 'Admin & Telemetry', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Name */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                  ECE LabHub
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Learn • Simulate • Design • Innovate
              </p>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tools, subjects, labs..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-colors"
              />
            </form>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Student Profile Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              title="Click to view/edit student academic profile"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-[11px]">
                {student.branch.slice(0, 1)}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-slate-200 font-semibold text-[11px] leading-tight truncate max-w-[100px]">
                  {student.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-cyan-400 font-mono leading-tight">
                  {student.branch} • Sem {student.semester}
                </div>
              </div>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800/80 space-y-2">
            <div className="pb-3 px-2">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tools, subjects, experiments..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500"
                />
              </form>
            </div>

            <div className="grid grid-cols-2 gap-1 px-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
