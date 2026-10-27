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
}

export function filterProjects(projects: Project[], category: string): Project[] {
  if (!category || category === 'all') {
    return projects;
  }
  return projects.filter((p) => p.category === category);
}

export function filterSkills(skills: SkillItem[], category: string): SkillItem[] {
  if (!category || category === 'all') {
    return skills;
  }
  return skills.filter((s) => s.category === category);
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
