export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'arvr' | 'ai' | 'mobile' | 'blender';
  categoryLabel: string;
  timeline: string;
  description: string;
  highlights: string[];
  techStack: string[];
  role: string;
  impact: string;
  modelType?: 'headset' | 'drone' | 'office';
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  type: string;
  location: string;
  points: string[];
  certificateAvailable?: boolean;
  certificateTitle?: string;
  certificateDate?: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SkillFilterCategory = 'all' | 'core_domains' | 'design_tools' | 'programming';

export interface SkillItem {
  id: string;
  name: string;
  category: 'core_domains' | 'design_tools' | 'programming';
  categoryLabel: string;
  level: string;
  proficiency: number;
  experienceContext: string;
  tags: string[];
  iconName?: string;
}

export function filterProjects(
  projects: Project[],
  category: string,
  selectedTech: string | null = null
): Project[] {
  let result = projects;

  if (category && category !== 'all') {
    result = result.filter((p) => p.category === category);
  }

  if (selectedTech && selectedTech.trim() !== '') {
    const targetTech = selectedTech.trim().toLowerCase();
    result = result.filter((p) =>
      p.techStack.some((t) => t.toLowerCase() === targetTech)
    );
  }

  return result;
}

export function filterSkills(skills: SkillItem[], category: string): SkillItem[] {
  if (!category || category === 'all') {
    return skills;
  }
  return skills.filter((s) => s.category === category);
}

export interface ProficiencyDetails {
  tier: string;
  stageLabel: string;
  activeSegments: number; // 1 to 5
}

export function getProficiencyDetails(percentage: number): ProficiencyDetails {
  if (percentage >= 92) {
    return {
      tier: 'Specialist',
      stageLabel: 'Production Mastery',
      activeSegments: 5,
    };
  }
  if (percentage >= 88) {
    return {
      tier: 'Advanced',
      stageLabel: 'High Autonomous Capability',
      activeSegments: 4,
    };
  }
  if (percentage >= 82) {
    return {
      tier: 'Proficient',
      stageLabel: 'Solid Implementation',
      activeSegments: 3,
    };
  }
  return {
    tier: 'Core Competency',
    stageLabel: 'Foundational Application',
    activeSegments: 2,
  };
}

export function searchProjects(projects: Project[], query: string): Project[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return projects;

  return projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(cleanQuery) ||
      p.tagline.toLowerCase().includes(cleanQuery) ||
      p.description.toLowerCase().includes(cleanQuery) ||
      p.techStack.some((t) => t.toLowerCase().includes(cleanQuery))
    );
  });
}

