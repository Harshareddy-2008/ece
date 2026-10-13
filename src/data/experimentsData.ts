import { Experiment } from '../types';

export const experimentsData: Experiment[] = [
  {
    id: 'exp-pn-diode',
    title: 'V-I Characteristics of PN Junction & Zener Diode',
    subjectCode: 'EC201',
    subjectName: 'Electronic Devices and Circuits Lab',
    semester: 3,
    aim: 'To plot the forward and reverse bias V-I characteristics of a Silicon PN junction diode and determine cut-in voltage, static resistance, and dynamic resistance.',
    apparatus: ['Silicon Diode (1N4007)', 'Zener Diode (5.1V / 1N4733A)', 'Regulated DC Power Supply (0-30V)', 'Digital Multimeter / Voltmeter', 'DC Milliammeter & Microammeter', 'Resistor 1k Ohm, 1/4W', 'Connecting wires & Breadboard'],
    theory: `The current-voltage relationship of a PN junction diode is governed by Shockley's diode equation:
I = I_s * [exp(V / (eta * V_t)) - 1]
where I_s is reverse saturation current (approx 10nA for Si), V_t is thermal voltage (approx 26mV at 300K), and eta is ideality factor (1 to 2).

In forward bias:
- When applied voltage V is less than the barrier potential (Cut-in voltage V_gamma approx 0.65V to 0.7V for Silicon), current is negligibly small.
- Once V exceeds V_gamma, current increases exponentially.

In reverse bias:
- Only a tiny reverse saturation current I_s flows until the breakdown voltage is reached (Zener or Avalanche breakdown).

Parameters determined:
1. Cut-in Voltage (Knee Voltage): V_gamma approx 0.7V
2. Static Resistance: R_dc = V / I
3. Dynamic (AC) Resistance: r_ac = Delta(V) / Delta(I) = V_t / I`,
    defaultParams: {
      isZener: 0, // 0 for standard Si diode, 1 for Zener
      temperatureC: 25,
      seriesResistor: 1000, // Ohms
      maxVoltage: 5 // Volts
    },
    paramUnits: {
      isZener: 'Type (0: Si 1N4007, 1: Zener 5.1V)',
      temperatureC: 'deg C',
      seriesResistor: 'Ohms',
      maxVoltage: 'V'
    },
    observationColumns: ['Applied Voltage V_in (V)', 'Diode Voltage V_D (V)', 'Forward Current I_F (mA)', 'Static Resistance R_dc (Ohm)', 'Dynamic Resistance r_ac (Ohm)'],
    calculateObservations: (params) => {
      const isZener = Number(params.isZener) === 1;
      const R = Number(params.seriesResistor) || 1000;
      const tempK = 273.15 + (Number(params.temperatureC) || 25);
      const Vt = (1.38e-23 * tempK) / 1.6e-19; // ~0.0257 V
      const Is = 1e-11; // 10 pA
      const eta = 1.3;

      const voltages = [0, 0.2, 0.4, 0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0];
      const rows = [];

      for (const Vin of voltages) {
        // Solve Vin = Vd + Id * R
        let Vd = 0;
        let Id = 0;
        if (Vin < 0.5) {
          Vd = Vin;
          Id = Is * (Math.exp(Vd / (eta * Vt)) - 1);
        } else {
          // Newton-Raphson to solve non-linear diode loop
          Vd = 0.65;
          for (let iter = 0; iter < 12; iter++) {
            const expTerm = Math.exp(Vd / (eta * Vt));
            const f = Vin - Vd - R * Is * (expTerm - 1);
            const fPrime = -1 - (R * Is * expTerm) / (eta * Vt);
            const delta = f / fPrime;
            Vd -= delta;
            if (Math.abs(delta) < 1e-5) break;
          }
          Id = (Vin - Vd) / R;
        }

        const Id_mA = Math.max(0, Id * 1000);
        const Rdc = Id_mA > 0.001 ? (Vd / (Id_mA / 1000)) : 999999;
        const rac = Id_mA > 0.01 ? ((eta * Vt) / (Id_mA / 1000)) : 999999;

        rows.push({
          'Applied Voltage V_in (V)': Vin.toFixed(2),
          'Diode Voltage V_D (V)': Vd.toFixed(3),
          'Forward Current I_F (mA)': Id_mA.toFixed(3),
          'Static Resistance R_dc (Ohm)': Rdc > 50000 ? '> 50 k' : Rdc.toFixed(1),
          'Dynamic Resistance r_ac (Ohm)': rac > 50000 ? '> 50 k' : rac.toFixed(1),
          x: +Vd.toFixed(3),
          y: +Id_mA.toFixed(3)
        });
      }
      return rows;
    },
    graphConfig: {
      xKey: 'Diode Voltage V_D (V)',
      yKey: 'Forward Current I_F (mA)',
      xLabel: 'Diode Voltage V_D (Volts)',
      yLabel: 'Diode Current I_F (mA)',
      title: 'PN Junction Diode Forward V-I Characteristic Curve'
    },
    vivaQuestions: [
      {
        question: 'What is the physical reason for the cut-in (knee) voltage in a PN junction diode?',
        options: ['Thermal agitation', 'Built-in potential barrier created by uncompensated donor and acceptor ions', 'Resistance of metal leads', 'Reverse leakage current'],
        correctIndex: 1,
        explanation: 'During depletion layer formation, uncovered positive donor ions on the N-side and negative acceptor ions on the P-side set up a built-in potential barrier (approx 0.7V for Si) that must be overcome by the applied forward voltage.'
      },
      {
        question: 'How does temperature affect the forward V-I characteristics of a Silicon diode?',
        options: ['Cut-in voltage increases with temperature', 'Cut-in voltage decreases by approximately -2mV per degree Celsius', 'Current becomes zero', 'Resistance doubles every degree'],
        correctIndex: 1,
        explanation: 'As temperature rises, intrinsic carrier concentration increases, reducing the barrier potential at approximately -2 mV/deg C.'
      },
      {
        question: 'What is the dynamic resistance of a diode when forward current is 26 mA at room temperature (assuming eta = 1)?',
        options: ['100 Ohm', '10 Ohm', '1 Ohm', '0.1 Ohm'],
        correctIndex: 2,
        explanation: 'r_ac = eta * V_t / I_F = 26 mV / 26 mA = 1 Ohm.'
      }
    ]
  },
  {
    id: 'exp-rc-filter',
    title: 'Frequency Response of RC Low-Pass & High-Pass Filters',
    subjectCode: 'EC204',
    subjectName: 'Network Theory / Analog Electronics Lab',
    semester: 3,
    aim: 'To design passive first-order RC Low-Pass and High-Pass filters, determine the 3dB cutoff frequency (f_c), and plot the Bode magnitude and phase response.',
    apparatus: ['Function / Signal Generator (10Hz to 100kHz)', 'Dual Trace Digital Storage Oscilloscope (DSO)', 'Resistor R = 1k Ohm, 10k Ohm', 'Capacitors C = 0.1 uF, 0.01 uF', 'BNC-to-Crocodile Probes'],
    theory: `A first-order passive Low-Pass filter consists of a series resistor R and parallel capacitor C.
The voltage transfer function is:
H(j*omega) = V_out(j*omega) / V_in(j*omega) = 1 / (1 + j * omega * R * C)

Cutoff frequency (where output voltage drops to 1/sqrt(2) approx 70.7% of input):
f_c = 1 / (2 * pi * R * C)

Magnitude in decibels:
|H(f)|_dB = 20 * log10(1 / sqrt(1 + (f / f_c)^2)) = -10 * log10(1 + (f / f_c)^2)

Phase angle:
phi(f) = -arctan(f / f_c)

At f = f_c:
Gain is -3.01 dB, and phase shift is -45 degrees.
For frequencies well above f_c, the slope of the roll-off is -20 dB/decade (-6 dB/octave).`,
    defaultParams: {
      resistanceOhm: 1000,
      capacitanceUf: 0.1,
      inputAmplitudeV: 5,
      filterType: 'Low-Pass'
    },
    paramUnits: {
      resistanceOhm: 'Ohms',
      capacitanceUf: 'uF',
      inputAmplitudeV: 'V (peak)',
      filterType: 'Type (Low-Pass or High-Pass)'
    },
    observationColumns: ['Frequency f (Hz)', 'V_in (V)', 'V_out (V)', 'Gain (V_out/V_in)', 'Gain (dB)', 'Phase Shift (deg)'],
    calculateObservations: (params) => {
      const R = Number(params.resistanceOhm) || 1000;
      const C = (Number(params.capacitanceUf) || 0.1) * 1e-6;
      const Vin = Number(params.inputAmplitudeV) || 5;
      const isHPF = params.filterType === 'High-Pass';
      const fc = 1 / (2 * Math.PI * R * C);

      const freqRatios = [0.05, 0.1, 0.2, 0.5, 0.7, 1.0, 1.414, 2.0, 5.0, 10.0, 20.0, 50.0];
      return freqRatios.map((ratio) => {
        const f = Math.round(ratio * fc);
        let gainMag = 0;
        let phaseDeg = 0;

        if (!isHPF) {
          gainMag = 1 / Math.sqrt(1 + ratio * ratio);
          phaseDeg = -Math.atan(ratio) * (180 / Math.PI);
        } else {
          gainMag = ratio / Math.sqrt(1 + ratio * ratio);
          phaseDeg = 90 - Math.atan(ratio) * (180 / Math.PI);
        }

        const Vout = Vin * gainMag;
        const gainDb = 20 * Math.log10(gainMag);

        return {
          'Frequency f (Hz)': f,
          'V_in (V)': Vin.toFixed(1),
          'V_out (V)': Vout.toFixed(3),
          'Gain (V_out/V_in)': gainMag.toFixed(3),
          'Gain (dB)': gainDb.toFixed(2),
          'Phase Shift (deg)': phaseDeg.toFixed(1),
          x: f,
          y: +gainDb.toFixed(2)
        };
      });
    },
    graphConfig: {
      xKey: 'Frequency f (Hz)',
      yKey: 'Gain (dB)',
      xLabel: 'Frequency (Hz, Log scale)',
      yLabel: 'Magnitude Gain (dB)',
      title: 'Bode Magnitude Plot of RC Filter'
    },
    vivaQuestions: [
      {
        question: 'What is the definition of the 3dB cutoff frequency in an RC filter?',
        options: ['Frequency where output voltage is 0V', 'Frequency where output power drops to half of maximum (70.7% voltage)', 'Frequency where phase shift is 180 degrees', 'Resonant frequency of the capacitor'],
        correctIndex: 1,
        explanation: 'At f_c, the reactance of the capacitor equals resistance R (X_c = R). The transfer magnitude is 1/sqrt(2) = 0.707 (-3 dB), corresponding to half power (P_out = 0.5 * P_in).'
      },
      {
        question: 'What is the roll-off rate of a first-order RC filter in the stopband?',
        options: ['-40 dB/decade', '-20 dB/decade (-6 dB/octave)', '-60 dB/decade', '0 dB/decade'],
        correctIndex: 1,
        explanation: 'Each decade increase in frequency reduces the gain by a factor of 10 in a first-order pole system, which equals 20*log10(0.1) = -20 dB/decade.'
      }
    ]
  },
  {
    id: 'exp-opamp-amp',
    title: 'Inverting and Non-Inverting Op-Amp Amplifiers (LM741)',
    subjectCode: 'EC202',
    subjectName: 'Analog Integrated Circuits Lab',
    semester: 4,
    aim: 'To design and experimentally verify inverting and non-inverting operational amplifier circuits using IC LM741, measure closed-loop voltage gain, and observe virtual ground behavior.',
    apparatus: ['Operational Amplifier IC LM741', 'Dual Regulated DC Power Supply (+/-15V)', 'Signal Generator', 'Dual Channel Oscilloscope', 'Resistors: R1 = 1k, 10k; Rf = 10k, 47k, 100k Ohm', 'Breadboard & Probes'],
    theory: `An ideal operational amplifier exhibits infinite open-loop gain (A_OL -> infinity), infinite input impedance (R_in -> infinity), and zero output impedance (R_out -> 0).

1. Inverting Amplifier:
The non-inverting terminal is connected to ground. Because open loop gain is huge, the inverting terminal is held at virtual ground potential (V_- approx V_+ = 0V).
Applying KCL at the inverting node:
(V_in - 0) / R_1 + (V_out - 0) / R_f = 0
Voltage Gain: A_v = V_out / V_in = -R_f / R_1
The negative sign signifies a 180-degree phase inversion.

2. Non-Inverting Amplifier:
Input V_in is applied to the non-inverting terminal (+). Negative feedback holds V_- equal to V_in.
Voltage Gain: A_v = V_out / V_in = 1 + (R_f / R_1)
Output is in phase with input.

Gain-Bandwidth Product (GBWP):
Closed loop bandwidth BW = GBWP / |A_v| (for LM741, GBWP is typically 1 MHz).`,
    defaultParams: {
      topology: 'Inverting', // 'Inverting' or 'Non-Inverting'
      R1_kOhm: 1,
      Rf_kOhm: 10,
      Vin_peak_V: 0.5,
      Vsupply_V: 15
    },
    paramUnits: {
      topology: 'Configuration (Inverting / Non-Inverting)',
      R1_kOhm: 'kilo-Ohms',
      Rf_kOhm: 'kilo-Ohms',
      Vin_peak_V: 'V (peak)',
      Vsupply_V: '+/- V rail'
    },
    observationColumns: ['Input V_in (V)', 'Theoretical Gain', 'Practical Gain', 'V_out Observed (V)', 'Phase Difference', 'Saturation Status'],
    calculateObservations: (params) => {
      const isInverting = params.topology === 'Inverting';
      const R1 = Number(params.R1_kOhm) || 1;
      const Rf = Number(params.Rf_kOhm) || 10;
      const Vsat = (Number(params.Vsupply_V) || 15) - 1.5; // LM741 saturation drops ~1.5V below rails

      const theoGain = isInverting ? -(Rf / R1) : 1 + (Rf / R1);
      const testInputs = [0.1, 0.2, 0.5, 0.8, 1.0, 1.5, 2.0, 2.5];

      return testInputs.map((vin) => {
        let idealVout = vin * theoGain;
        let isSaturated = false;

        if (Math.abs(idealVout) >= Vsat) {
          idealVout = Math.sign(idealVout) * Vsat;
          isSaturated = true;
        }

        const practicalGain = idealVout / vin;

        return {
          'Input V_in (V)': vin.toFixed(2),
          'Theoretical Gain': theoGain.toFixed(2),
          'Practical Gain': practicalGain.toFixed(2),
          'V_out Observed (V)': idealVout.toFixed(2),
          'Phase Difference': isInverting ? '180 deg (Inverted)' : '0 deg (In Phase)',
          'Saturation Status': isSaturated ? 'Clipping (Saturated at +/-13.5V)' : 'Linear Region',
          x: vin,
          y: Math.abs(idealVout)
        };
      });
    },
    graphConfig: {
      xKey: 'Input V_in (V)',
      yKey: 'V_out Observed (V)',
      xLabel: 'Input Voltage V_in (V)',
      yLabel: 'Output Voltage |V_out| (V)',
      title: 'Op-Amp Linear Transfer Curve & Rail Saturation'
    },
    vivaQuestions: [
      {
        question: 'What is the concept of Virtual Ground in an operational amplifier?',
        options: ['The terminal is physically connected to earth ground', 'Due to infinite open loop gain and negative feedback, the differential voltage (V+ - V-) is forced to near zero without drawing current', 'The ground pin carries high AC currents', 'It is a virtual power rail created by bypass capacitors'],
        correctIndex: 1,
        explanation: 'Because V_out = A_OL * (V+ - V-) and A_OL is enormous (approx 200,000 for LM741), for finite output voltages (V+ - V-) must be within microvolts of zero. If V+ is at ground, V- is virtually at 0V.'
      },
      {
        question: 'What causes output waveform clipping in an LM741 amplifier circuit?',
        options: ['Thermal drift', 'Output voltage swing cannot exceed the DC power supply rails (V_CC+ and V_EE-)', 'Resistor tolerance', 'Offset null pin disconnected'],
        correctIndex: 1,
        explanation: 'The output stage transistors cannot drive the output beyond their supply rails, typically clipping approximately 1.5V to 2V inside the +/-15V supply voltages.'
      }
    ]
  },
  {
    id: 'exp-full-adder',
    title: 'Design & Verification of 4-Bit Ripple Carry Adder & Subtractor',
    subjectCode: 'EC202',
    subjectName: 'Digital Logic & HDL Simulation Lab',
    semester: 3,
    aim: 'To design a 1-bit full adder and cascade it to construct a 4-bit ripple carry adder/subtractor, generate the truth table, and simulate the Verilog RTL code.',
    apparatus: ['Digital IC Trainer Kit', 'IC 7486 (Quad XOR)', 'IC 7408 (Quad AND)', 'IC 7432 (Quad OR)', 'IC 7483 (4-bit Binary Full Adder)', 'Logic probes & patch cords'],
    theory: `A 1-bit Full Adder adds two input bits A and B along with an input carry Cin:
Sum = A XOR B XOR Cin
Cout = (A AND B) OR (Cin AND (A XOR B))

4-Bit Ripple Carry Adder:
By cascading 4 full adder cells, carry ripples from stage 0 to stage 3:
Stage 0: A[0], B[0], Cin -> Sum[0], C1
Stage 1: A[1], B[1], C1  -> Sum[1], C2
Stage 2: A[2], B[2], C2  -> Sum[2], C3
Stage 3: A[3], B[3], C3  -> Sum[3], Cout

2's Complement Subtraction:
When Mode M = 0: Cin = 0, B is unchanged -> Addition (A + B)
When Mode M = 1: Cin = 1, B is inverted using XOR gates (B XOR 1 = B') -> Subtraction A + B' + 1 = A - B!`,
    defaultParams: {
      mode: 'ADD', // 'ADD' or 'SUB'
      inputA: 5,
      inputB: 3
    },
    paramUnits: {
      mode: 'Operation (ADD or SUB)',
      inputA: '0 to 15 (4-bit binary)',
      inputB: '0 to 15 (4-bit binary)'
    },
    observationColumns: ['Input A (Dec / Bin)', 'Input B (Dec / Bin)', 'Mode Cin', 'Expected Sum S (Bin)', 'Calculated Result (Dec)', 'Carry Out Cout', 'Overflow Flag V'],
    calculateObservations: (params) => {
      const mode = params.mode === 'SUB' ? 1 : 0;
      const testCases = [
        { a: 3, b: 2 },
        { a: 7, b: 5 },
        { a: 9, b: 6 },
        { a: 12, b: 4 },
        { a: 15, b: 1 },
        { a: 8, b: 8 }
      ];

      return testCases.map(({ a, b }) => {
        const effectiveB = mode === 1 ? (b ^ 0b1111) : b;
        const total = a + effectiveB + mode;
        const sum4bit = total & 0b1111;
        const cout = (total >> 4) & 1;

        const aBin = a.toString(2).padStart(4, '0');
        const bBin = b.toString(2).padStart(4, '0');
        const sumBin = sum4bit.toString(2).padStart(4, '0');

        return {
          'Input A (Dec / Bin)': `${a} (${aBin})`,
          'Input B (Dec / Bin)': `${b} (${bBin})`,
          'Mode Cin': mode ? '1 (SUB)' : '0 (ADD)',
          'Expected Sum S (Bin)': sumBin,
          'Calculated Result (Dec)': mode === 1 ? a - b : a + b,
          'Carry Out Cout': cout,
          'Overflow Flag V': ((a >> 3 === (mode ? ~b : b) >> 3) && ((sum4bit >> 3) !== (a >> 3))) ? 1 : 0,
          x: a,
          y: sum4bit
        };
      });
    },
    graphConfig: {
      xKey: 'Input A (Dec / Bin)',
      yKey: 'Calculated Result (Dec)',
      xLabel: 'Input Value A',
      yLabel: 'Arithmetic Output Result',
      title: '4-Bit Ripple Carry Adder Linearity Verification'
    },
    vivaQuestions: [
      {
        question: 'What is the main bottleneck or disadvantage of a Ripple Carry Adder?',
        options: ['High power consumption', 'Carry propagation delay through cascaded full adders creates a long critical path', 'Cannot perform subtraction', 'Requires dual rail clocks'],
        correctIndex: 1,
        explanation: 'Each full adder must wait for the carry out of the previous stage before its sum and carry out can stabilize. For N bits, worst case delay is O(N). Carry Lookahead Adders (CLA) solve this.'
      },
      {
        question: 'How is 2\'s complement subtraction implemented in an adder-subtractor circuit without separate subtractor ICs?',
        options: ['By using an analog inverter', 'By XORing the B input with a mode control line M (Cin = M)', 'By swapping input wires', 'By using multiplexers only'],
        correctIndex: 1,
        explanation: 'When M = 1, XOR gates invert B (giving 1\'s complement) and feeding M = 1 into the initial carry-in adds 1, producing the 2\'s complement (B\' + 1).'
      }
    ]
  },
  {
    id: 'exp-am-mod',
    title: 'Generation & Demodulation of Amplitude Modulated (AM) Waves',
    subjectCode: 'EC301',
    subjectName: 'Communication Systems Engineering Lab',
    semester: 5,
    aim: 'To generate Amplitude Modulated (AM) Double Sideband Full Carrier (DSB-FC) waves, calculate modulation index (mu) for under, critical, and over-modulation, and demodulate using an envelope detector.',
    apparatus: ['AM Modulation and Demodulation Trainer Kit', 'Dual Trace Digital Oscilloscope (20MHz DSO)', 'AF Signal Generator (Audio frequency 1kHz)', 'RF Signal Generator (Carrier frequency 100kHz)', 'BNC to BNC probes'],
    theory: `In Amplitude Modulation, the instantaneous amplitude of a high-frequency carrier wave is varied linearly in accordance with the instantaneous amplitude of an information baseband signal m(t).

Let carrier signal: c(t) = A_c * cos(2 * pi * f_c * t)
Message signal: m(t) = A_m * cos(2 * pi * f_m * t)

Modulated wave:
s(t) = [A_c + m(t)] * cos(2 * pi * f_c * t) = A_c * [1 + mu * cos(2 * pi * f_m * t)] * cos(2 * pi * f_c * t)

Modulation Index:
mu = A_m / A_c = (V_max - V_min) / (V_max + V_min)

Classifications:
- mu < 1: Under-modulation (distortion-free envelope detection)
- mu = 1: Critical modulation (100% modulation)
- mu > 1: Over-modulation (carrier phase reversal, severe envelope distortion)

Total Transmitted Power:
P_t = P_c * (1 + mu^2 / 2), where P_c = A_c^2 / (2 * R)`,
    defaultParams: {
      carrierFreqKhz: 100,
      carrierAmpV: 4,
      messageFreqKhz: 1,
      modulationIndex: 0.5
    },
    paramUnits: {
      carrierFreqKhz: 'kHz',
      carrierAmpV: 'Volts peak',
      messageFreqKhz: 'kHz',
      modulationIndex: 'mu (0 to 1.5)'
    },
    observationColumns: ['Modulation Index mu', 'V_max (V)', 'V_min (V)', 'Carrier Power P_c (W on 50 Ohm)', 'Sideband Power P_sb (W)', 'Envelope Quality'],
    calculateObservations: (params) => {
      const Ac = Number(params.carrierAmpV) || 4;
      const R = 50; // Ohms
      const Pc = (Ac * Ac) / (2 * R);

      const indices = [0.2, 0.4, 0.6, 0.8, 1.0, 1.25, 1.5];
      return indices.map((mu) => {
        const Vmax = Ac * (1 + mu);
        const Vmin = Ac * Math.max(0, 1 - mu);
        const Pt = Pc * (1 + (mu * mu) / 2);
        const Psb = Pt - Pc;

        let quality = 'Linear envelope, clean audio';
        if (mu === 1.0) quality = '100% Maximum distortion-free power';
        if (mu > 1.0) quality = 'Over-modulated! Envelope detector clipped';

        return {
          'Modulation Index mu': mu.toFixed(2),
          'V_max (V)': Vmax.toFixed(2),
          'V_min (V)': Vmin.toFixed(2),
          'Carrier Power P_c (W on 50 Ohm)': Pc.toFixed(3),
          'Sideband Power P_sb (W)': Psb.toFixed(3),
          'Envelope Quality': quality,
          x: mu,
          y: +(Psb / Pt * 100).toFixed(1)
        };
      });
    },
    graphConfig: {
      xKey: 'Modulation Index mu',
      yKey: 'Sideband Power Efficiency (%)',
      xLabel: 'Modulation Index (mu)',
      yLabel: 'Percentage Power in Information Sidebands (%)',
      title: 'AM Sideband Power Efficiency vs Modulation Index'
    },
    vivaQuestions: [
      {
        question: 'What is the maximum theoretical power efficiency of a standard AM DSB-FC signal at 100% modulation (mu = 1)?',
        options: ['100%', '66.7%', '33.3%', '50%'],
        correctIndex: 2,
        explanation: 'At mu = 1, P_sb / P_total = (mu^2 / 2) / (1 + mu^2 / 2) = 0.5 / 1.5 = 1/3 (33.33%). The carrier consumes 66.7% of the transmitter power without conveying any message data.'
      },
      {
        question: 'What condition must be satisfied by the envelope detector RC time constant to avoid diagonal peak clipping?',
        options: ['RC = 0', '1/f_c << RC <= sqrt(1 - mu^2) / (mu * omega_m)', 'RC >> 1/f_m', 'RC must equal the carrier frequency'],
        correctIndex: 1,
        explanation: 'If RC is too large, the capacitor discharges too slowly to follow the downward slope of the modulated envelope, causing diagonal distortion.'
      }
    ]
  }
];
