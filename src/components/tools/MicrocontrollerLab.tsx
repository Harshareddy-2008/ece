import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Bot, Cpu, Sliders, Terminal, CheckCircle2, Copy } from 'lucide-react';

interface MicrocontrollerLabProps {
  onAskAi?: (prompt: string, context?: any) => void;
}

const MCU_SKETCHES = [
  {
    id: 'blink',
    name: 'Blink with Timer & GPIO (Pin 13)',
    category: 'GPIO & Delays',
    description: 'Direct register manipulation: DDRB |= (1 << DDB5) and PORTB ^= (1 << PORTB5)',
    code: `// ATmega328P / Arduino Uno Timer & GPIO Blink
#define LED_PIN 13

void setup() {
    // Set digital pin 13 (PB5) as OUTPUT using DDRB register
    DDRB |= (1 << DDB5); 
    Serial.begin(9600);
    Serial.println("System Initialized: PB5 configured as OUTPUT.");
}

void loop() {
    // Toggle PB5 HIGH
    PORTB |= (1 << PORTB5);
    Serial.println("LED State: HIGH (Pin 13 ON)");
    delay(1000);

    // Toggle PB5 LOW
    PORTB &= ~(1 << PORTB5);
    Serial.println("LED State: LOW (Pin 13 OFF)");
    delay(1000);
}`
  },
  {
    id: 'pwm_motor',
    name: '8-Bit Fast PWM Generator (Timer 0/1)',
    category: 'PWM & Timers',
    description: 'AnalogWrite pulse-width modulation for DC motor speed or LED brightness fading',
    code: `// Fast PWM on OC0A / Pin 6
#define PWM_PIN 6

void setup() {
    pinMode(PWM_PIN, OUTPUT);
    Serial.begin(9600);
    Serial.println("Fast PWM Mode Enabled on Pin 6 (Timer0)");
}

void loop() {
    // Sweep duty cycle from 0% (0) to 100% (255)
    for (int duty = 0; duty <= 255; duty += 25) {
        analogWrite(PWM_PIN, duty);
        float dutyPercent = (duty / 255.0) * 100.0;
        Serial.print("PWM Duty Cycle: ");
        Serial.print(dutyPercent, 1);
        Serial.println("%");
        delay(200);
    }
}`
  },
  {
    id: 'adc_pot',
    name: '10-Bit ADC Analog Sensor Read',
    category: 'ADC & Sensors',
    description: 'Reads ADC channel A0 (0-1023) and calculates input voltage V = (ADC * 5.0) / 1024',
    code: `// Analog to Digital Converter (ADC) Interfacing
#define POT_PIN A0
#define THRESHOLD_LED 9

void setup() {
    Serial.begin(9600);
    pinMode(THRESHOLD_LED, OUTPUT);
    Serial.println("10-Bit Successive Approximation ADC Ready.");
}

void loop() {
    int adcValue = analogRead(POT_PIN); // 0 to 1023
    float voltage = (adcValue * 5.0) / 1024.0;

    Serial.print("ADC Raw: ");
    Serial.print(adcValue);
    Serial.print(" | Voltage: ");
    Serial.print(voltage, 2);
    Serial.println(" V");

    // Threshold check
    if (voltage > 2.5) {
        digitalWrite(THRESHOLD_LED, HIGH);
    } else {
        digitalWrite(THRESHOLD_LED, LOW);
    }
    delay(500);
}`
  },
  {
    id: 'seven_segment',
    name: 'Common Cathode 7-Segment Counter',
    category: 'Displays',
    description: 'Decodes digits 0-9 into segment lines a, b, c, d, e, f, g',
    code: `// 7-Segment Display Lookup Table
const byte segmentDigits[10] = {
    0b00111111, // 0
    0b00000110, // 1
    0b01011011, // 2
    0b01001111, // 3
    0b01100110, // 4
    0b01101101, // 5
    0b01111101, // 6
    0b00000111, // 7
    0b01111111, // 8
    0b01101111  // 9
};

void setup() {
    DDRD = 0xFF; // Pins 0-7 as output for segments
    Serial.begin(9600);
    Serial.println("7-Segment Display Controller Initialized.");
}

void loop() {
    for (int digit = 0; digit < 10; digit++) {
        PORTD = segmentDigits[digit];
        Serial.print("Displaying Digit: ");
        Serial.println(digit);
        delay(1000);
    }
}`
  }
];