export function validateContactForm(payload: ContactPayload): {
  isValid: boolean;
  errors: Partial<Record<keyof ContactPayload, string>>;
} {
  const errors: Partial<Record<keyof ContactPayload, string>> = {};

  if (!payload.name || payload.name.trim().length < 2) {
    errors.name = 'Please provide your name (at least 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!payload.email || !emailRegex.test(payload.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!payload.message || payload.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildMailtoUrl(email: string, subject: string, body: string): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  return `mailto:${email}${qs ? '?' + qs : ''}`;
}

export function formatPhoneNumber(raw: string): { display: string; tel: string } {
  const cleaned = raw.replace(/[^\d+]/g, '');
  return {
    display: raw,
    tel: `tel:${cleaned}`,
  };
}

export interface JarvisBootStep {
  step: number;
  system: string;
  message: string;
  code: string;
  status: 'ONLINE' | 'ACTIVE' | 'CALIBRATED' | 'READY';
}

export const JARVIS_BOOT_STEPS: JarvisBootStep[] = [
  {
    step: 1,
    system: 'CORE_KERNEL',
    message: 'Establishing neural telemetry & quantum bus links...',
    code: 'SYS_INIT_0x7F',
    status: 'ONLINE',
  },
  {
    step: 2,
    system: 'BIOMETRICS',
    message: 'Biometric authorization verified. Identity: ARJUN A.',
    code: 'BIO_AUTH_2026',
    status: 'ACTIVE',
  },
  {
    step: 3,
    system: 'SPATIAL_ENGINE',
    message: 'Blender 3D pipelines, WebXR shaders & digital twins loaded.',
    code: 'GL_XR_PIPELINE',
    status: 'CALIBRATED',
  },
  {
    step: 4,
    system: 'JARVIS_PROTOCOL',
    message: '"Welcome back, Arjun. All systems are operational and primed."',
    code: 'JARVIS_VOICE_SYNC',
    status: 'READY',
  },
];

export function getBootStepProgress(stepIndex: number, totalSteps: number): number {
  if (totalSteps <= 0) return 100;
  return Math.min(100, Math.round(((stepIndex + 1) / totalSteps) * 100));
}

export interface JarvisProjectBrief {
  projectId: string;
  voiceIntro: string;
  technicalSummary: string;
  highlights: string[];
  systemStatus: string;
}

export const JARVIS_PROJECT_BRIEFS: Record<string, JarvisProjectBrief> = {
  arvr: {
    projectId: 'arvr',
    voiceIntro:
      'Accessing ARVR Interviewer chamber schematics. An immersive virtual reality mock interview platform designed to simulate realistic corporate scenarios, evaluate spatial eye contact, and build interview poise.',
    technicalSummary:
      'Engineered with Blender 3D acoustic environments and WebXR real-time gaze feedback loops.',
    highlights: ['Spatial eye contact telemetry', 'Blender corporate acoustics', 'Multi-domain question banks'],
    systemStatus: 'CHAMBER ONLINE · 60 FPS VR READY',
  },
  praya: {
    projectId: 'praya',
    voiceIntro:
      'Loading Praya Labs digital twin telemetry. A millimeter-accurate 1:1 architectural replication of the Praya Labs engineering facility, featuring baked global illumination and WebGL spatial navigation.',
    technicalSummary:
      'Modeled to physical scale with optimized PBR materials and interactive inspection beacons.',
    highlights: ['Millimeter-accurate 1:1 scale', 'Baked global illumination', 'Certified onsite project delivery'],
    systemStatus: 'TWIN SYNCHRONIZED · PBR SHADERS ACTIVE',
  },
  drone: {
    projectId: 'drone',
    voiceIntro:
      'Aerial observation telemetry online. An autonomous quad-rotor drone system engineered with Python and OpenCV for real-time obstacle recognition and spatial path planning.',
    technicalSummary:
      'Integrates real-time video feeds with PID motor stabilization and waypoint guidance.',
    highlights: ['Real-time obstacle avoidance', 'OpenCV telemetry feed', 'Autonomous return-to-home'],
    systemStatus: 'AERIAL SENSORS PRIMED · GPS LOCKED',
  },
  mobile: {
    projectId: 'mobile',
    voiceIntro:
      'Initializing student collaborative learning network. A cross-platform mobile application built with React Native and TypeScript for peer academic collaboration.',
    technicalSummary:
      'Features offline study streak sync, shared question repositories, and real-time discussion channels.',
    highlights: ['Cross-platform mobile architecture', 'Offline-first sync', 'Collaborative study streaks'],
    systemStatus: 'DATA SYNC OPERATIONAL · 99.8% UPTIME',
  },
};

export function getJarvisProjectBrief(projectId: string): JarvisProjectBrief {
  return (
    JARVIS_PROJECT_BRIEFS[projectId] || {
      projectId,
      voiceIntro: `Analyzing system architecture for ${projectId}. All engineering parameters calibrated and ready for review.`,
      technicalSummary: 'Optimized full-stack software architecture with modular component hierarchy.',
      highlights: ['Production-ready code', 'High test coverage', 'Scalable design'],
      systemStatus: 'SYSTEM ONLINE',
    }
  );
}

export interface JarvisAboutBrief {
  identity: string;
  status: string;
  location: string;
  institution: string;
  graduationYear: string;
  voiceScript: string;
  coreHighlights: string[];
  systemTelemetry: {
    label: string;
    value: string;
  }[];
}

export const JARVIS_ABOUT_BRIEF: JarvisAboutBrief = {
  identity: 'Arjun A',
  status: 'ONLINE · FOCUSED',
  location: 'Coimbatore, Tamil Nadu, India',
  institution: 'Akshaya College of Engineering and Technology',
  graduationYear: '2026 (Final Year · VII Sem Exam Candidate)',
  voiceScript:
    'Allow me to introduce Arjun. Arjun is a final-year Computer Science Engineering student at Akshaya College of Engineering and Technology in Coimbatore, currently preparing for his VII Semester examinations. He specializes in AR and VR development, photorealistic 3D digital twins modeled in Blender, and autonomous systems with computer vision. With verified industry internships delivering millimeter-accurate digital twins at Praya Labs and interactive VR chambers at Ozhli Academy, Arjun bridges spatial computing, software engineering, and hardware telemetry into intuitive real-world solutions.',
  coreHighlights: [
    'Final Year B.E. CSE (VII Semester Exam Candidate)',
    'AR/VR Development & WebXR Shaders',
    '1:1 Scale Photorealistic Digital Twins',
    'Autonomous Drone Vision (Python/OpenCV)',
    'Verified Industry Internships (Praya Labs, Novitech, Ozhli)',
  ],
  systemTelemetry: [
    { label: 'ACADEMIC STANDING', value: 'Final Year · Semester VII Exam Candidate' },
    { label: 'DISCIPLINE', value: 'B.E. Computer Science & Engineering' },
    { label: 'SPECIALIZATION', value: 'Spatial Computing & 3D Interactive Web' },
    { label: 'COGNITIVE FOCUS', value: 'Blender 4.x, Three.js, WebXR, TypeScript' },
    { label: 'FLUENCY', value: 'Tamil, English, Hindi, Malayalam' },
  ],
};

export function getJarvisAboutBrief(): JarvisAboutBrief {
  return JARVIS_ABOUT_BRIEF;
}

export interface MobilePlatformDetails {
  isMobile: boolean;
  isIos: boolean;
  platformName: 'iOS' | 'Android' | 'Desktop';
  installInstruction: string;
}

export function getInstallPlatformDetails(userAgent: string): MobilePlatformDetails {
  const isIos = /iPhone|iPad|iPod/i.test(userAgent);
  const isAndroid = /Android/i.test(userAgent);
  const isMobile = isIos || isAndroid || /webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isIos) {
    return {
      isMobile: true,
      isIos: true,
      platformName: 'iOS',
      installInstruction: "Tap the Safari Share button and choose 'Add to Home Screen'.",
    };
  }

  if (isAndroid) {
    return {
      isMobile: true,
      isIos: false,
      platformName: 'Android',
      installInstruction: "Tap 'Install App' or Chrome menu > 'Install application'.",
    };
  }

  return {
    isMobile: false,
    isIos: false,
    platformName: 'Desktop',
    installInstruction: 'Click the install icon in your browser address bar to install.',
  };
}

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export function getRevealTransitionClasses(isVisible: boolean, direction: RevealDirection = 'up'): string {
  if (isVisible) {
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  }

  switch (direction) {
    case 'up':
      return 'opacity-0 translate-y-10 scale-[0.98]';
    case 'down':
      return 'opacity-0 -translate-y-10 scale-[0.98]';
    case 'left':
      return 'opacity-0 translate-x-10 scale-[0.98]';
    case 'right':
      return 'opacity-0 -translate-x-10 scale-[0.98]';
    case 'none':
    default:
      return 'opacity-0';
  }
}

export type ThemeMode = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'arjun_portfolio_theme';

export function getInitialTheme(savedTheme?: string | null): ThemeMode {
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }
  return 'dark'; // Cyber HUD dark mode by default
}

export function toggleTheme(current: ThemeMode): ThemeMode {
  return current === 'dark' ? 'light' : 'dark';
}

/**
 * Calculates scroll progression percentage (0 to 100) based on scroll position and scrollable height.
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return 0;
  const progress = (scrollTop / maxScroll) * 100;
  return Math.min(100, Math.max(0, Math.round(progress * 10) / 10));
}



