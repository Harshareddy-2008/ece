export type ToolCategory =
  | 'matlab'
  | 'hdl'
  | 'circuit'
  | 'digital-logic'
  | 'signal'
  | 'microcontroller'
  | 'pcb-fpga';

export type IntegrationType = 'native' | 'backend' | 'external';

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  branch: string;
  year: number; // 1, 2, 3, 4
  semester: number; // 1 to 8
  college: string;
  avatar: string;
  bookmarkedSubjects: string[];
  completedExperiments: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  category: ToolCategory;
  author: string;
  updatedAt: string;
  description?: string;
  data: any;
}

export interface SubjectModule {
  id: string;
  title: string;
  topics: string[];
  keyFormulas: string[];
}

export interface EceSubject {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  overview: string;
  modules: SubjectModule[];
  recommendedTools: ToolCategory[];
  examTopics: string[];
}

export interface Experiment {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  semester: number;
  aim: string;
  apparatus: string[];
  theory: string;
  circuitDiagramUrl?: string;
  defaultParams: Record<string, number | string>;
  paramUnits: Record<string, string>;
  observationColumns: string[];
  calculateObservations: (params: Record<string, any>) => Array<Record<string, any>>;
  graphConfig: {
    xKey: string;
    yKey: string;
    xLabel: string;
    yLabel: string;
    title: string;
  };
  vivaQuestions: Array<{
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }>;
}

export interface LogicGate {
  id: string;
  type: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'INPUT' | 'OUTPUT';
  name: string;
  x: number;
  y: number;
  inputs: (string | null)[]; // connected gate output IDs or null
  state?: boolean;
}

export interface CircuitComponent {
  id: string;
  type: 'VDC' | 'VAC' | 'Resistor' | 'Capacitor' | 'Inductor' | 'Diode' | 'NPN' | 'OpAmp' | 'Ground';
  name: string;
  value: number; // e.g. Ohms, Volts, Farads
  unit: string;
  nodeA: string;
  nodeB: string;
  nodeC?: string;
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: string;
}
