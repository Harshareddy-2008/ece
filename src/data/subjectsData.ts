import { EceSubject } from '../types';

export const subjectsData: EceSubject[] = [
  {
    id: 'edc',
    code: 'EC201',
    name: 'Electronic Devices and Circuits',
    semester: 3,
    credits: 4,
    overview: 'Semiconductor physics, PN junction diodes, BJT configurations, MOSFET operation, small-signal models, and bias stability.',
    recommendedTools: ['circuit', 'matlab'],
    modules: [
      {
        id: 'edc-m1',
        title: 'Semiconductor Diodes & Applications',
        topics: ['Carrier concentration & drift/diffusion currents', 'PN junction forward and reverse characteristics', 'Zener breakdown & voltage regulation', 'Half-wave and full-wave rectifiers with filters'],
        keyFormulas: [
          'Diode Equation: I = I_s * (e^(V / (eta * V_t)) - 1)',
          'Thermal Voltage: V_t = k * T / q approx 26mV at 300K',
          'Ripple Factor (HWR): r = 1 / (2 * sqrt(3) * f * R_L * C)'
        ]
      },
      {
        id: 'edc-m2',
        title: 'Bipolar Junction Transistors (BJT)',
        topics: ['CB, CE, and CC configurations & characteristics', 'DC Load Line, Q-point stabilization', 'Voltage divider bias design', 'h-parameter small signal model'],
        keyFormulas: [
          'Current Relationship: I_E = I_B + I_C, where I_C = beta * I_B + I_CEO',
          'Stability Factor: S = (1 + beta) / (1 - beta * (dI_B / dI_C))',
          'Voltage Gain (CE): A_v = -h_fe * R_L\' / h_ie'
        ]
      },
      {
        id: 'edc-m3',
        title: 'Field Effect Transistors (FET & MOSFET)',
        topics: ['JFET V-I characteristics and pinch-off voltage', 'Enhancement and Depletion MOSFETs', 'CMOS inverter DC transfer curve', 'High-frequency small-signal model'],
        keyFormulas: [
          'JFET Shockley Equation: I_D = I_DSS * (1 - V_GS / V_P)^2',
          'MOSFET Saturation Current: I_D = 0.5 * mu * C_ox * (W/L) * (V_GS - V_th)^2',
          'Transconductance: g_m = 2 * I_D / (V_GS - V_th)'
        ]
      }
    ],
    examTopics: ['Explain the thermal runaway phenomenon and derive stability factor for voltage divider bias.', 'Compare BJT and MOSFET in terms of input impedance, switching speed, and thermal stability.', 'Design a full-wave bridge rectifier with capacitor filter for 5% ripple factor.']
  },
  {
    id: 'dld',
    code: 'EC202',
    name: 'Digital Logic Design & Verilog',
    semester: 3,
    credits: 4,
    overview: 'Number systems, Boolean algebra, Karnaugh maps, combinational logic (adders, multiplexers, decoders), and sequential logic (flip-flops, counters, FSMs).',
    recommendedTools: ['digital-logic', 'hdl'],
    modules: [
      {
        id: 'dld-m1',
        title: 'Combinational Logic Synthesis',
        topics: ['Boolean theorems and De Morgan laws', 'Karnaugh Maps (2, 3, 4, 5 variables)', 'Quine-McCluskey minimization', 'Adders, Subtractors, Lookahead Carry'],
        keyFormulas: [
          'De Morgan: (A + B)\' = A\' . B\' and (A . B)\' = A\' + B\'',
          'Half Adder: Sum = A XOR B, Carry = A . B',
          'Full Adder: Sum = A XOR B XOR Cin, Cout = AB + Cin(A XOR B)'
        ]
      },
      {
        id: 'dld-m2',
        title: 'Sequential Circuits & Finite State Machines',
        topics: ['Latches vs Flip-Flops (SR, JK, D, T)', 'Master-Slave JK race-around condition', 'Synchronous & Asynchronous Up/Down Counters', 'Moore and Mealy state machine design'],
        keyFormulas: [
          'JK Flip-Flop Characteristic: Q(next) = J.Q\' + K\'.Q',
          'D Flip-Flop: Q(next) = D',
          'T Flip-Flop: Q(next) = T XOR Q'
        ]
      }
    ],
    examTopics: ['Design a 4-bit synchronous mod-12 up-counter using T flip-flops.', 'Convert a Mealy sequence detector for pattern 1011 into a Moore machine.', 'Write Verilog behavioral code for a 4-to-1 multiplexer and synthesize its gate-level netlist.']
  },
  {
    id: 'signals',
    code: 'EC203',
    name: 'Signals and Systems',
    semester: 4,
    credits: 4,
    overview: 'Continuous and discrete time signals, LTI systems, convolution, continuous Fourier transform, Laplace transform, and Z-transform.',
    recommendedTools: ['signal', 'matlab'],
    modules: [
      {
        id: 'sig-m1',
        title: 'LTI Systems & Convolution',
        topics: ['Classification of signals (energy, power, periodic)', 'Properties of LTI systems (causality, stability, linearity)', 'Continuous convolution integral', 'Discrete convolution sum'],
        keyFormulas: [
          'Convolution Integral: y(t) = integral(x(tau) * h(t - tau) d_tau)',
          'Discrete Convolution: y[n] = sum(x[k] * h[n - k])',
          'BIBO Stability: integral(|h(t)| dt) < infinity'
        ]
      },
      {
        id: 'sig-m2',
        title: 'Fourier, Laplace & Z-Transform',
        topics: ['Continuous-Time Fourier Series (CTFS)', 'Continuous-Time Fourier Transform (CTFT)', 'Laplace Transform & Region of Convergence (ROC)', 'Z-Transform & pole-zero stability mapping'],
        keyFormulas: [
          'CTFT: X(omega) = integral(x(t) * e^(-j * omega * t) dt)',
          'Laplace: X(s) = integral(x(t) * e^(-s * t) dt)',
          'Z-Transform: X(z) = sum(x[n] * z^(-n))'
        ]
      }
    ],
    examTopics: ['Determine the response of an LTI system with impulse response h(t) = e^(-2t)u(t) to an input x(t) = u(t) - u(t-2).', 'State and prove the initial and final value theorems for Laplace transform.', 'Derive the Fourier Transform of a rectangular pulse of width T and plot its sinc spectrum.']
  },
  {
    id: 'network',
    code: 'EC204',
    name: 'Network Theory and Analysis',
    semester: 3,
    credits: 3,
    overview: 'Mesh and nodal analysis, Thevenin/Norton/Maximum Power Transfer theorems, resonance circuits, transient analysis of RL/RC/RLC, and two-port parameters.',
    recommendedTools: ['circuit', 'matlab'],
    modules: [
      {
        id: 'net-m1',
        title: 'Network Theorems & Steady State Analysis',
        topics: ['Nodal and mesh analysis with dependent sources', 'Thevenin and Norton equivalence', 'Maximum Power Transfer theorem for AC circuits', 'Series and Parallel RLC resonance & Quality factor Q'],
        keyFormulas: [
          'Resonance Frequency: f_0 = 1 / (2 * pi * sqrt(L * C))',
          'Quality Factor (Series): Q = (1 / R) * sqrt(L / C) = omega_0 * L / R',
          'Max Power (AC): Z_L = Z_th^* (complex conjugate)'
        ]
      },
      {
        id: 'net-m2',
        title: 'Transient Response & Two-Port Networks',
        topics: ['First-order RL and RC step response', 'Second-order RLC transient response (damping ratio zeta)', 'Two-port parameters: Z, Y, ABCD, and h-parameters', 'Interconnection of two-port networks'],
        keyFormulas: [
          'RC Charging: v(t) = V_s * (1 - e^(-t / (R * C)))',
          'RL Decay: i(t) = I_0 * e^(-t / (L / R))',
          'Z-Parameters: V1 = z11*I1 + z12*I2, V2 = z21*I1 + z22*I2'
        ]
      }
    ],
    examTopics: ['Solve for the node voltages in a bridge circuit using matrix nodal analysis.', 'Derive the transient current expression i(t) in a series RLC circuit excited by a DC step voltage for underdamped condition.', 'Find the ABCD transmission parameters of a symmetrical T-network.']
  },
  {
    id: 'comm',
    code: 'EC301',
    name: 'Analog and Digital Communication',
    semester: 5,
    credits: 4,
    overview: 'AM, FM, PM, superheterodyne receivers, pulse modulation (PAM, PWM, PPM, PCM), digital modulation (ASK, FSK, PSK, QAM), and bit error rate analysis.',
    recommendedTools: ['signal', 'matlab'],
    modules: [
      {
        id: 'comm-m1',
        title: 'Analog Modulation Systems',
        topics: ['Double Sideband (DSB-SC) and Single Sideband (SSB-SC)', 'Frequency Modulation (FM) and Carson\'s rule', 'Superheterodyne receiver and image frequency', 'Noise figure and SNR calculations'],
        keyFormulas: [
          'AM Equation: s(t) = A_c * [1 + mu * m(t)] * cos(2*pi*f_c*t)',
          'AM Total Power: P_t = P_c * (1 + mu^2 / 2)',
          'Carson\'s Bandwidth: BW_FM = 2 * (Delta_f + f_m)'
        ]
      },
      {
        id: 'comm-m2',
        title: 'Digital Transmission & Constellations',
        topics: ['PCM, Quantization noise, and Companding (A-law, mu-law)', 'Matched filter and Inter-Symbol Interference (ISI)', 'BPSK, QPSK, 16-QAM constellation diagrams', 'Bit Error Rate (BER) in AWGN channel'],
        keyFormulas: [
          'PCM SNR: (S/N)_dB = 6.02 * n + 1.76 dB',
          'Nyquist Rate: f_s >= 2 * f_max',
          'BPSK Bit Error Probability: P_b = Q(sqrt(2 * E_b / N_0))'
        ]
      }
    ],
    examTopics: ['Explain the working of an envelope detector for AM demodulation and condition to avoid diagonal clipping.', 'Compare BPSK, QPSK, and 16-QAM in terms of bandwidth efficiency and bit error probability.', 'Explain how PCM converts analog voice to digital bitstream with derivation of SQNR.']
  },
  {
    id: 'emft',
    code: 'EC302',
    name: 'Electromagnetic Theory & Transmission Lines',
    semester: 4,
    credits: 4,
    overview: 'Vector calculus, electrostatics, magnetostatics, Maxwell equations, uniform plane waves, Poynting vector, and transmission lines / Smith chart.',
    recommendedTools: ['matlab'],
    modules: [
      {
        id: 'em-m1',
        title: 'Maxwell\'s Equations & Wave Propagation',
        topics: ['Faraday law and Ampere-Maxwell law', 'Maxwell equations in differential and integral form', 'Poynting theorem and electromagnetic power density', 'Uniform plane waves in lossless and lossy media'],
        keyFormulas: [
          'Maxwell I: div(D) = rho_v, Maxwell II: div(B) = 0',
          'Maxwell III: curl(E) = -dB/dt, Maxwell IV: curl(H) = J + dD/dt',
          'Poynting Vector: S = E x H (Watts/m^2)',
          'Intrinsic Impedance: eta = sqrt(mu / epsilon) approx 377 Ohm in free space'
        ]
      },
      {
        id: 'em-m2',
        title: 'Transmission Lines & Impedance Matching',
        topics: ['Distributed parameters R, L, G, C and telegrapher equations', 'Characteristic impedance Z0 and propagation constant gamma', 'Voltage Standing Wave Ratio (VSWR) and reflection coefficient Gamma', 'Quarter-wave transformer and stub matching using Smith Chart'],
        keyFormulas: [
          'Characteristic Impedance: Z_0 = sqrt((R + j*omega*L) / (G + j*omega*C))',
          'Reflection Coefficient: Gamma = (Z_L - Z_0) / (Z_L + Z_0)',
          'VSWR: S = (1 + |Gamma|) / (1 - |Gamma|)'
        ]
      }
    ],
    examTopics: ['Derive the wave equation for electric field in a conductive medium and define skin depth.', 'Explain quarter-wave transformer impedance matching with numerical design.', 'Use Smith chart principles to match a load of (50 + j25) Ohm to a 50 Ohm transmission line.']
  },
  {
    id: 'control',
    code: 'EC303',
    name: 'Control Systems Engineering',
    semester: 5,
    credits: 3,
    overview: 'Block diagram reduction, Mason gain formula, time-domain transient specs, Routh-Hurwitz criterion, Root Locus, Bode plots, and Nyquist stability.',
    recommendedTools: ['matlab'],
    modules: [
      {
        id: 'cs-m1',
        title: 'System Modeling & Time Domain Response',
        topics: ['Transfer functions and state space representations', 'Mason\'s Gain Formula on signal flow graphs', 'First and second order system step response', 'Peak overshoot, settling time, rise time, and steady-state error'],
        keyFormulas: [
          'Standard 2nd Order TF: T(s) = omega_n^2 / (s^2 + 2*zeta*omega_n*s + omega_n^2)',
          'Percentage Overshoot: %M_p = e^(-(pi * zeta) / sqrt(1 - zeta^2)) * 100',
          'Settling Time (2% criterion): t_s = 4 / (zeta * omega_n)'
        ]
      },
      {
        id: 'cs-m2',
        title: 'Frequency Domain & Stability',
        topics: ['Routh-Hurwitz stability criterion', 'Root Locus plotting rules and breakaway points', 'Bode Plots: Gain Margin (GM) and Phase Margin (PM)', 'Nyquist stability theorem and encirclements'],
        keyFormulas: [
          'Gain Margin: GM = -20 * log10(|G(j*omega_pc)|) dB',
          'Phase Margin: PM = 180 deg + angle(G(j*omega_gc))',
          'Nyquist: N = P - Z (enclosures = open loop poles - closed loop zeros)'
        ]
      }
    ],
    examTopics: ['Sketch the Root Locus of a system with open loop transfer function G(s)H(s) = K / [s(s+2)(s+4)].', 'Construct the asymptotic Bode magnitude and phase plots for G(s) = 50 / [s(1 + 0.1s)(1 + 0.05s)].', 'Design a lead compensator to meet a phase margin specification of 45 degrees.']
  },
  {
    id: 'micro',
    code: 'EC304',
    name: 'Microprocessors and Microcontrollers',
    semester: 5,
    credits: 4,
    overview: '8086 microprocessor architecture, 8051 microcontroller, AVR ATmega328P, ARM Cortex-M, assembly programming, timers, interrupts, and peripherals.',
    recommendedTools: ['microcontroller'],
    modules: [
      {
        id: 'mp-m1',
        title: '8086 Architecture & Assembly',
        topics: ['Bus Interface Unit (BIU) and Execution Unit (EU)', 'Segment registers and physical address calculation', 'Instruction set (MOV, ADD, JMP, CALL, INT)', 'Interrupt vector table (IVT) and 8255 PPI interfacing'],
        keyFormulas: [
          'Physical Address: Physical = (Segment Register << 4) + Offset',
          'Clock cycle duration: T = 1 / f_clk (e.g. 5MHz -> 200ns)',
          'Timer delay count = (Desired Delay) / (Machine Cycle Period)'
        ]
      },
      {
        id: 'mp-m2',
        title: '8051 & AVR Embedded C Interfacing',
        topics: ['8051 SFR memory map and bit-addressable RAM', 'AVR ATmega328P GPIO registers (DDR, PORT, PIN)', 'Timer/Counter modes (Normal, CTC, Fast PWM)', 'UART, SPI, and I2C serial communication protocols'],
        keyFormulas: [
          '8051 Machine Cycle: 12 clock cycles / crystal frequency',
          'AVR Timer Frequency: f_PWM = f_clk / (N * 256) where N is prescaler',
          'UART Baud Rate: Baud = f_osc / (16 * (UBRR + 1))'
        ]
      }
    ],
    examTopics: ['Write an assembly program for 8086 to find the largest number in an array of 10 16-bit integers.', 'Explain the pin diagram and internal memory organization of 8051 microcontroller.', 'Write an AVR embedded C program to read an analog temperature sensor via ADC and output to UART.']
  },
  {
    id: 'vlsi',
    code: 'EC401',
    name: 'VLSI Design & CMOS Technology',
    semester: 6,
    credits: 4,
    overview: 'CMOS fabrication, inverter DC characteristics, transmission gates, static and dynamic CMOS logic, layout design rules, and FPGA synthesis.',
    recommendedTools: ['hdl', 'pcb-fpga'],
    modules: [
      {
        id: 'vlsi-m1',
        title: 'CMOS Inverter & Static Logic',
        topics: ['NMOS and PMOS fabrication steps (Twin-tub, N-well)', 'Inverter switching threshold V_M and noise margins', 'Propagation delays (t_PLH, t_PHL) and RC delay models', 'Elmore delay calculation and Logical Effort method'],
        keyFormulas: [
          'Switching Threshold: V_M approx V_DD / 2 when k_n = k_p',
          'Elmore Delay: tau = sum(R_i * C_i)',
          'Logical Effort: Delay d = g * h + p (effort delay + parasitic delay)'
        ]
      },
      {
        id: 'vlsi-m2',
        title: 'VLSI Physical Design & FPGA Synthesis',
        topics: ['Lambda layout design rules & stick diagrams', 'Dynamic CMOS logic and charge sharing hazards', 'Static Timing Analysis (STA), setup time, hold time', 'FPGA architecture: LUTs, CLBs, DSP slices, and BRAM'],
        keyFormulas: [
          'Setup Time Constraint: T_clk >= T_cq + T_comb + T_setup - T_skew',
          'Hold Time Constraint: T_cq + T_comb >= T_hold + T_skew',
          'Dynamic Power: P_dyn = alpha * C_L * V_DD^2 * f_clk'
        ]
      }
    ],
    examTopics: ['Derive the noise margins NM_L and NM_H for a CMOS inverter with symmetric aspect ratios.', 'Using the method of logical effort, design a 3-stage inverter chain to drive an external load capacitance 64 times C_in.', 'Explain the causes and prevention of clock skew and race conditions in synchronous digital circuits.']
  },
  {
    id: 'dsp',
    code: 'EC402',
    name: 'Digital Signal Processing',
    semester: 6,
    credits: 4,
    overview: 'Discrete Fourier Transform (DFT), Fast Fourier Transform (FFT - Radix 2), IIR filter design (Butterworth, Chebyshev), FIR filter design (Windowing), and DSP processors.',
    recommendedTools: ['signal', 'matlab'],
    modules: [
      {
        id: 'dsp-m1',
        title: 'DFT, FFT & Circular Convolution',
        topics: ['Properties of N-point DFT', 'Circular convolution vs Linear convolution via zero-padding', 'Decimation-In-Time (DIT) Radix-2 FFT butterfly algorithms', 'Decimation-In-Frequency (DIF) FFT algorithm'],
        keyFormulas: [
          'N-point DFT: X[k] = sum(n=0 to N-1, x[n] * W_N^(k*n)), where W_N = e^(-j*2*pi/N)',
          'Radix-2 FFT Complexity: O(N * log2(N)) compared to direct DFT O(N^2)',
          'Twiddle Factor: W_N^(k + N/2) = -W_N^k'
        ]
      },
      {
        id: 'dsp-m2',
        title: 'IIR & FIR Digital Filter Design',
        topics: ['Bilinear Transformation and frequency warping', 'Analog to digital mapping: Impulse Invariance method', 'Butterworth and Chebyshev IIR filter order calculation', 'FIR filter design using Rectangular, Hamming, and Hanning windows'],
        keyFormulas: [
          'Bilinear Transform: s = (2 / T) * (1 - z^(-1)) / (1 + z^(-1))',
          'Frequency Pre-warping: Omega = (2 / T) * tan(omega * T / 2)',
          'Hamming Window: w[n] = 0.54 - 0.46 * cos(2*pi*n / (M - 1))'
        ]
      }
    ],
    examTopics: ['Compute the 8-point DFT of the sequence x[n] = {1, 2, 2, 1, 0, 0, 0, 0} using Radix-2 DIT FFT butterfly.', 'Design a digital Butterworth low-pass filter with cutoff frequency 1 kHz and sampling frequency 10 kHz using Bilinear Transformation.', 'Explain why FIR filters always have linear phase and determine the condition for symmetric impulse response.']
  },
  {
    id: 'antennas',
    code: 'EC403',
    name: 'Antennas and Wave Propagation',
    semester: 7,
    credits: 3,
    overview: 'Radiation mechanism, Hertzian dipole, half-wave dipole, antenna parameters (gain, directivity, effective aperture), antenna arrays, and radio wave propagation (ground, sky, space).',
    recommendedTools: ['matlab'],
    modules: [
      {
        id: 'ant-m1',
        title: 'Antenna Fundamentals & Dipoles',
        topics: ['Radiation resistance and radiation efficiency', 'Directivity D, Gain G, and Beam Solid Angle', 'Infinitesimal dipole & Half-wave dipole radiation patterns', 'Friis transmission equation for wireless link budget'],
        keyFormulas: [
          'Half-wave Dipole Radiation Resistance: R_rad = 73.13 Ohm',
          'Effective Aperture: A_e = (lambda^2 / (4 * pi)) * G',
          'Friis Equation: P_r = P_t * G_t * G_r * (lambda / (4 * pi * d))^2'
        ]
      },
      {
        id: 'ant-m2',
        title: 'Antenna Arrays & Wave Propagation',
        topics: ['Broadside and End-fire linear antenna arrays', 'Array Factor and pattern multiplication theorem', 'Ionospheric reflection, Maximum Usable Frequency (MUF), Critical Frequency', 'Tropospheric ducting and ground wave attenuation'],
        keyFormulas: [
          'Array Factor: AF(psi) = sin(N * psi / 2) / sin(psi / 2), where psi = k*d*cos(theta) + beta',
          'Critical Frequency: f_c = 9 * sqrt(N_max) (in Hz)',
          'MUF: f_MUF = f_c * sec(theta_i)'
        ]
      }
    ],
    examTopics: ['Derive the electric and magnetic fields in the far-zone for a half-wave dipole antenna.', 'Calculate the maximum range of a radar system and link margin using Friis formula.', 'Design a 4-element broadside array with half-wavelength spacing and calculate its null directions.']
  },
  {
    id: 'embedded',
    code: 'EC404',
    name: 'Embedded Systems and Internet of Things',
    semester: 7,
    credits: 3,
    overview: 'Real-Time Operating Systems (RTOS), task scheduling, FreeRTOS primitives, IoT communication protocols (MQTT, CoAP, BLE), sensor interfacing, and edge computing.',
    recommendedTools: ['microcontroller', 'pcb-fpga'],
    modules: [
      {
        id: 'emb-m1',
        title: 'Embedded System Architecture & RTOS',
        topics: ['Foreground/Background systems vs RTOS kernel', 'Preemptive vs cooperative multitasking', 'Rate Monotonic (RMS) and Earliest Deadline First (EDF) scheduling', 'Priority inversion problem and priority inheritance protocol'],
        keyFormulas: [
          'RMS Schedulability: U = sum(C_i / T_i) <= n * (2^(1/n) - 1)',
          'Context Switch Overhead: T_cs = Register save time + Scheduler execution + Restore',
          'Interrupt Latency: T_lat = T_hardware + T_current_isr + T_context'
        ]
      },
      {
        id: 'emb-m2',
        title: 'IoT Protocols & Hardware Interfacing',
        topics: ['MQTT publish-subscribe model, QoS levels (0, 1, 2)', 'CoAP RESTful communication over UDP', 'Bluetooth Low Energy (BLE) GATT profiles', 'Low-power sleep modes and battery lifetime calculation'],
        keyFormulas: [
          'Battery Life: Lifetime (hours) = Battery Capacity (mAh) / Average Current (mA)',
          'Average Current: I_avg = (I_active * T_active + I_sleep * T_sleep) / (T_active + T_sleep)'
        ]
      }
    ],
    examTopics: ['Explain the priority inversion problem in RTOS and how the priority ceiling protocol solves it.', 'Design an IoT temperature and vibration monitoring node using ESP32, MQTT broker, and low-power deep sleep.', 'Compare FreeRTOS semaphores, mutexes, and queues with code examples.']
  }
];
