import React, { useState } from 'react';
import { Layers, Cpu, ExternalLink, Bot, CheckCircle2, Sliders, Info, ShieldCheck, Zap } from 'lucide-react';

interface PcbFpgaLabProps {
  onAskAi?: (prompt: string, context?: any) => void;
}

export const PcbFpgaLab: React.FC<PcbFpgaLabProps> = ({ onAskAi }) => {
  const [activeTab, setActiveTab] = useState<'pcb' | 'fpga'>('pcb');

  // Microstrip Impedance Calculator state
  const [traceWidthMil, setTraceWidthMil] = useState<number>(10); // mils
  const [dielectricHeightMil, setDielectricHeightMil] = useState<number>(6); // mils (FR4 prepreg)
  const [dielectricEr, setDielectricEr] = useState<number>(4.2); // FR-4 relative permittivity
  const [copperThicknessOz, setCopperThicknessOz] = useState<number>(1); // 1 oz = 1.37 mil

  // Microstrip characteristic impedance formula (IPC-2141):
  // Zo ≈ (87 / sqrt(er + 1.41)) * ln( (5.98 * h) / (0.8 * w + t) )
  const copperThickMil = copperThicknessOz * 1.37;
  const zo = (87 / Math.sqrt(dielectricEr + 1.41)) *
    Math.log((5.98 * dielectricHeightMil) / (0.8 * traceWidthMil + copperThickMil));
  const safeZo = Math.max(10, Math.min(180, isNaN(zo) ? 50 : zo));

  // Current carrying capacity (IPC-2221):
  // I = 0.048 * (dT)^0.44 * A^0.725
  const areaSqMil = traceWidthMil * copperThickMil;
  const currentCapacityA = 0.048 * Math.pow(10, 0.44) * Math.pow(areaSqMil, 0.725);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse"></span>
              PCB Design & FPGA Synthesis Studio
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🟢 Native Calculators & Guides
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Interactive microstrip impedance calculator, 4-layer PCB stackup visualizer, DRC guidelines, and FPGA synthesis pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskAi && (
            <button
              onClick={() => onAskAi(`Explain high-speed PCB impedance matching, 50-ohm controlled microstrips, and FPGA clock domain crossing (CDC) design principles.`, { tool: 'pcb-fpga', activeTab })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI on PCB/FPGA</span>
            </button>
          )}

          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setActiveTab('pcb')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'pcb' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              PCB Design & Impedance
            </button>
            <button
              onClick={() => setActiveTab('fpga')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'fpga' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              FPGA Flow & Architecture
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'pcb' ? (
        <div className="space-y-6">
          {/* Microstrip Impedance & Current Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <span className="font-semibold text-xs text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                IPC-2141 Controlled Impedance Parameters
              </span>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Trace Width (w)</span>
                    <span className="text-cyan-400 font-mono font-bold">{traceWidthMil} mils ({(traceWidthMil * 0.0254).toFixed(3)} mm)</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="40"
                    value={traceWidthMil}
                    onChange={(e) => setTraceWidthMil(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Dielectric Height (h)</span>
                    <span className="text-cyan-400 font-mono font-bold">{dielectricHeightMil} mils</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={dielectricHeightMil}
                    onChange={(e) => setDielectricHeightMil(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Dielectric Constant (εr)</span>
                    <span className="text-cyan-400 font-mono font-bold">{dielectricEr} (FR-4)</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="5.0"
                    step="0.1"
                    value={dielectricEr}
                    onChange={(e) => setDielectricEr(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">Copper Thickness</span>
                    <span className="text-cyan-400 font-mono font-bold">{copperThicknessOz} oz (1.37 mil)</span>
                  </div>
                  <div className="flex gap-2">
                    {[0.5, 1.0, 2.0].map((oz) => (
                      <button
                        key={oz}
                        onClick={() => setCopperThicknessOz(oz)}
                        className={`flex-1 py-1 text-xs rounded border ${copperThicknessOz === oz ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                      >
                        {oz} oz
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Solved Results */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">Characteristic Impedance (Z₀):</span>
                  <span className={`text-base font-mono font-extrabold ${Math.abs(safeZo - 50) < 2 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {safeZo.toFixed(1)} Ω
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Max Current Capacity (10°C rise):</span>
                  <span className="font-mono text-slate-200 font-bold">{currentCapacityA.toFixed(2)} A</span>
                </div>
                {Math.abs(safeZo - 50) < 2 && (
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Matched to standard 50-Ohm RF & High-Speed target!</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4-Layer PCB Stackup Visualization */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
              <div>
                <span className="font-semibold text-xs text-slate-200 flex items-center gap-2 mb-3">
                  <Layers className="w-3.5 h-3.5 text-violet-400" />
                  Standard 4-Layer High-Speed PCB Stackup (1.6mm Overall)
                </span>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 flex justify-between items-center">
                    <span className="font-bold">Layer 1: Top Signal (Microstrips, High-Speed RF & Components)</span>
                    <span>35 µm Cu</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 text-[11px] flex justify-between">
                    <span>Prepreg Dielectric (FR-4, εr ≈ 4.2)</span>
                    <span>0.15 mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 flex justify-between items-center">
                    <span className="font-bold">Layer 2: Continuous Solid Ground Reference Plane (GND)</span>
                    <span>35 µm Cu</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 text-[11px] flex justify-between">
                    <span>FR-4 Core Material</span>
                    <span>1.10 mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 flex justify-between items-center">
                    <span className="font-bold">Layer 3: Power Distribution Plane (VCC 3.3V / 1.8V Split)</span>
                    <span>35 µm Cu</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-400 text-[11px] flex justify-between">
                    <span>Prepreg Dielectric</span>
                    <span>0.15 mm</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200 flex justify-between items-center">
                    <span className="font-bold">Layer 4: Bottom Signal (Low-Speed Routing & Power Traces)</span>
                    <span>35 µm Cu</span>
                  </div>
                </div>
              </div>

              {/* Design Rule Guidelines */}
              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>• Trace-to-trace clearance: ≥ 6 mils</div>
                <div>• Minimum via drill size: 0.3 mm (12 mils)</div>
                <div>• Decoupling caps: directly at IC power pins</div>
                <div>• 3W Rule: 3x trace width spacing for clocks</div>
              </div>
            </div>
          </div>

          {/* External PCB Tools Hub */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 font-semibold flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Recommended External PCB EDA & Fabrication Tools:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { name: 'KiCad EDA (Open-Source)', url: 'https://www.kicad.org/' },
                { name: 'EasyEDA Web Designer', url: 'https://easyeda.com/' },
                { name: 'JLCPCB Manufacturing', url: 'https://jlcpcb.com/' }
              ].map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1"
                >
                  <span>{tool.name}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* FPGA Synthesis & Architecture View */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              FPGA Digital Hardware Synthesis Flow (From RTL to Bitstream)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                { step: '1. RTL Design', desc: 'Verilog/VHDL code and behavioral testbench simulation', color: 'border-cyan-500/50 bg-cyan-950/30' },
                { step: '2. Synthesis', desc: 'Translates RTL into technology-mapped logic gates & LUTs', color: 'border-blue-500/50 bg-blue-950/30' },
                { step: '3. Place & Route', desc: 'Maps gates to physical CLB blocks and routes silicon wiring', color: 'border-violet-500/50 bg-violet-950/30' },
                { step: '4. Static Timing (STA)', desc: 'Validates setup/hold time slacks against clock constraints', color: 'border-emerald-500/50 bg-emerald-950/30' },
                { step: '5. Bitstream Generation', desc: 'Creates .bit file to flash onto Xilinx/Intel FPGA SRAM', color: 'border-amber-500/50 bg-amber-950/30' }
              ].map((s, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${s.color} space-y-1.5`}>
                  <span className="font-bold text-xs text-white block">{s.step}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            {/* Architecture Explainer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-cyan-300">Look-Up Tables (LUTs)</span>
                <p className="text-[11px] text-slate-400">Implement arbitrary boolean combinational logic with SRAM-based truth tables (typically 6-input LUTs).</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-violet-300">DSP48 Slices</span>
                <p className="text-[11px] text-slate-400">Dedicated high-speed 25x18 bit hardware multipliers and accumulators for DSP filters and FFTs.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-300">Block RAM (BRAM)</span>
                <p className="text-[11px] text-slate-400">Dual-port embedded synchronous memory blocks for FIFOs, packet buffers, and CPU caches.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
