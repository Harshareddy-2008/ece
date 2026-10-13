/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentProfile, ToolCategory, ProjectItem } from './types';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { ToolsHub } from './components/tools/ToolsHub';
import { SubjectPortal } from './components/portal/SubjectPortal';
import { VirtualLabSuite } from './components/experiments/VirtualLabSuite';
import { ProjectStudio } from './components/workspace/ProjectStudio';
import { AiAssistant } from './components/ai/AiAssistant';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';

const DEFAULT_STUDENT: StudentProfile = {
  id: 'std-101',
  name: 'Aryan V. Sharma',
  rollNumber: '22ECE048',
  email: 'aryan.ece@institute.edu',
  branch: 'ECE',
  year: 2,
  semester: 4,
  college: 'National Institute of Technology',
  avatar: '',
  bookmarkedSubjects: ['edc', 'dld', 'signals'],
  completedExperiments: ['exp-pn-diode', 'exp-rc-filter']
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeTool, setActiveTool] = useState<ToolCategory>('matlab');
  const [student, setStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ece_labhub_student');
    return saved ? JSON.parse(saved) : DEFAULT_STUDENT;
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiContext, setAiContext] = useState<any>(null);

  const handleSaveStudent = (updated: StudentProfile) => {
    setStudent(updated);
    localStorage.setItem('ece_labhub_student', JSON.stringify(updated));
  };

  const handleSelectTool = (tool: ToolCategory) => {
    setActiveTool(tool);
    setActiveTab('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAi = (prompt: string, context?: any) => {
    setAiPrompt(prompt);
    setAiContext(context);
    setActiveTab('ai');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (project: ProjectItem) => {
    setActiveTool(project.category);
    setActiveTab('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGlobalSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('matlab') || q.includes('matrix') || q.includes('octave')) {
      handleSelectTool('matlab');
    } else if (q.includes('verilog') || q.includes('hdl') || q.includes('modelsim') || q.includes('vhdl')) {
      handleSelectTool('hdl');
    } else if (q.includes('circuit') || q.includes('spice') || q.includes('bjt') || q.includes('opamp')) {
      handleSelectTool('circuit');
    } else if (q.includes('logic') || q.includes('gate') || q.includes('kmap') || q.includes('truth')) {
      handleSelectTool('digital-logic');
    } else if (q.includes('signal') || q.includes('fft') || q.includes('fourier') || q.includes('nyquist')) {
      handleSelectTool('signal');
    } else if (q.includes('microcontroller') || q.includes('arduino') || q.includes('avr') || q.includes('gpio')) {
      handleSelectTool('microcontroller');
    } else if (q.includes('pcb') || q.includes('fpga') || q.includes('impedance')) {
      handleSelectTool('pcb-fpga');
    } else if (q.includes('experiment') || q.includes('lab') || q.includes('viva')) {
      setActiveTab('experiments');
    } else {
      setActiveTab('subjects');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        student={student}
        onOpenProfile={() => setIsAuthOpen(true)}
        onGlobalSearch={handleGlobalSearch}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <MainDashboard
            student={student}
            onSelectTool={handleSelectTool}
            onNavigateTab={setActiveTab}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'tools' && (
          <ToolsHub
            initialTool={activeTool}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'subjects' && (
          <SubjectPortal
            onOpenTool={handleSelectTool}
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'experiments' && (
          <VirtualLabSuite
            onAskAi={handleAskAi}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectStudio
            onOpenProject={handleOpenProject}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistant
            initialPrompt={aiPrompt}
            context={aiContext}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Student Profile / Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentProfile={student}
        onSaveProfile={handleSaveStudent}
      />
    </div>
  );
}
