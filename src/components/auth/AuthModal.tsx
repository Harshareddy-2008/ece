import React, { useState } from 'react';
import { StudentProfile } from '../../types';
import { User, X, Check, GraduationCap, Building2, BookOpen } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: StudentProfile;
  onSaveProfile: (profile: StudentProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentProfile, onSaveProfile }) => {
  const [name, setName] = useState(currentProfile.name);
  const [rollNumber, setRollNumber] = useState(currentProfile.rollNumber);
  const [email, setEmail] = useState(currentProfile.email);
  const [branch, setBranch] = useState(currentProfile.branch);
  const [year, setYear] = useState(currentProfile.year);
  const [semester, setSemester] = useState(currentProfile.semester);
  const [college, setCollege] = useState(currentProfile.college);
  const [mode, setMode] = useState<'profile' | 'login' | 'register'>('profile');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StudentProfile = {
      ...currentProfile,
      name,
      rollNumber,
      email,
      branch,
      year,
      semester,
      college
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Student Academic Profile</h3>
            <p className="text-xs text-slate-400">Personalize curriculum, experiments, and project workspace</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Roll / Registration No.</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">College / Institute Name</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Engineering Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="ECE">ECE (Electronics & Comm)</option>
                <option value="EEE">EEE (Electrical & Electronics)</option>
                <option value="EIE">EIE (Electronics & Instru)</option>
                <option value="CSE">CSE / IoT / Robotics</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Academic Year</label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value={1}>1st Year (Freshman)</option>
                <option value={2}>2nd Year (Sophomore)</option>
                <option value={3}>3rd Year (Junior)</option>
                <option value={4}>4th Year (Senior)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Active Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20"
            >
              Save Student Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
