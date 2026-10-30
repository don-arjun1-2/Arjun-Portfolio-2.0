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
import { JarvisWelcomeOverlay } from './components/JarvisWelcomeOverlay';
import { JarvisProjectBriefModal } from './components/JarvisProjectBriefModal';
import { JarvisAboutModal } from './components/JarvisAboutModal';
import { MobileInstallModal } from './components/MobileInstallModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { ModelType } from './components/SpatialViewport';
import { Project } from './utils/portfolioLogic';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [jarvisBriefProject, setJarvisBriefProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isJarvisAboutOpen, setIsJarvisAboutOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [showJarvisWelcome, setShowJarvisWelcome] = useState(true);
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

  const handleScrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 bg-neutral-950 overflow-x-hidden">
      {/* Sci-Fi Cyber HUD Background Image Layer */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url('/assets/aistudio/file_00000000e83c8208a52b2a4ba944f902_4131373d.png')`,
        }}
      />

      {/* Atmospheric gradient overlay for high contrast and legible typography */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/65 to-neutral-950/90 pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen pb-24 md:pb-0">
        {/* 3-Zone Top Navigation */}
        <Navigation
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenContact={handleScrollToContact}
          onReplayJarvis={() => setShowJarvisWelcome(true)}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
        />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero
            onOpenResume={() => setIsResumeOpen(true)}
            onExploreProjects={handleScrollToProjects}
            onOpenJarvisAbout={() => setIsJarvisAboutOpen(true)}
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          />

        <ProjectsSection
          onSelectProject={(project) => setSelectedProject(project)}
          onInspect3D={handleInspect3D}
          onJarvisBrief={(project) => setJarvisBriefProject(project)}
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
        onTriggerJarvisBrief={(project) => setJarvisBriefProject(project)}
      />

      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* J.A.R.V.I.S. Project Voice Briefing Modal */}
      {jarvisBriefProject && (
        <JarvisProjectBriefModal
          project={jarvisBriefProject}
          onClose={() => setJarvisBriefProject(null)}
          onInspect3D={handleInspect3D}
        />
      )}

      {/* J.A.R.V.I.S. About Arjun Voice Briefing Modal */}
      <JarvisAboutModal
        isOpen={isJarvisAboutOpen}
        onClose={() => setIsJarvisAboutOpen(false)}
        onExploreProjects={handleScrollToProjects}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Gemini-3.8-Live Real-Time Voice Conversation Modal */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      {/* J.A.R.V.I.S. Welcome Cinematic Entry Animation */}
      {showJarvisWelcome && (
        <JarvisWelcomeOverlay onComplete={() => setShowJarvisWelcome(false)} />
      )}

      {/* Mobile Application Install Modal (PWA) */}
      <MobileInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Floating Mobile Bottom Navigation Dock */}
      <MobileBottomNav
        onScrollTo={handleScrollToSection}
        onOpenJarvis={() => setIsJarvisAboutOpen(true)}
        onOpenInstall={() => setIsInstallModalOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
      />
      </div>
    </div>
  );
}
