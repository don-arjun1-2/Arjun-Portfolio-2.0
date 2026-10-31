import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  searchProjects,
  validateContactForm,
  buildMailtoUrl,
  formatPhoneNumber,
  filterSkills,
  getProficiencyDetails,
  getBootStepProgress,
  JARVIS_BOOT_STEPS,
  getJarvisProjectBrief,
  getJarvisAboutBrief,
  getInstallPlatformDetails,
  getRevealTransitionClasses,
  getInitialTheme,
  toggleTheme,
  THEME_STORAGE_KEY,
  calculateScrollProgress,
  createChatMessage,
  JARVIS_CHAT_STARTERS,
  getSoundProfile,
  SCI_FI_SOUND_PROFILES,
  Project,
  SkillItem,
} from './portfolioLogic';

const sampleProjects: Project[] = [
  {
    id: 'p1',
    title: 'ARVR Interviewer',
    tagline: 'Immersive Mock Interview Simulator',
    category: 'arvr',
    categoryLabel: 'AR/VR & Simulation',
    timeline: '2026',
    description: 'VR mock interview platform',
    highlights: ['Spatial simulation'],
    techStack: ['Blender', 'WebXR', 'Three.js'],
    role: 'Lead Developer',
    impact: 'Helps students practice interviews',
    modelType: 'headset',
  },
  {
    id: 'p2',
    title: 'AI-Powered Drone',
    tagline: 'Autonomous Observation Drone',
    category: 'ai',
    categoryLabel: 'Autonomous Systems',
    timeline: '2025',
    description: 'Intelligent aerial navigation',
    highlights: ['Computer vision'],
    techStack: ['Python', 'OpenCV', 'Embedded C'],
    role: 'Software & Navigation Lead',
    impact: 'Automated obstacle detection',
    modelType: 'drone',
  },
  {
    id: 'p3',
    title: 'Student Learning App',
    tagline: 'Collaborative Study Suite',
    category: 'mobile',
    categoryLabel: 'Mobile App',
    timeline: '2025',
    description: 'Peer collaborative learning',
    highlights: ['Study streaks'],
    techStack: ['React Native', 'TypeScript', 'Node.js'],
    role: 'Full Stack App Developer',
    impact: 'Streamlined materials',
  },
];

const sampleSkills: SkillItem[] = [
  {
    id: 's1',
    name: 'AR/VR Development',
    category: 'core_domains',
    categoryLabel: 'Core Domains',
    level: 'Specialist',
    proficiency: 95,
    experienceContext: 'Ozhli Academy & Praya Labs',
    tags: ['WebXR', 'Spatial UI'],
  },
  {
    id: 's2',
    name: 'Blender 3D Environment Design',
    category: 'design_tools',
    categoryLabel: 'Design & 3D Tools',
    level: 'Advanced',
    proficiency: 92,
    experienceContext: 'Office digital twin',
    tags: ['PBR', 'Lighting'],
  },
  {
    id: 's3',
    name: 'TypeScript & JavaScript',
    category: 'programming',
    categoryLabel: 'Programming & Languages',
    level: 'Advanced',
    proficiency: 88,
    experienceContext: 'Mobile & Web platforms',
    tags: ['React', 'Node.js'],
  },
];

test('filterProjects filters accurately by category', () => {
  const arvr = filterProjects(sampleProjects, 'arvr');
  assert.equal(arvr.length, 1);
  assert.equal(arvr[0].id, 'p1');

  const all = filterProjects(sampleProjects, 'all');
  assert.equal(all.length, 3);

  const emptyCategory = filterProjects(sampleProjects, '');
  assert.equal(emptyCategory.length, 3);

  // Filter by technology tag
  const blenderProjects = filterProjects(sampleProjects, 'all', 'Blender');
  assert.equal(blenderProjects.length, 1);
  assert.equal(blenderProjects[0].id, 'p1');

  const tsProjects = filterProjects(sampleProjects, 'all', 'TypeScript');
  assert.equal(tsProjects.length, 1);
  assert.equal(tsProjects[0].id, 'p3');

  // Filter by both category and technology tag
  const aiPython = filterProjects(sampleProjects, 'ai', 'Python');
  assert.equal(aiPython.length, 1);
  assert.equal(aiPython[0].id, 'p2');

  const aiBlender = filterProjects(sampleProjects, 'ai', 'Blender');
  assert.equal(aiBlender.length, 0);
});

