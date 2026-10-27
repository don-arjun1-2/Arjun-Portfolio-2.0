import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { ProjectsSection } from './components/ProjectsSection';
import { SpatialLabSection } from './components/SpatialLabSection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectModal } from './components/ProjectModal';
import { ResumeModal } from './components/ResumeModal';
import { ModelType } from './components/SpatialViewport';
import { Project } from './utils/portfolioLogic';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeSpatialModel, setActiveSpatialModel] = useState<ModelType>('headset');

  const handleInspect3D = (model: ModelType) => {
    setActiveSpatialModel(model);
    const labEl = document.getElementById('spatial-lab');
    if (labEl) {
      labEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToProjects = () => {
    const projEl = document.getElementById('projects');
    if (projEl) {
      projEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 3-Zone Top Navigation */}
      <Navigation
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenContact={handleScrollToContact}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onOpenResume={() => setIsResumeOpen(true)}
          onExploreProjects={handleScrollToProjects}
          onSelectModel={setActiveSpatialModel}
        />

        <ProjectsSection
          onSelectProject={(project) => setSelectedProject(project)}
          onInspect3D={handleInspect3D}
        />

        <SpatialLabSection
          currentModel={activeSpatialModel}
          onModelChange={setActiveSpatialModel}
        />

        <ExperienceSection />

        <SkillsSection />

        <EducationSection />

        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onOpenResume={() => setIsResumeOpen(true)} />

      {/* Modals */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onInspect3D={handleInspect3D}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />
    </div>
  );
}
