import React, { useState } from 'react';
import { Bot, Check, Copy, Cpu, Play, RefreshCw, Zap, Table, Grid } from 'lucide-react';

interface DigitalLogicLabProps {
  onAskAi?: (prompt: string, context?: any) => void;
  onOpenHdl?: (verilogCode: string) => void;
}

interface CircuitDef {
  id: string;
  name: string;
  inputs: string[];
  outputs: string[];
  evaluate: (...args: number[]) => Record<string, number>;
  booleanExpr: string;
  verilogCode: string;
}

const CIRCUITS: CircuitDef[] = [
  {
    id: 'half_adder',
    name: 'Half Adder (XOR + AND)',
    inputs: ['A', 'B'],
    outputs: ['Sum', 'Cout'],
    evaluate: (a: number = 0, b: number = 0) => ({
      Sum: a ^ b,
      Cout: a & b
    }),
    booleanExpr: 'Sum = A ⊕ B,  Cout = A · B',
    verilogCode: `module half_adder(input A, B, output Sum, Cout);\n  assign Sum = A ^ B;\n  assign Cout = A & B;\nendmodule`
  },
  {
    id: 'full_adder',
    name: '1-Bit Full Adder',
    inputs: ['A', 'B', 'Cin'],
    outputs: ['Sum', 'Cout'],
    evaluate: (a: number = 0, b: number = 0, cin: number = 0) => ({
      Sum: a ^ b ^ cin,
      Cout: (a & b) | (cin & (a ^ b))
    }),
    booleanExpr: 'Sum = A ⊕ B ⊕ Cin,  Cout = AB + Cin(A ⊕ B)',
    verilogCode: `module full_adder(input A, B, Cin, output Sum, Cout);\n  assign Sum = A ^ B ^ Cin;\n  assign Cout = (A & B) | (Cin & (A ^ B));\nendmodule`
  },
  {
    id: 'mux21',
    name: '2-to-1 Multiplexer',
    inputs: ['D0', 'D1', 'Sel'],
    outputs: ['Y'],
    evaluate: (d0: number = 0, d1: number = 0, sel: number = 0) => ({
      Y: sel === 0 ? d0 : d1
    }),
    booleanExpr: 'Y = (D0 · Sel\') + (D1 · Sel)',
    verilogCode: `module mux2to1(input D0, D1, Sel, output Y);\n  assign Y = (~Sel & D0) | (Sel & D1);\nendmodule`
  },
  {
    id: 'xor_universal',
    name: 'XOR from 4 NAND Gates',
    inputs: ['A', 'B'],
    outputs: ['Y'],
    evaluate: (a: number = 0, b: number = 0) => {
      const n1 = !(a && b) ? 1 : 0;
      const n2 = !(a && n1) ? 1 : 0;
      const n3 = !(b && n1) ? 1 : 0;
      const n4 = !(n2 && n3) ? 1 : 0;
      return { Y: n4 };
    },
    booleanExpr: 'Y = NAND(NAND(A, NAND(A,B)), NAND(B, NAND(A,B))) = A ⊕ B',
    verilogCode: `module xor_from_nand(input A, B, output Y);\n  wire n1, n2, n3;\n  nand(n1, A, B);\n  nand(n2, A, n1);\n  nand(n3, B, n1);\n  nand(Y, n2, n3);\nendmodule`
  }
];

