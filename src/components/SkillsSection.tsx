import React, { useState } from 'react';
import { Layers, Globe, Code, PenTool, Search, CheckCircle2, Terminal, Sparkles, Filter } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { filterSkills, SkillFilterCategory, SkillItem } from '../utils/portfolioLogic';

export function SkillsSection() {
  const { skillItems, languages } = PORTFOLIO_DATA;
  const [activeCategory, setActiveCategory] = useState<SkillFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Filter by category
  const categoryFiltered = filterSkills(skillItems, activeCategory);

  // 2. Filter by search query if any
  const displayedSkills = categoryFiltered.filter((skill) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      skill.name.toLowerCase().includes(q) ||
      skill.experienceContext.toLowerCase().includes(q) ||
      skill.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const filterTabs: { id: SkillFilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Skills', count: skillItems.length },
    {
      id: 'core_domains',
      label: 'Core Domains',
      count: skillItems.filter((s) => s.category === 'core_domains').length,
    },
    {
      id: 'design_tools',
      label: 'Design & 3D Tools',
      count: skillItems.filter((s) => s.category === 'design_tools').length,
    },
    {
      id: 'programming',
      label: 'Programming Languages',
      count: skillItems.filter((s) => s.category === 'programming').length,
    },
  ];

  return (
    <section id="skills" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            TECHNICAL TOOLING & EXPERTISE
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
            Skills & Tooling Matrix
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mt-2 max-w-2xl">
            Explore core domains, 3D design software, and programming languages applied across Arjun’s AR/VR projects and internships.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills or tools..."
            aria-label="Filter skills by keyword"
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-neutral-900 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Tabs (Segmented control per frontend-design rules) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 border border-neutral-800 rounded-xl mb-8 overflow-x-auto max-w-full">
        {filterTabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
              }`}
              aria-pressed={isActive}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-indigo-700/80 text-indigo-100' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Showing Count Status */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-6">
        <div>
          <span>Showing </span>
          <span className="font-semibold text-white font-mono">{displayedSkills.length}</span>
          <span> competencies in </span>
          <span className="text-indigo-400 font-medium">
            {filterTabs.find((t) => t.id === activeCategory)?.label}
          </span>
          {searchQuery && (
            <span> matching "{searchQuery}"</span>
          )}
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Dynamic Filtered Skills Grid */}
      {displayedSkills.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 rounded-2xl border border-neutral-800 text-neutral-400">
          <p className="text-sm">No skills found matching your search.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 px-4 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {displayedSkills.map((skill) => (
            <div
              key={skill.id}
              className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Unboxed Metadata Header */}
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-2.5">
                  <span className="text-indigo-400 font-medium uppercase tracking-wider text-[11px]">
                    {skill.categoryLabel}
                  </span>
                  <span className="font-mono text-neutral-300 font-medium">
                    {skill.level}
                  </span>
                </div>

                {/* Skill Name */}
                <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                  {skill.name}
                </h3>

                {/* Real-World Context & Experience Application */}
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  {skill.experienceContext}
                </p>
              </div>

              <div>
                {/* Proficiency Gauge Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Proficiency</span>
                    <span className="font-mono text-neutral-300 font-semibold">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>

                {/* Tag Pills unboxed */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-800/60">
                  {skill.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multilingual Fluency Section */}
      <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-neutral-800 rounded-xl">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Spoken Languages & Cultural Fluency
            </h3>
            <p className="text-xs text-neutral-400">
              Clear public speaking, technical articulation, and cross-cultural collaboration across South Asia and international teams.
            </p>
          </div>
        </div>

        {/* 4 Languages Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {languages.map((lang, i) => (
            <div key={i} className="p-4 bg-neutral-950 rounded-xl border border-neutral-800/80">
              <div className="flex justify-between items-baseline mb-1">
                <span className="font-semibold text-sm text-white">{lang.language}</span>
                <span className="text-xs font-mono text-indigo-400">{lang.level}</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-3 leading-snug">
                {lang.note}
              </p>
              {/* Subtle proficiency line */}
              <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-1 rounded-full"
                  style={{ width: `${lang.proficiency}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