test('filterSkills filters accurately by core_domains, design_tools, programming, and all', () => {
  const domains = filterSkills(sampleSkills, 'core_domains');
  assert.equal(domains.length, 1);
  assert.equal(domains[0].id, 's1');

  const tools = filterSkills(sampleSkills, 'design_tools');
  assert.equal(tools.length, 1);
  assert.equal(tools[0].id, 's2');

  const code = filterSkills(sampleSkills, 'programming');
  assert.equal(code.length, 1);
  assert.equal(code[0].id, 's3');

  const all = filterSkills(sampleSkills, 'all');
  assert.equal(all.length, 3);

  const blank = filterSkills(sampleSkills, '');
  assert.equal(blank.length, 3);
});

test('searchProjects searches across title, tech, and description', () => {
  const queryDrone = searchProjects(sampleProjects, 'drone');
  assert.equal(queryDrone.length, 1);
  assert.equal(queryDrone[0].title, 'AI-Powered Drone');

  const queryTech = searchProjects(sampleProjects, 'Blender');
  assert.equal(queryTech.length, 1);
  assert.equal(queryTech[0].id, 'p1');

  const queryEmpty = searchProjects(sampleProjects, '   ');
  assert.equal(queryEmpty.length, 3);

  const queryMismatch = searchProjects(sampleProjects, 'quantum computing');
  assert.equal(queryMismatch.length, 0);
});

