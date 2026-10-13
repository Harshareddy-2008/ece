import React, { useState } from 'react';
import { ToolCategory } from '../../types';
import { MatlabWorkspace } from './MatlabWorkspace';
import { HdlWorkspace } from './HdlWorkspace';
import { CircuitLab } from './CircuitLab';
import { DigitalLogicLab } from './DigitalLogicLab';
import { SignalProcessingLab } from './SignalProcessingLab';
import { MicrocontrollerLab } from './MicrocontrollerLab';
import { PcbFpgaLab } from './PcbFpgaLab';
import { Activity, Cpu, Zap, Grid, Compass, Terminal, Layers } from 'lucide-react';

interface ToolsHubProps {
  initialTool?: ToolCategory;
  onAskAi: (prompt: string, context?: any) => void;
  onOpenHdlFromLogic?: (code: string) => void;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({
  initialTool = 'matlab',
  onAskAi,
  onOpenHdlFromLogic
}) => {
  const [activeTool, setActiveTool] = useState<ToolCategory>(initialTool);

  const tools = [
    { id: 'matlab' as ToolCategory, name: 'MATLAB / Octave', icon: Activity },
    { id: 'hdl' as ToolCategory, name: 'ModelSim / HDL', icon: Cpu },
    { id: 'circuit' as ToolCategory, name: 'Circuit Lab (SPICE)', icon: Zap },
    { id: 'digital-logic' as ToolCategory, name: 'Digital Logic & K-Map', icon: Grid },
    { id: 'signal' as ToolCategory, name: 'Signal Processing & FFT', icon: Compass },
    { id: 'microcontroller' as ToolCategory, name: 'Microcontroller & C', icon: Terminal },
    { id: 'pcb-fpga' as ToolCategory, name: 'PCB & FPGA Studio', icon: Layers }
  ];

  return (
    <div className="space-y-6">
      {/* Workbench Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Tool */}
      <div>
        {activeTool === 'matlab' && <MatlabWorkspace onAskAi={onAskAi} />}
        {activeTool === 'hdl' && <HdlWorkspace onAskAi={onAskAi} />}
        {activeTool === 'circuit' && <CircuitLab onAskAi={onAskAi} />}
        {activeTool === 'digital-logic' && (
          <DigitalLogicLab
            onAskAi={onAskAi}
            onOpenHdl={(code) => {
              setActiveTool('hdl');
              if (onOpenHdlFromLogic) onOpenHdlFromLogic(code);
            }}
          />
        )}
        {activeTool === 'signal' && <SignalProcessingLab onAskAi={onAskAi} />}
        {activeTool === 'microcontroller' && <MicrocontrollerLab onAskAi={onAskAi} />}
        {activeTool === 'pcb-fpga' && <PcbFpgaLab onAskAi={onAskAi} />}
      </div>
    </div>
  );
};
