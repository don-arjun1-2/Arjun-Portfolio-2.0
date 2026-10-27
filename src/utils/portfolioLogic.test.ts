import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterProjects,
  searchProjects,
  validateContactForm,
  buildMailtoUrl,
  formatPhoneNumber,
  filterSkills,
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