test('validateContactForm checks name, email, and message length', () => {
  const valid = validateContactForm({
    name: 'Aravind',
    email: 'aravind@example.com',
    subject: 'Collaboration',
    message: 'We loved your AR/VR digital twin work and want to chat.',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);

  const invalid = validateContactForm({
    name: 'A',
    email: 'not-an-email',
    subject: '',
    message: 'short',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);
});

test('buildMailtoUrl constructs encoded mailto parameters', () => {
  const url = buildMailtoUrl('test@example.com', 'Interview Inquiry', 'Hi Arjun, great work!');
  assert.ok(url.startsWith('mailto:test@example.com?'));
  assert.ok(url.includes('Interview+Inquiry') || url.includes('Interview%20Inquiry'));
  assert.ok(url.includes('Hi+Arjun') || url.includes('Hi%20Arjun'));
});

test('formatPhoneNumber cleans phone strings for tel link', () => {
  const formatted = formatPhoneNumber('+91 7305715012');
  assert.equal(formatted.display, '+91 7305715012');
  assert.equal(formatted.tel, 'tel:+917305715012');
});

test('getProficiencyDetails returns correct tier and active segments', () => {
  const spec = getProficiencyDetails(95);
  assert.equal(spec.tier, 'Specialist');
  assert.equal(spec.activeSegments, 5);

  const adv = getProficiencyDetails(89);
  assert.equal(adv.tier, 'Advanced');
  assert.equal(adv.activeSegments, 4);

  const prof = getProficiencyDetails(85);
  assert.equal(prof.tier, 'Proficient');
  assert.equal(prof.activeSegments, 3);

  const core = getProficiencyDetails(75);
  assert.equal(core.tier, 'Core Competency');
  assert.equal(core.activeSegments, 2);
});

test('getBootStepProgress accurately calculates progression percentage', () => {
  assert.equal(getBootStepProgress(0, 4), 25);
  assert.equal(getBootStepProgress(1, 4), 50);
  assert.equal(getBootStepProgress(2, 4), 75);
  assert.equal(getBootStepProgress(3, 4), 100);
  assert.equal(getBootStepProgress(4, 4), 100);
  assert.equal(getBootStepProgress(0, 0), 100);
});

test('JARVIS_BOOT_STEPS contains authentic welcome and authentication stages', () => {
  assert.equal(JARVIS_BOOT_STEPS.length, 4);
  assert.equal(JARVIS_BOOT_STEPS[0].system, 'CORE_KERNEL');
  assert.equal(JARVIS_BOOT_STEPS[1].system, 'BIOMETRICS');
  assert.ok(JARVIS_BOOT_STEPS[1].message.includes('ARJUN A'));
  assert.ok(JARVIS_BOOT_STEPS[3].message.includes('Welcome back, Arjun'));
});

test('getJarvisProjectBrief provides custom voice narration for every project', () => {
  const arvr = getJarvisProjectBrief('arvr');
  assert.ok(arvr.voiceIntro.includes('ARVR Interviewer'));
  assert.ok(arvr.systemStatus.includes('60 FPS VR READY'));

  const praya = getJarvisProjectBrief('praya');
  assert.ok(praya.voiceIntro.includes('Praya Labs digital twin'));
  assert.equal(praya.highlights.length, 3);

  const drone = getJarvisProjectBrief('drone');
  assert.ok(drone.voiceIntro.includes('Aerial observation telemetry'));

  const mobile = getJarvisProjectBrief('mobile');
  assert.ok(mobile.voiceIntro.includes('student collaborative learning'));

  const fallback = getJarvisProjectBrief('unknown-id');
  assert.ok(fallback.voiceIntro.includes('unknown-id'));
});

test('getJarvisAboutBrief provides comprehensive vocal bio and telemetry for Arjun', () => {
  const bio = getJarvisAboutBrief();
  assert.equal(bio.identity, 'Arjun A');
  assert.ok(bio.graduationYear.includes('2026'));
  assert.ok(bio.graduationYear.includes('VII Sem'));
  assert.ok(bio.institution.includes('Akshaya'));
  assert.ok(bio.voiceScript.includes('Allow me to introduce Arjun'));
  assert.ok(bio.voiceScript.includes('VII Semester examinations'));
  assert.ok(bio.voiceScript.includes('Praya Labs'));
  assert.ok(bio.coreHighlights.length >= 4);
  assert.ok(bio.systemTelemetry.length >= 4);
});

test('getInstallPlatformDetails detects iOS, Android, and Desktop environments accurately', () => {
  const iosUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
  const iosDetails = getInstallPlatformDetails(iosUa);
  assert.equal(iosDetails.isMobile, true);
  assert.equal(iosDetails.isIos, true);
  assert.equal(iosDetails.platformName, 'iOS');
  assert.ok(iosDetails.installInstruction.includes('Safari Share'));

  const androidUa = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36';
  const androidDetails = getInstallPlatformDetails(androidUa);
  assert.equal(androidDetails.isMobile, true);
  assert.equal(androidDetails.isIos, false);
  assert.equal(androidDetails.platformName, 'Android');
  assert.ok(androidDetails.installInstruction.includes('Install App'));

  const desktopUa = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36';
  const desktopDetails = getInstallPlatformDetails(desktopUa);
  assert.equal(desktopDetails.isMobile, false);
  assert.equal(desktopDetails.platformName, 'Desktop');
});

test('getRevealTransitionClasses handles isVisible states and directions properly', () => {
  // When visible
  const visibleUp = getRevealTransitionClasses(true, 'up');
  assert.equal(visibleUp, 'opacity-100 translate-y-0 translate-x-0 scale-100');

  const visibleLeft = getRevealTransitionClasses(true, 'left');
  assert.equal(visibleLeft, 'opacity-100 translate-y-0 translate-x-0 scale-100');

  // When not visible
  const hiddenUp = getRevealTransitionClasses(false, 'up');
  assert.ok(hiddenUp.includes('opacity-0') && hiddenUp.includes('translate-y-10'));

  const hiddenDown = getRevealTransitionClasses(false, 'down');
  assert.ok(hiddenDown.includes('opacity-0') && hiddenDown.includes('-translate-y-10'));

  const hiddenLeft = getRevealTransitionClasses(false, 'left');
  assert.ok(hiddenLeft.includes('opacity-0') && hiddenLeft.includes('translate-x-10'));

  const hiddenRight = getRevealTransitionClasses(false, 'right');
  assert.ok(hiddenRight.includes('opacity-0') && hiddenRight.includes('-translate-x-10'));

  const hiddenNone = getRevealTransitionClasses(false, 'none');
  assert.equal(hiddenNone, 'opacity-0');
});

test('theme helper functions manage light/dark modes correctly', () => {
  assert.equal(THEME_STORAGE_KEY, 'arjun_portfolio_theme');

  // getInitialTheme returns saved preference or defaults to dark
  assert.equal(getInitialTheme('light'), 'light');
  assert.equal(getInitialTheme('dark'), 'dark');
  assert.equal(getInitialTheme(null), 'dark');
  assert.equal(getInitialTheme(undefined), 'dark');
  assert.equal(getInitialTheme('invalid-theme'), 'dark');

  // toggleTheme switches between light and dark
  assert.equal(toggleTheme('dark'), 'light');
  assert.equal(toggleTheme('light'), 'dark');
});

test('calculateScrollProgress accurately computes percentage and clamps between 0 and 100', () => {
  // At the very top
  assert.equal(calculateScrollProgress(0, 2000, 1000), 0);

  // Midway
  assert.equal(calculateScrollProgress(500, 2000, 1000), 50);

  // At the very bottom
  assert.equal(calculateScrollProgress(1000, 2000, 1000), 100);

  // Clamping over-scroll (e.g. rubber banding)
  assert.equal(calculateScrollProgress(1200, 2000, 1000), 100);
  assert.equal(calculateScrollProgress(-50, 2000, 1000), 0);

  // Non-scrollable page (scrollHeight <= clientHeight)
  assert.equal(calculateScrollProgress(0, 800, 800), 0);
  assert.equal(calculateScrollProgress(0, 600, 800), 0);
});

test('createChatMessage creates valid multi-turn messages and starters are populated', () => {
  const userMsg = createChatMessage('user', '  Hello JARVIS  ');
  assert.equal(userMsg.role, 'user');
  assert.equal(userMsg.content, 'Hello JARVIS');
  assert.ok(userMsg.id.startsWith('msg_'));
  assert.ok(userMsg.timestamp.length > 0);

  const assistantMsg = createChatMessage('assistant', 'I am at your service, sir.');
  assert.equal(assistantMsg.role, 'assistant');
  assert.equal(assistantMsg.content, 'I am at your service, sir.');

  assert.ok(JARVIS_CHAT_STARTERS.length >= 3);
  assert.ok(JARVIS_CHAT_STARTERS.some((s) => s.toLowerCase().includes('arjun')));
});

test('getSoundProfile provides calibrated sci-fi parameters for hum, chimes, and blips', () => {
  const lowHum = getSoundProfile('low_hum');
  assert.equal(lowHum.name, 'low_hum');
  assert.equal(lowHum.waveform, 'sine');
  assert.ok(lowHum.frequencies.includes(55)); // sub-bass hum
  assert.ok(lowHum.duration >= 1.0);

  const receiveChime = getSoundProfile('receive_chime');
  assert.equal(receiveChime.name, 'receive_chime');
  assert.ok(receiveChime.frequencies.length >= 2);
  assert.ok(receiveChime.initialGain > 0);

  const sendBlip = getSoundProfile('send_blip');
  assert.equal(sendBlip.name, 'send_blip');
  assert.equal(sendBlip.waveform, 'triangle');
});
