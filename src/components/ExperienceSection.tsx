import React, { useState } from 'react';
import { Award, Briefcase, MapPin, Calendar, CheckCircle2, FileCheck, X, ExternalLink } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { Experience } from '../utils/portfolioLogic';

export function ExperienceSection() {
  const experiences = PORTFOLIO_DATA.experiences;
  const [selectedCertificate, setSelectedCertificate] = useState<Experience | null>(null);

  return (
    <section id="experience" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      {/* Header */}
      <div className="mb-12">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
          INDUSTRY IMMERSION & TRACK RECORD
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
          Work Experience & Internships
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
          Onsite immersive computing, 3D digital twin production, and collaborative software engineering in live commercial environments.
        </p>
      </div>

      {/* Experience Timeline Grid */}
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.id}
            className="p-6 sm:p-8 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700/80 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
              <div>
                {/* Unboxed Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400 mb-1">
                  <span className="text-indigo-400 font-semibold">{exp.company}</span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    <span>{exp.location}</span>
                  </span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span>{exp.type}</span>
                </div>

                {/* Role Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {exp.role}
                </h3>
              </div>

              {/* Date & Period */}
              <div className="flex flex-col sm:items-end">
                <span className="text-xs font-mono font-medium text-neutral-300 bg-neutral-800 px-3 py-1 rounded-md border border-neutral-700">
                  {exp.period}
                </span>
                {exp.certificateAvailable && (
                  <button
                    type="button"
                    onClick={() => setSelectedCertificate(exp)}
                    className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Completion Award</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bullet points */}
            <ul className="space-y-2.5 text-sm text-neutral-300 mt-4 pt-4 border-t border-neutral-800/60">
              {exp.points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
        >
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-2xl p-6 sm:p-8 text-neutral-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close certificate modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-950 border border-indigo-800 rounded-xl">
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                  OFFICIAL RECOGNITION
                </span>
                <h3 id="cert-modal-title" className="text-xl font-bold text-white">
                  {selectedCertificate.certificateTitle}
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-sm text-neutral-300 bg-neutral-950 p-5 rounded-xl border border-neutral-800">
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Awarded To:</span>
                <span className="font-semibold text-white">Arjun A</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Issuing Company:</span>
                <span className="font-semibold text-white">{selectedCertificate.company}</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Program Track:</span>
                <span className="font-semibold text-white">{selectedCertificate.role}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-400">Completion Date:</span>
                <span className="font-mono text-neutral-200">{selectedCertificate.certificateDate}</span>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed pt-2">
                Certified for successfully completing the Onsite Junior Intern – AR/VR internship (01–30 September 2026),
                mastering real-world 3D workflows, and delivering the full Blender digital twin office environment.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
              >
                Close Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
