import React, { useState } from 'react';
import { X, Download, ExternalLink, FileText, CheckCircle2, Award, Briefcase, GraduationCap } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const [viewTab, setViewTab] = useState<'pdf' | 'transcript'>('pdf');
  const pdfUrl = PORTFOLIO_DATA.personal.resumePdfUrl;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div className="relative w-full max-w-4xl h-[92vh] flex flex-col bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden text-neutral-100">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 id="resume-modal-title" className="text-sm sm:text-base font-bold text-white leading-none">
                Arjun A — Curriculum Vitae
              </h2>
              <span className="text-xs text-neutral-400">
                Final-Year B.E. CSE & AR/VR Developer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setViewTab('pdf')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  viewTab === 'pdf' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                PDF View
              </button>
              <button
                type="button"
                onClick={() => setViewTab('transcript')}
                className={`px-3 py-1 rounded font-medium transition-colors ${
                  viewTab === 'transcript' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Transcript
              </button>
            </div>

            {/* Direct Download Button */}
            <a
              href={pdfUrl}
              download="Arjun_A_Resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              title="Download original PDF resume"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close resume viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-hidden relative bg-neutral-950">
          {viewTab === 'pdf' ? (
            <div className="w-full h-full flex flex-col">
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0`}
                title="Arjun A Resume Document"
                className="w-full flex-1 border-0 bg-neutral-950"
              />
              <div className="p-3 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400 px-6">
                <span>Rendering official file: <code>{pdfUrl}</code></span>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Open in external tab</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto p-6 sm:p-8 space-y-6 text-sm text-neutral-300">
              {/* Header Contact */}
              <div className="border-b border-neutral-800 pb-5">
                <h3 className="text-2xl font-bold text-white mb-1">ARJUN A</h3>
                <div className="text-xs text-indigo-400 font-semibold mb-2">
                  Final-Year Computer Science Engineering Student & AR/VR Developer
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                  <span>Coimbatore, Tamil Nadu, India</span>
                  <span>·</span>
                  <span>Phone: +91 7305715012</span>
                  <span>·</span>
                  <span>Email: 23cs012@acetcbe.edu.in / arjun4275120@gmail.com</span>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Summary
                </h4>
                <p className="leading-relaxed bg-neutral-900/60 p-4 rounded-xl border border-neutral-800">
                  {PORTFOLIO_DATA.personal.bio}
                </p>
              </div>

              {/* Experience */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                  Experience
                </h4>
                <div className="space-y-4">
                  {PORTFOLIO_DATA.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-bold text-white text-sm">{exp.role}</div>
                          <div className="text-xs text-indigo-400">{exp.company} · {exp.location}</div>
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400">{exp.period}</span>
                      </div>
                      <ul className="space-y-1 text-xs text-neutral-300">
                        {exp.points.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-400">›</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                  Key Projects
                </h4>
                <div className="space-y-3">
                  {PORTFOLIO_DATA.projects.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                      <div className="font-bold text-white text-sm mb-1">{proj.title}</div>
                      <p className="text-xs text-neutral-300 mb-2">{proj.description}</p>
                      <div className="text-[11px] font-mono text-neutral-400">
                        Tech Stack: {proj.techStack.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Achievements */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                  Education & Key Achievements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                    <div className="font-bold text-white mb-1">B.E. Computer Science & Engineering</div>
                    <div className="text-neutral-400">Akshaya College of Eng & Tech, Coimbatore</div>
                    <div className="text-neutral-500 font-mono mt-1">2020 – Present (Final Year · VII Sem Exam Candidate)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800">
                    <div className="font-bold text-white mb-1">Internship Completion Certificate</div>
                    <div className="text-neutral-400">Praya Labs (Sep 2026) · Onsite AR/VR Intern</div>
                    <div className="text-neutral-500 font-mono mt-1">Blender Digital Twin Office Space</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