export const MicrocontrollerLab: React.FC<MicrocontrollerLabProps> = ({ onAskAi }) => {
  const [selectedSketchId, setSelectedSketchId] = useState(MCU_SKETCHES[0].id);
  const [code, setCode] = useState(MCU_SKETCHES[0].code);
  const [isRunning, setIsRunning] = useState(true);
  const [potentiometerValue, setPotentiometerValue] = useState<number>(512); // ADC 0-1023
  const [ledPin13State, setLedPin13State] = useState<boolean>(false);
  const [pwmDuty, setPwmDuty] = useState<number>(128); // 0-255
  const [counterDigit, setCounterDigit] = useState<number>(0);
  const [serialOutput, setSerialOutput] = useState<string[]>(['[PORT OPEN] Baud Rate: 9600 bps. ATmega328P clock: 16.00 MHz']);

  const activeSketch = MCU_SKETCHES.find(s => s.id === selectedSketchId) || MCU_SKETCHES[0];

  const handleSelectSketch = (id: string) => {
    setSelectedSketchId(id);
    const s = MCU_SKETCHES.find(x => x.id === id);
    if (s) {
      setCode(s.code);
      setSerialOutput([`[RESET] Loaded ${s.name}...`, 'Board initialized at 16MHz.']);
    }
  };

  // Run hardware simulation tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString();

      if (selectedSketchId === 'blink') {
        setLedPin13State(prev => {
          const next = !prev;
          setSerialOutput(lines => [...lines.slice(-15), `[${timestamp}] PB5 -> ${next ? 'HIGH (LED ON)' : 'LOW (LED OFF)'}`]);
          return next;
        });
      } else if (selectedSketchId === 'pwm_motor') {
        setPwmDuty(prev => {
          const next = (prev + 30) % 256;
          const percent = ((next / 255) * 100).toFixed(0);
          setSerialOutput(lines => [...lines.slice(-15), `[${timestamp}] PWM Duty = ${next}/255 (${percent}%)`]);
          return next;
        });
      } else if (selectedSketchId === 'adc_pot') {
        const voltage = (potentiometerValue * 5.0) / 1024.0;
        setSerialOutput(lines => [...lines.slice(-15), `[${timestamp}] ADC Raw: ${potentiometerValue} | Voltage: ${voltage.toFixed(2)}V`]);
      } else if (selectedSketchId === 'seven_segment') {
        setCounterDigit(prev => {
          const next = (prev + 1) % 10;
          setSerialOutput(lines => [...lines.slice(-15), `[${timestamp}] 7-Segment Output: [ ${next} ]`]);
          return next;
        });
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isRunning, selectedSketchId, potentiometerValue]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Microcontroller & Embedded Systems Lab
            </h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              🟢 Native AVR / Arduino Emulator
            </span>
          </div>
          <p className="text-sm text-slate-400">
            Write Embedded C & Arduino code, simulate GPIO, Timers, PWM, and observe live virtual hardware breadboard outputs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onAskAi && (
            <button
              onClick={() => onAskAi(`Explain the microcontroller hardware registers and code for ${activeSketch.name}:\n\`\`\`c\n${code}\n\`\`\``, { tool: 'microcontroller', sketch: activeSketch.id })}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg shadow-sm transition-all"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI to Explain Code</span>
            </button>
          )}

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-xs rounded-lg shadow-md transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'fill-slate-950' : ''}`} />
            <span>{isRunning ? 'Pause Emulator' : 'Resume Emulator'}</span>
          </button>
        </div>
      </div>

      {/* Sketch Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {MCU_SKETCHES.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelectSketch(s.id)}
            className={`text-left p-3.5 rounded-xl border transition-all ${
              selectedSketchId === s.id
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/50'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
            }`}
          >
            <div className="font-medium text-xs text-slate-200 mb-1 flex items-center justify-between">
              <span>{s.name}</span>
              <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">
                {s.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{s.description}</p>
          </button>
        ))}
      </div>

      {/* Main Grid: Code Editor & Virtual Hardware Breadboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/70 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>firmware.ino</span>
              <span className="text-[10px] text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-900/60">AVR-GCC / C++</span>
            </div>
            <span className="text-[11px] text-slate-400">Board: Arduino Uno (ATmega328P @ 16MHz)</span>
          </div>

          <div className="relative flex-1 min-h-[380px] bg-slate-950 font-mono text-xs">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[380px] p-4 bg-transparent text-slate-200 resize-none focus:outline-none font-mono leading-relaxed selection:bg-cyan-500/20"
              style={{ tabSize: 2 }}
            />
          </div>

          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span>Flash: 32 KB | SRAM: 2 KB | EEPROM: 1 KB</span>
            <span>Clock Source: 16 MHz Crystal Oscillator</span>
          </div>
        </div>

        {/* Virtual Hardware & Serial Monitor */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Virtual Breadboard Board Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                Virtual Arduino Uno Hardware View
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 font-mono">
                {isRunning ? 'RUNNING' : 'HALTED'}
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-4 space-y-4">
              {/* LED Pin 13 Indicator */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-200 block">Digital Pin 13 (Built-in LED)</span>
                  <span className="text-[11px] text-slate-400">Port B Pin 5 (PB5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    ledPin13State
                      ? 'bg-amber-400 shadow-lg shadow-amber-400/80 animate-pulse'
                      : 'bg-slate-800 border border-slate-700'
                  }`}></span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {ledPin13State ? 'HIGH' : 'LOW'}
                  </span>
                </div>
              </div>

              {/* PWM Output Bar */}
              {selectedSketchId === 'pwm_motor' && (
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Pin 6 PWM Duty Cycle</span>
                    <span className="text-cyan-400 font-mono font-bold">{pwmDuty} / 255 ({((pwmDuty/255)*100).toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${(pwmDuty / 255) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* 7-Segment Display Component */}
              {selectedSketchId === 'seven_segment' && (
                <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-around">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-300 block">7-Segment Cathode</span>
                    <span className="text-[11px] text-slate-500">Port D Bit-field</span>
                  </div>
                  <div className="w-16 h-20 bg-slate-950 rounded-xl border border-slate-700 flex items-center justify-center font-mono text-4xl font-extrabold text-cyan-400 shadow-inner">
                    {counterDigit}
                  </div>
                </div>
              )}

              {/* Interactive Potentiometer Slider for ADC */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Potentiometer (Analog In A0)</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {potentiometerValue} ({(potentiometerValue * 5.0 / 1024).toFixed(2)} V)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1023"
                  value={potentiometerValue}
                  onChange={(e) => setPotentiometerValue(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
              </div>

              {/* Register Inspector View */}
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono space-y-1">
                <span className="text-slate-400 font-bold block mb-1">ATmega328P Register Map:</span>
                <div className="flex justify-between text-slate-400">
                  <span>DDRB: 0x20</span>
                  <span>PORTB: {ledPin13State ? '0x20' : '0x00'}</span>
                  <span>ADCSRA: 0x87</span>
                  <span>OCR0A: {pwmDuty}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UART Serial Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex-1 flex flex-col min-h-[190px]">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-semibold text-slate-200 font-mono flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                UART Serial Monitor (COM1: 9600-8-N-1)
              </span>
              <button
                onClick={() => setSerialOutput([])}
                className="text-[10px] text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800/80 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto max-h-[180px] space-y-1">
              {serialOutput.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
