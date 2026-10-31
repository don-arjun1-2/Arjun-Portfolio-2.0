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
import { RevealSection } from './components/RevealSection';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { ModelType } from './components/SpatialViewport';
import { Project } from './utils/portfolioLogic';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, switchTheme, isDark } = useTheme();
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
    <div className={`min-h-screen relative flex flex-col font-sans overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark'
        ? 'text-neutral-100 bg-neutral-950 selection:bg-cyan-500/30 selection:text-cyan-200'
        : 'text-neutral-900 bg-slate-50 selection:bg-cyan-500/20 selection:text-cyan-900'
    }`}>
      {/* Sci-Fi Cyber HUD Background Image Layer */}
      <div
        className={`fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed pointer-events-none transition-opacity duration-300 ${
          theme === 'dark' ? 'opacity-50' : 'opacity-15 invert brightness-125'
        }`}
        style={{
          backgroundImage: `url('/assets/aistudio/file_00000000e83c8208a52b2a4ba944f902_4131373d.png')`,
        }}
      />

      {/* Atmospheric gradient overlay for high contrast and legible typography */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-b from-neutral-950/80 via-neutral-950/65 to-neutral-950/90'
          : 'bg-gradient-to-b from-slate-50/90 via-slate-100/75 to-slate-50/95'
      }`} />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen pb-24 md:pb-0">
        {/* Animated Top Scroll Progress Bar */}
        <ScrollProgressBar />

        {/* 3-Zone Top Navigation */}
        <Navigation
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenContact={handleScrollToContact}
          onReplayJarvis={() => setShowJarvisWelcome(true)}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
          theme={theme}
          onToggleTheme={switchTheme}
        />

        {/* Main Content Sections with Intersection Observer Transitions */}
        <main className="flex-1">
          <RevealSection direction="up" delayMs={0} threshold={0.05}>
            <Hero
              onOpenResume={() => setIsResumeOpen(true)}
              onExploreProjects={handleScrollToProjects}
              onOpenJarvisAbout={() => setIsJarvisAboutOpen(true)}
              onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            />
          </RevealSection>

          <RevealSection direction="up" delayMs={60} threshold={0.08}>
            <ProjectsSection
              onSelectProject={(project) => setSelectedProject(project)}
              onInspect3D={handleInspect3D}
              onJarvisBrief={(project) => setJarvisBriefProject(project)}
            />
          </RevealSection>

          <RevealSection direction="up" delayMs={60} threshold={0.08}>
            <SpatialLabSection
              currentModel={activeSpatialModel}
              onModelChange={setActiveSpatialModel}
            />
          </RevealSection>

          <RevealSection direction="up" delayMs={60} threshold={0.08}>
            <ExperienceSection />
          </RevealSection>

          <RevealSection direction="up" delayMs={60} threshold={0.08}>
            <SkillsSection />
          </RevealSection>

          <RevealSection direction="up" delayMs={60} threshold={0.08}>
            <EducationSection />
          </RevealSection>

          <RevealSection direction="up" delayMs={60} threshold={0.08}>
            <ContactSection />
          </RevealSection>
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
