import React from 'react';
import { StudentProfile, ToolCategory } from '../../types';
import { subjectsData } from '../../data/subjectsData';
import { experimentsData } from '../../data/experimentsData';
import {
  Cpu,
  Activity,
  Zap,
  Layers,
  Terminal,
  Grid,
  Bot,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  Play,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap
} from 'lucide-react';

interface MainDashboardProps {
  student: StudentProfile;
  onSelectTool: (tool: ToolCategory) => void;
  onNavigateTab: (tab: string) => void;
  onAskAi: (prompt: string, context?: any) => void;
}

const TOOLS_CONFIG = [
  {
    id: 'matlab' as ToolCategory,
    title: 'MATLAB & Numerical Computing',
    desc: 'Matrix algebra, Butterworth IIR filter frequency response, Fourier series, and differential equations.',
    badge: 'Native + Octave',
    color: 'from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40',
    icon: Activity
  },
  {
    id: 'hdl' as ToolCategory,
    title: 'ModelSim & HDL Simulation',
    desc: 'Verilog RTL code editor, testbench synthesizer, and interactive digital timing waveform viewer.',
    badge: 'Native Verilog RTL',
    color: 'from-violet-500/20 to-indigo-500/20 text-violet-300 border-violet-500/40',
    icon: Cpu
  },
  {
    id: 'circuit' as ToolCategory,
    title: 'Circuit Simulation Lab',
    desc: 'Interactive SPICE schematic workbench: DC nodal voltages, branch currents, KCL/KVL, and dual-channel DSO.',
    badge: 'Native SPICE Solver',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40',
    icon: Zap
  },
  {
    id: 'digital-logic' as ToolCategory,
    title: 'Digital Logic Design & K-Maps',
    desc: 'Interactive logic gates, automated truth table generator, Karnaugh map minimizer, and Verilog RTL generator.',
    badge: 'Native Logic Engine',
    color: 'from-blue-500/20 to-sky-500/20 text-blue-300 border-blue-500/40',
    icon: Grid
  },
  {
    id: 'signal' as ToolCategory,
    title: 'Signal Processing & FFT Lab',
    desc: 'Continuous & discrete waveform synthesis, time-domain oscilloscope, harmonic FFT spectrum, and Nyquist aliasing.',
    badge: 'Native DSP Engine',
    color: 'from-cyan-500/20 to-emerald-500/20 text-cyan-300 border-cyan-500/40',
    icon: Compass
  },
  {
    id: 'microcontroller' as ToolCategory,
    title: 'Microcontroller & Embedded Systems',
    desc: 'Arduino Uno firmware, AVR C register editor (DDR/PORT/PIN), virtual hardware breadboard, and UART console.',
    badge: 'Native AVR Emulator',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/40',
    icon: Terminal
  },
  {
    id: 'pcb-fpga' as ToolCategory,
    title: 'PCB Design & FPGA Synthesis',
    desc: 'Controlled microstrip 50-ohm impedance calculator, 4-layer stackup visualizer, DRC guidelines, and FPGA flow.',
    badge: 'Native Calculators & Hub',
    color: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/40',
    icon: Layers
  }
];

export const MainDashboard: React.FC<MainDashboardProps> = ({
  student,
  onSelectTool,
  onNavigateTab,
  onAskAi
}) => {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 p-8 sm:p-10 shadow-2xl overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 schematic-grid opacity-30 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The All-in-One ECE Engineering Learning Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Learn. Simulate. Design.{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Innovate.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A centralized engineering platform built for B.Tech Electronics & Communication Engineering students.
            Simulate circuits, test Verilog RTL with digital waveforms, execute numerical scripts, and prepare for viva examinations in one unified interface.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigateTab('tools')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              <span>Explore Engineering Workbenches</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAskAi('Hello! I am preparing for my ECE semester exams. Can you guide me on the most important topics and formulas?')}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Launch AI Engineering Tutor</span>
            </button>
          </div>
        </div>

        {/* Floating Academic Status Card */}
        <div className="hidden lg:block absolute right-8 top-8 w-72 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">{student.name}</div>
              <div className="text-[10px] text-slate-400">{student.branch} • Semester {student.semester}</div>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-400">
              <span>Institution:</span>
              <span className="text-slate-200 truncate max-w-[140px]">{student.college}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Saved Projects:</span>
              <span className="text-cyan-300 font-mono font-bold">3 Projects</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Experiments Completed:</span>
              <span className="text-emerald-400 font-mono font-bold">4 / 8 Labs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Tools Hub Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Engineering Tools Hub (7 Workspaces)
            </h2>
            <p className="text-xs text-slate-400">Interactive native simulation workbenches with real-time computational solvers</p>
          </div>
          <button
            onClick={() => onNavigateTab('tools')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>View All Labs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS_CONFIG.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool.id)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-1 hover:shadow-cyan-950/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 mb-1.5 group-hover:text-cyan-300 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {tool.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs text-cyan-400 font-semibold mt-4 pt-3 border-t border-slate-800/80">
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular ECE Subjects & Virtual Labs Quick-Access */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular ECE Subjects */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Core ECE Subjects & Syllabi
            </h3>
            <button
              onClick={() => onNavigateTab('subjects')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Explore All 12 Subjects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjectsData.slice(0, 6).map((sub) => (
              <div
                key={sub.id}
                onClick={() => onNavigateTab('subjects')}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1.5 group"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-mono text-cyan-400 font-bold">{sub.code}</span>
                  <span className="text-slate-500">Sem {sub.semester}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                  {sub.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1">{sub.overview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Virtual Experiments */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                Featured Virtual Lab Experiments
              </h3>
              <button
                onClick={() => onNavigateTab('experiments')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {experimentsData.slice(0, 3).map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => onNavigateTab('experiments')}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-[10px] text-cyan-400 font-mono block">{exp.subjectCode}</span>
                    <span className="text-xs font-bold text-slate-200 truncate block">{exp.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Generate formal laboratory practical reports with observation tables and viva scores.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
