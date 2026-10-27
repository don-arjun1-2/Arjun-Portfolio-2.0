import React from 'react';
import { GraduationCap, Award, Camera, Video, Compass, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export function EducationSection() {
  const { education, honors, creativeOutlets } = PORTFOLIO_DATA;

  return (
    <section id="education" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      {/* 2-Column Split: Education & Honors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        {/* Left: Academic Credentials */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            ACADEMIC FOUNDATION
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6 font-display">
            Education
          </h2>

          <div className="space-y-6">
            {education.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {item.degree}
                  </h3>
                  <span className="text-xs font-mono text-neutral-400 bg-neutral-800/80 px-2.5 py-0.5 rounded border border-neutral-700/60 shrink-0">
                    {item.period}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-indigo-400 mb-4">
                  <span>{item.institution}</span>
                  <span aria-hidden="true" className="text-neutral-700">·</span>
                  <span className="text-neutral-400">{item.location}</span>
                </div>

                <ul className="space-y-1.5 text-xs text-neutral-300">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">›</span>
                      <span className="leading-relaxed">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Honors & Key Achievements */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            AWARDS & RECOGNITION
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-6 font-display">
            Honors & Achievements
          </h2>

          <div className="space-y-6">
            {honors.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-950/60 border border-indigo-800/60 rounded-lg">
                    <Award className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="text-indigo-400 font-medium">{item.issuer}</span>
                      <span aria-hidden="true" className="text-neutral-700">·</span>
                      <span className="font-mono text-[11px]">{item.date}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed mt-3 pt-3 border-t border-neutral-800/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Creative Outlets & Hobbies */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
          CREATIVE PERSPECTIVES & SENSORY INPUT
        </div>
        <h3 className="text-xl font-bold text-white mb-6">
          Interests & Creative Outlets
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creativeOutlets.map((outlet, i) => (
            <div key={i} className="p-5 rounded-xl bg-neutral-950 border border-neutral-800/80">
              <div className="flex items-center gap-2.5 mb-2">
                {i === 0 && <Camera className="w-4 h-4 text-indigo-400" />}
                {i === 1 && <Video className="w-4 h-4 text-indigo-400" />}
                {i === 2 && <Compass className="w-4 h-4 text-indigo-400" />}
                <h4 className="text-sm font-bold text-white">{outlet.title}</h4>
              </div>
              <div className="text-[11px] text-indigo-400 font-medium mb-2">{outlet.tagline}</div>
              <p className="text-xs text-neutral-400 leading-relaxed">{outlet.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