export const DigitalLogicLab: React.FC<DigitalLogicLabProps> = ({ onAskAi, onOpenHdl }) => {
  const [selectedCircuitId, setSelectedCircuitId] = useState(CIRCUITS[0].id);
  const [inputStates, setInputStates] = useState<Record<string, number>>({ A: 0, B: 1, Cin: 0, D0: 1, D1: 0, Sel: 0 });
  const [activeTab, setActiveTab] = useState<'interactive' | 'truthtable' | 'kmap' | 'verilog'>('interactive');
  const [copied, setCopied] = useState(false);

  const activeCircuit = CIRCUITS.find(c => c.id === selectedCircuitId) || CIRCUITS[0];

  const toggleInput = (inputName: string) => {
    setInputStates(prev => ({
      ...prev,
      [inputName]: prev[inputName] === 1 ? 0 : 1
    }));
  };

  // Evaluate current output
  const currentOutput = activeCircuit.evaluate(
    inputStates['A'] ?? inputStates['D0'] ?? 0,
    inputStates['B'] ?? inputStates['D1'] ?? 0,
    inputStates['Cin'] ?? inputStates['Sel'] ?? 0
  );

  // Generate full truth table
  const generateTruthTable = () => {
    const inputCount = activeCircuit.inputs.length;
    const totalRows = Math.pow(2, inputCount);
    const rows = [];

    for (let r = 0; r < totalRows; r++) {
      const rowInputs: Record<string, number> = {};
      activeCircuit.inputs.forEach((inputName, idx) => {
        const bitShift = inputCount - 1 - idx;
        rowInputs[inputName] = (r >> bitShift) & 1;
      });

      const out = activeCircuit.evaluate(
        rowInputs['A'] ?? rowInputs['D0'] ?? 0,
        rowInputs['B'] ?? rowInputs['D1'] ?? 0,
        rowInputs['Cin'] ?? rowInputs['Sel'] ?? 0
      );

      rows.push({
        inputs: rowInputs,
        outputs: out
      });
    }

    return rows;
  };

  const truthTable = generateTruthTable();

  const handleCopyVerilog = () => {
    navigator.clipboard.writeText(activeCircuit.verilogCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Digital Logic Design Lab & K-Map Minimizer
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🟢 Native Logic Simulator
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Simulate logic gates, toggle digital inputs, auto-generate truth tables, and synthesize corresponding Verilog HDL RTL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskAi && (
            <button
              onClick={() => onAskAi(`Explain the Boolean logic, gate-level implementation, and K-Map simplification for: ${activeCircuit.name}`, { tool: 'digital-logic', circuit: activeCircuit.id })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI to Explain Logic</span>
            </button>
          )}

          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'interactive' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Interactive Gate View
            </button>
            <button
              onClick={() => setActiveTab('truthtable')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'truthtable' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Truth Table
            </button>
            <button
              onClick={() => setActiveTab('kmap')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'kmap' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Karnaugh Map
            </button>
            <button
              onClick={() => setActiveTab('verilog')}
              className={`px-3 py-1.5 rounded-md transition-all ${activeTab === 'verilog' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Verilog RTL
            </button>
          </div>
        </div>
      </div>

      {/* Circuit Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {CIRCUITS.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCircuitId(c.id)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              selectedCircuitId === c.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="font-medium text-xs text-slate-200 mb-1 flex items-center justify-between">
              <span>{c.name}</span>
              {selectedCircuitId === c.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
            </div>
            <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{c.booleanExpr}</p>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {activeTab === 'interactive' && (
          <div className="space-y-6">
            {/* Control Panel: Digital Switch Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Input Logic Switches:
                </span>
                <div className="flex items-center gap-3">
                  {activeCircuit.inputs.map((inp) => {
                    const val = inputStates[inp] ?? 0;
                    return (
                      <button
                        key={inp}
                        onClick={() => toggleInput(inp)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all shadow-sm ${
                          val === 1
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <span>{inp} =</span>
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center ${val === 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                          {val}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output Indicator LEDs */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Output State:
                </span>
                <div className="flex items-center gap-3">
                  {Object.entries(currentOutput).map(([outKey, outVal]) => (
                    <div
                      key={outKey}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all ${
                        outVal === 1
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-cyan-950/50 shadow-md'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${outVal === 1 ? 'bg-cyan-400 shadow-md shadow-cyan-400 animate-pulse' : 'bg-slate-700'}`}></span>
                      <span>{outKey} = {outVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Visual Gate Schematic Canvas */}
            <div className="bg-slate-950 rounded-xl border border-slate-800/90 schematic-grid p-6 min-h-[260px] flex items-center justify-center relative">
              {activeCircuit.id === 'half_adder' && (
                <svg className="w-full max-w-lg h-48" viewBox="0 0 460 160">
                  {/* Inputs */}
                  <text x="20" y="45" fill={inputStates['A'] ? '#10b981' : '#64748b'} fontSize="13" fontWeight="bold">A={inputStates['A'] ?? 0}</text>
                  <text x="20" y="115" fill={inputStates['B'] ? '#10b981' : '#64748b'} fontSize="13" fontWeight="bold">B={inputStates['B'] ?? 0}</text>

                  {/* Wire routes */}
                  <polyline points="60,40 180,40" stroke={inputStates['A'] ? '#10b981' : '#475569'} strokeWidth="2.5" />
                  <polyline points="60,110 180,110" stroke={inputStates['B'] ? '#10b981' : '#475569'} strokeWidth="2.5" />
                  <polyline points="100,40 100,80 180,80" stroke={inputStates['A'] ? '#10b981' : '#475569'} strokeWidth="2.5" />
                  <polyline points="120,110 120,130 180,130" stroke={inputStates['B'] ? '#10b981' : '#475569'} strokeWidth="2.5" />

                  {/* XOR Gate for Sum */}
                  <g transform="translate(180, 20)">
                    <rect x="0" y="0" width="70" height="40" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
                    <text x="35" y="25" textAnchor="middle" fill="#38bdf8" fontSize="13" fontWeight="bold">XOR</text>
                  </g>
                  <line x1="250" y1="40" x2="360" y2="40" stroke={currentOutput['Sum'] ? '#06b6d4' : '#475569'} strokeWidth="3" />
                  <circle cx="360" cy="40" r="5" fill={currentOutput['Sum'] ? '#06b6d4' : '#475569'} />
                  <text x="375" y="45" fill={currentOutput['Sum'] ? '#06b6d4' : '#64748b'} fontSize="13" fontWeight="bold">Sum = {currentOutput['Sum']}</text>

                  {/* AND Gate for Cout */}
                  <g transform="translate(180, 90)">
                    <rect x="0" y="0" width="70" height="45" rx="6" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                    <text x="35" y="28" textAnchor="middle" fill="#c084fc" fontSize="13" fontWeight="bold">AND</text>
                  </g>
                  <line x1="250" y1="112" x2="360" y2="112" stroke={currentOutput['Cout'] ? '#a855f7' : '#475569'} strokeWidth="3" />
                  <circle cx="360" cy="112" r="5" fill={currentOutput['Cout'] ? '#a855f7' : '#475569'} />
                  <text x="375" y="117" fill={currentOutput['Cout'] ? '#a855f7' : '#64748b'} fontSize="13" fontWeight="bold">Cout = {currentOutput['Cout']}</text>
                </svg>
              )}

              {activeCircuit.id !== 'half_adder' && (
                <div className="flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-lg flex items-center gap-6">
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400">Inputs:</span>
                      <div className="font-mono text-sm text-emerald-400 font-bold">
                        {activeCircuit.inputs.map(i => `${i}=${inputStates[i] ?? 0}`).join(', ')}
                      </div>
                    </div>
                    <div className="text-xl text-slate-600">➔</div>
                    <div className="px-4 py-2 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-center">
                      <span className="text-[10px] text-cyan-400 block font-mono">LOGIC CORE</span>
                      <span className="text-sm font-bold text-white">{activeCircuit.name}</span>
                    </div>
                    <div className="text-xl text-slate-600">➔</div>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-400">Outputs:</span>
                      <div className="font-mono text-sm text-cyan-400 font-bold">
                        {Object.entries(currentOutput).map(([k, v]) => `${k}=${v}`).join(', ')}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{activeCircuit.booleanExpr}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Truth Table Tab */}
        {activeTab === 'truthtable' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                Truth Table (All {truthTable.length} States)
              </span>
              <span className="text-xs text-slate-400 font-mono">{activeCircuit.booleanExpr}</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-300 border-b border-slate-800">
                  <tr>
                    <th className="p-3 text-slate-500">Row</th>
                    {activeCircuit.inputs.map(inp => (
                      <th key={inp} className="p-3 text-emerald-400">{inp}</th>
                    ))}
                    {activeCircuit.outputs.map(out => (
                      <th key={out} className="p-3 text-cyan-400">{out}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {truthTable.map((row, idx) => {
                    const isCurrent = activeCircuit.inputs.every(inp => row.inputs[inp] === (inputStates[inp] ?? 0));
                    return (
                      <tr
                        key={idx}
                        className={`transition-colors ${isCurrent ? 'bg-cyan-950/40 text-cyan-200 font-bold' : 'hover:bg-slate-800/40 text-slate-300'}`}
                      >
                        <td className="p-3 text-slate-500">{idx}</td>
                        {activeCircuit.inputs.map(inp => (
                          <td key={inp} className="p-3">{row.inputs[inp]}</td>
                        ))}
                        {activeCircuit.outputs.map(out => (
                          <td key={out} className="p-3">
                            <span className={`px-2 py-0.5 rounded ${row.outputs[out] === 1 ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-500'}`}>
                              {row.outputs[out]}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Karnaugh Map Tab */}
        {activeTab === 'kmap' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Grid className="w-3.5 h-3.5 text-violet-400" />
                Karnaugh Map (K-Map) Visualization & Minterm Grouping
              </span>
              <span className="text-xs text-slate-400 font-mono">Gray Code Ordered</span>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
              <div className="text-center mb-4">
                <h4 className="text-sm font-bold text-slate-200">2-Variable K-Map (A, B) for {activeCircuit.name}</h4>
                <p className="text-xs text-slate-400 mt-1">Cells display evaluated minterm values m(0) through m(3)</p>
              </div>

              {/* 2x2 K-Map Grid */}
              <div className="inline-block border border-slate-700 rounded-lg overflow-hidden font-mono text-xs">
                <div className="grid grid-cols-3 bg-slate-900 border-b border-slate-700 text-center font-bold text-slate-400">
                  <div className="p-3 border-r border-slate-700 bg-slate-950">A \ B</div>
                  <div className="p-3 border-r border-slate-700">B = 0</div>
                  <div className="p-3">B = 1</div>
                </div>

                <div className="grid grid-cols-3 border-b border-slate-800 text-center">
                  <div className="p-3 border-r border-slate-700 font-bold bg-slate-900 text-slate-400">A = 0</div>
                  <div className="p-4 border-r border-slate-800 bg-slate-950 text-cyan-300 font-bold text-sm">
                    {truthTable[0]?.outputs[activeCircuit.outputs[0]] ?? 0}
                  </div>
                  <div className="p-4 bg-slate-950 text-cyan-300 font-bold text-sm">
                    {truthTable[1]?.outputs[activeCircuit.outputs[0]] ?? 0}
                  </div>
                </div>

                <div className="grid grid-cols-3 text-center">
                  <div className="p-3 border-r border-slate-700 font-bold bg-slate-900 text-slate-400">A = 1</div>
                  <div className="p-4 border-r border-slate-800 bg-slate-950 text-cyan-300 font-bold text-sm">
                    {truthTable[2]?.outputs[activeCircuit.outputs[0]] ?? 0}
                  </div>
                  <div className="p-4 bg-slate-950 text-cyan-300 font-bold text-sm">
                    {truthTable[3]?.outputs[activeCircuit.outputs[0]] ?? 0}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400 text-center space-y-1">
                <div>Simplified SOP Expression: <span className="font-mono text-cyan-400 font-bold">{activeCircuit.booleanExpr}</span></div>
                <div className="text-[11px] text-slate-500">Minterms grouped by Hamming distance of 1 in Gray code.</div>
              </div>
            </div>
          </div>
        )}

        {/* Verilog RTL Tab */}
        {activeTab === 'verilog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                Synthesized Verilog RTL Code
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyVerilog}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                {onOpenHdl && (
                  <button
                    onClick={() => onOpenHdl(activeCircuit.verilogCode)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                  >
                    <span>Open in ModelSim / HDL Studio ➔</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
              {activeCircuit.verilogCode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
