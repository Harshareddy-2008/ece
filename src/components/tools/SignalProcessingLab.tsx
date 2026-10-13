import React, { useState } from 'react';
import { Activity, Bot, Sliders, Play, RotateCcw, Volume2, Info, CheckCircle2 } from 'lucide-react';

interface SignalProcessingLabProps {
  onAskAi?: (prompt: string, context?: any) => void;
}

export const SignalProcessingLab: React.FC<SignalProcessingLabProps> = ({ onAskAi }) => {
  const [signalType, setSignalType] = useState<'sine' | 'square' | 'triangle' | 'sinc' | 'dual_tone'>('sine');
  const [freq, setFreq] = useState<number>(100); // Hz
  const [amplitude, setAmplitude] = useState<number>(3.0); // Volts
  const [phaseDeg, setPhaseDeg] = useState<number>(0);
  const [samplingRate, setSamplingRate] = useState<number>(1000); // Samples / sec
  const [noiseLevel, setNoiseLevel] = useState<number>(0); // 0 to 1
  const [viewDomain, setViewDomain] = useState<'both' | 'time' | 'freq'>('both');

  // Compute time domain points and FFT magnitude
  const computeSignals = () => {
    const N = 128; // samples
    const duration = 0.04; // 40 milliseconds
    const dt = duration / N;
    const timePoints: { t: number; val: number }[] = [];
    const rawValues: number[] = [];

    const radPhase = (phaseDeg * Math.PI) / 180;

    for (let i = 0; i < N; i++) {
      const t = i * dt;
      let val = 0;

      if (signalType === 'sine') {
        val = amplitude * Math.sin(2 * Math.PI * freq * t + radPhase);
      } else if (signalType === 'square') {
        val = amplitude * (Math.sin(2 * Math.PI * freq * t + radPhase) >= 0 ? 1 : -1);
      } else if (signalType === 'triangle') {
        const period = 1 / freq;
        const normalized = (t % period) / period;
        val = amplitude * (normalized < 0.5 ? 4 * normalized - 1 : 3 - 4 * normalized);
      } else if (signalType === 'sinc') {
        const shiftedT = (t - duration / 2) * 2 * Math.PI * freq;
        val = shiftedT === 0 ? amplitude : amplitude * (Math.sin(shiftedT) / shiftedT);
      } else if (signalType === 'dual_tone') {
        val = (amplitude * 0.6) * Math.sin(2 * Math.PI * freq * t) + (amplitude * 0.4) * Math.sin(2 * Math.PI * (freq * 2.5) * t);
      }

      // Add noise if specified
      if (noiseLevel > 0) {
        val += (Math.random() - 0.5) * noiseLevel * 2 * amplitude;
      }

      rawValues.push(val);
      timePoints.push({ t: +(t * 1000).toFixed(2), val: +val.toFixed(3) });
    }

    // Discrete Fourier Transform (DFT) Magnitude
    const dftPoints: { f: number; mag: number }[] = [];
    const maxK = N / 2;
    for (let k = 0; k < maxK; k++) {
      let real = 0;
      let imag = 0;
      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += rawValues[n] * Math.cos(angle);
        imag -= rawValues[n] * Math.sin(angle);
      }
      const mag = (2 * Math.sqrt(real * real + imag * imag)) / N;
      const fHz = (k / duration);
      dftPoints.push({ f: Math.round(fHz), mag: +mag.toFixed(3) });
    }

    const nyquistRate = 2 * freq;
    const isAliased = samplingRate < nyquistRate;

    return { timePoints, dftPoints, nyquistRate, isAliased };
  };

  const { timePoints, dftPoints, nyquistRate, isAliased } = computeSignals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Signal Processing & FFT Lab
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🟢 Native DSP Engine
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Synthesize continuous and discrete signals, analyze harmonic FFT spectra, and experiment with Nyquist sampling & aliasing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskAi && (
            <button
              onClick={() => onAskAi(`Explain the Nyquist-Shannon Sampling Theorem, Fourier Transform properties, and harmonic spectrum for a ${signalType} wave at ${freq} Hz.`, { tool: 'signal', signalType, freq })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI to Explain DSP</span>
            </button>
          )}

          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setViewDomain('both')}
              className={`px-3 py-1.5 rounded-md transition-all ${viewDomain === 'both' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Dual Domain
            </button>
            <button
              onClick={() => setViewDomain('time')}
              className={`px-3 py-1.5 rounded-md transition-all ${viewDomain === 'time' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              Time Domain
            </button>
            <button
              onClick={() => setViewDomain('freq')}
              className={`px-3 py-1.5 rounded-md transition-all ${viewDomain === 'freq' ? 'bg-cyan-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'}`}
            >
              FFT Spectrum
            </button>
          </div>
        </div>
      </div>

      {/* Signal Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { id: 'sine', label: 'Sinusoid (Single Tone)', desc: 'Pure fundamental frequency' },
          { id: 'square', label: 'Square Wave', desc: 'Infinite odd harmonics (1/n)' },
          { id: 'triangle', label: 'Triangular Wave', desc: 'Odd harmonics with (1/n²)' },
          { id: 'sinc', label: 'Sinc Signal', desc: 'sin(x)/x rectangular band' },
          { id: 'dual_tone', label: 'Dual Tone (DTMF)', desc: 'Two carrier frequencies' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSignalType(item.id as any)}
            className={`text-left p-3 rounded-xl border transition-all ${
              signalType === item.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <span className="font-semibold text-xs text-slate-200 block mb-0.5">{item.label}</span>
            <span className="text-[10px] text-slate-400">{item.desc}</span>
          </button>
        ))}
      </div>

      {/* Controls & Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="font-semibold text-xs text-slate-200 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Signal & Sampling Controls
            </span>
          </div>

          <div className="space-y-4">
            {/* Frequency */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Frequency (f)</span>
                <span className="text-cyan-400 font-mono font-bold">{freq} Hz</span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={freq}
                onChange={(e) => setFreq(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Amplitude */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Amplitude (A)</span>
                <span className="text-cyan-400 font-mono font-bold">{amplitude.toFixed(1)} V</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10.0"
                step="0.5"
                value={amplitude}
                onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Phase */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Phase (φ)</span>
                <span className="text-cyan-400 font-mono font-bold">{phaseDeg}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={phaseDeg}
                onChange={(e) => setPhaseDeg(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Sampling Rate */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Sampling Rate (Fs)</span>
                <span className="text-cyan-400 font-mono font-bold">{samplingRate} Sa/s</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={samplingRate}
                onChange={(e) => setSamplingRate(parseInt(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Noise */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">AWGN Noise Level</span>
                <span className="text-cyan-400 font-mono font-bold">{(noiseLevel * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.05"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Nyquist Theorem Status Box */}
          <div className={`p-3.5 rounded-xl border text-xs ${isAliased ? 'bg-rose-950/40 border-rose-500/50 text-rose-300' : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'}`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              <span>{isAliased ? '⚠️ Aliasing Distortion Detected' : '✓ Nyquist Condition Satisfied'}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Nyquist minimum rate: <span className="font-mono font-bold">{nyquistRate} Hz</span> (2 × {freq} Hz). Current Fs: <span className="font-mono font-bold">{samplingRate} Sa/s</span>.
              {isAliased && ' Frequencies fold back into baseband!'}
            </p>
          </div>
        </div>

        {/* Plots Display */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Time Domain Plot */}
          {(viewDomain === 'both' || viewDomain === 'time') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Time Domain: x(t) Oscilloscope Trace
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Span: 40 ms | Peak: {amplitude.toFixed(1)}V</span>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 h-44 flex items-center justify-center relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140">
                  {/* Grid */}
                  <line x1="30" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="2,2" />
                  <line x1="30" y1="70" x2="480" y2="70" stroke="#334155" />
                  <line x1="30" y1="120" x2="480" y2="120" stroke="#1e293b" strokeDasharray="2,2" />

                  {/* Render Polyline */}
                  {(() => {
                    const pts = timePoints.map((pt, idx) => {
                      const px = 30 + (idx / (timePoints.length - 1)) * 450;
                      const py = 70 - (pt.val / (amplitude * 1.5 || 1)) * 50;
                      return `${px},${py}`;
                    }).join(' ');

                    return (
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={pts}
                      />
                    );
                  })()}
                </svg>
              </div>
            </div>
          )}

          {/* Frequency Domain FFT Plot */}
          {(viewDomain === 'both' || viewDomain === 'freq') && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2 text-xs">
                <span className="font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  Frequency Domain: |X(f)| Discrete Fourier Transform (DFT) Magnitude Spectrum
                </span>
                <span className="text-[10px] text-slate-400 font-mono">0 to 1600 Hz</span>
              </div>

              <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 h-44 flex items-center justify-center relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140">
                  <line x1="30" y1="120" x2="480" y2="120" stroke="#334155" strokeWidth="1.5" />
                  <line x1="30" y1="20" x2="30" y2="120" stroke="#334155" strokeWidth="1.5" />

                  {/* Bars for harmonic magnitudes */}
                  {dftPoints.slice(0, 32).map((pt, idx) => {
                    const bx = 35 + idx * 13.5;
                    const maxMag = amplitude || 1;
                    const barHeight = Math.min(95, (pt.mag / maxMag) * 90);
                    const by = 120 - barHeight;
                    const isPeak = pt.mag > 0.4 * maxMag;

                    return (
                      <g key={idx}>
                        <line
                          x1={bx}
                          y1="120"
                          x2={bx}
                          y2={by}
                          stroke={isPeak ? '#a855f7' : '#475569'}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        {isPeak && (
                          <circle cx={bx} cy={by} r="3" fill="#c084fc" />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
