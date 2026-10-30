import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Copy, ExternalLink, MessageSquare } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { validateContactForm, buildMailtoUrl, ContactPayload } from '../utils/portfolioLogic';

export function ContactSection() {
  const { personal } = PORTFOLIO_DATA;
  const [formData, setFormData] = useState<ContactPayload>({
    name: '',
    email: '',
    subject: 'Inquiry regarding AR/VR or Software Role',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactPayload, string>>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateContactForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    // Persist to Firestore database
    try {
      import('../lib/firebase').then(async ({ db, auth }) => {
        const { collection, addDoc } = await import('firebase/firestore');
        addDoc(collection(db, 'inquiries'), {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          senderUid: auth.currentUser?.uid || 'anonymous',
          createdAt: new Date().toISOString(),
        }).catch((err) => console.warn('Inquiry persistence warning:', err));
      });
    } catch (e) {
      console.warn('Firebase inquiry error:', e);
    }

    // Trigger direct mailto client
    const mailtoUrl = buildMailtoUrl(
      personal.emails.primary,
      formData.subject,
      `From: ${formData.name} (${formData.email})\n\n${formData.message}`
    );
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 px-6 max-w-7xl mx-auto border-t border-neutral-900">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Direct Contact Info & Communication Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              OPEN FOR AR/VR & SOFTWARE ROLES
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Let's Connect & Collaborate
            </h2>
            <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
              Actively seeking full-time opportunities, graduate engineering roles, and immersive AR/VR project collaborations.
            </p>
          </div>

          <div className="space-y-3">
            {/* Primary Email */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 bg-neutral-800 rounded-lg shrink-0">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-neutral-400 font-medium">College Email (Primary)</div>
                  <a
                    href={`mailto:${personal.emails.primary}`}
                    className="text-xs font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
                  >
                    {personal.emails.primary}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(personal.emails.primary, 'primary-email')}
                className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors shrink-0"
                aria-label="Copy primary email"
                title="Copy email"
              >
                {copiedField === 'primary-email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Secondary Email */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 bg-neutral-800 rounded-lg shrink-0">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="truncate">
                  <div className="text-[11px] text-neutral-400 font-medium">Personal Email</div>
                  <a
                    href={`mailto:${personal.emails.secondary}`}
                    className="text-xs font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
                  >
                    {personal.emails.secondary}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(personal.emails.secondary, 'secondary-email')}
                className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors shrink-0"
                aria-label="Copy personal email"
                title="Copy email"
              >
                {copiedField === 'secondary-email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Phone */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 bg-neutral-800 rounded-lg shrink-0">
                  <Phone className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[11px] text-neutral-400 font-medium">Direct Telephone</div>
                  <a
                    href={`tel:${personal.phone.replace(/[^\d+]/g, '')}`}
                    className="text-xs font-semibold text-white hover:text-indigo-400 transition-colors block"
                  >
                    {personal.phone}
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(personal.phone, 'phone')}
                className="p-2 text-neutral-400 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors shrink-0"
                aria-label="Copy phone number"
                title="Copy phone"
              >
                {copiedField === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Location */}
            <div className="p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center gap-3">
              <div className="p-2.5 bg-neutral-800 rounded-lg shrink-0">
                <MapPin className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <div className="text-[11px] text-neutral-400 font-medium">Location</div>
                <div className="text-xs font-semibold text-white">{personal.location}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Message Composer */}
        <div className="lg:col-span-7 bg-neutral-900/80 p-6 sm:p-8 rounded-2xl border border-neutral-800">
          <h3 className="text-xl font-bold text-white mb-1">
            Send a Direct Message
          </h3>
          <p className="text-xs text-neutral-400 mb-6">
            Fill out the brief note below to start a conversation or schedule an interview.
          </p>

          {submitted && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Opening your email client with your drafted message. Thank you for reaching out!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-neutral-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priyan Sharma"
                  className="w-full px-3.5 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                />
                {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-neutral-300 mb-1">
                  Your Email Address *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. recruiter@company.com"
                  className="w-full px-3.5 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                />
                {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="contact-subject" className="block text-xs font-medium text-neutral-300 mb-1">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-neutral-300 mb-1">
                Your Message *
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Hi Arjun, we reviewed your ARVR Interviewer and digital twin projects and would like to discuss..."
                className="w-full px-3.5 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 resize-none"
              />
              {errors.message && <p className="text-[11px] text-rose-400 mt-1">{errors.message}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
