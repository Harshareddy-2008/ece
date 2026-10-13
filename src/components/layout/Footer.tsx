import React from 'react';
import { Cpu, ShieldCheck, Heart, ExternalLink, HelpCircle, Mail, BookOpen } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenContact?: () => void;
  onOpenHelp?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenContact, onOpenHelp }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-16 pt-12 pb-8 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950">
                <Cpu className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-sm text-white">ECE LabHub</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              All-in-One Engineering Education & Simulation Platform designed specifically for B.Tech Electronics & Communication Engineering students.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 6 Native Simulators Active</span>
            </div>
          </div>

          {/* Core Tools */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Engineering Labs</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">MATLAB & Octave Computing</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">ModelSim & HDL Simulation (Verilog)</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Interactive Circuit Simulator (SPICE)</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Digital Logic Design & K-Maps</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Signal Processing & FFT Analyzer</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Arduino / Embedded C Virtual Board</li>
            </ul>
          </div>

          {/* Curriculum & Resources */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Academic Portal</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Semesters 1-8 ECE Syllabus</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">EDC & Analog Electronics Formulas</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Virtual Lab Experiments & Viva Voce</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">Formal Lab Practical Report Generator</li>
              <li className="text-slate-400 hover:text-cyan-400 transition-colors">High-Frequency University Exam Sets</li>
            </ul>
          </div>

          {/* Disclaimers & Integrations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Integration Notice</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-300">Native Tools:</span> Run entirely in-browser.
              <br />
              <span className="font-semibold text-slate-300">External Links:</span> MATLAB® and ModelSim® trademarks belong to their respective owners (MathWorks & Siemens EDA). External links open official web portals in separate tabs.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ECE LabHub Platform. Empowering B.Tech ECE Engineers.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">About</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Contact & Support</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
