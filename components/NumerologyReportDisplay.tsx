import React from 'react';
import { UserProfile, NumerologyReport } from '../types';
import { CosmicSignatureIcon } from './icons/CosmicSignatureIcon';

/* ---------- Long-form number insights (concise but substantial) ---------- */
type Bucket = 'strengths' | 'growth' | 'careers' | 'relationships';
type NumberKey = 1|2|3|4|5|6|7|8|9|11|22|33;

const DETAILS: Record<NumberKey, Record<Bucket, string[]>> = {
  1: {
    strengths: [
      'Independent, original, and decisive; comfortable taking the lead.',
      'High initiative; moves ideas from concept to action quickly.',
      'Naturally competitive; sets ambitious personal standards.'
    ],
    growth: [
      'Avoid lone-wolf tendencies; leadership improves with collaboration.',
      'Temper impatience and sharpness in communication.',
      'Remember to listen; influence > control.'
    ],
    careers: ['Entrepreneur, product lead, founder, sales, innovation roles'],
    relationships: [
      'Attracts partners who admire drive and clarity.',
      'Practice curiosity and shared decision-making to avoid “my way only.”'
    ],
  },
  2: {
    strengths: [
      'Diplomatic, cooperative, and emotionally intelligent.',
      'Excellent mediator; senses nuances others miss.',
      'Creates harmony and partnership wherever you go.'
    ],
    growth: [
      'Set boundaries; people-pleasing drains energy.',
      'Decide faster—don’t over-index on consensus.',
      'Use conflict skillfully instead of avoiding it.'
    ],
    careers: ['HR/People ops, partnerships, counseling, design research, diplomacy'],
    relationships: [
      'Deeply loyal; thrives with mutual support and emotional attunement.',
      'Needs reassurance; ask clearly for what you need.'
    ],
  },
  3: {
    strengths: [
      'Expressive, optimistic, creative; strong storyteller.',
      'Social catalyst—brings lightness and possibility.',
      'Learns fast through play, iteration, and sharing.'
    ],
    growth: [
      'Follow-through: finish more than you start.',
      'Channel energy; avoid spreading yourself thin.',
      'Use structure to support creative bursts.'
    ],
    careers: ['Content, marketing, public speaking, teaching, entertainment, design'],
    relationships: [
      'Warm and fun; keep communication grounded when emotions spike.',
      'Consistency builds trust.'
    ],
  },
  4: {
    strengths: [
      'System-builder: reliable, methodical, detail-true.',
      'Excellent at process, quality, and long-term foundations.',
      'Turns chaos into order and repeatable results.'
    ],
    growth: [
      'Beware rigidity; experiment before dismissing new ideas.',
      'Schedule rest—overwork erodes vitality.',
      'Aim for “effective” not just “correct.”'
    ],
    careers: ['Ops, engineering, finance, compliance, architecture, project/program mgmt.'],
    relationships: [
      'Dependable partner; signal affection explicitly (not only through service).',
      'Flexibility invites more intimacy.'
    ],
  },
  5: {
    strengths: [
      'Adaptive and curious; thrives on change and exploration.',
      'Communicates persuasively; great with markets and trends.',
      'Courageous—learns by doing and iterating.'
    ],
    growth: [
      'Create guardrails to avoid scattered energy.',
      'Commit long enough to compound.',
      'Risk well: cap downside, keep upside.'
    ],
    careers: ['Growth, sales, journalism, travel, product discovery, research, trading'],
    relationships: [
      'Needs novelty and freedom; agree rituals that preserve autonomy.',
      'Name your commitments explicitly.'
    ],
  },
  6: {
    strengths: [
      'Responsible, nurturing, service-oriented; natural community builder.',
      'Aesthetic sense: creates warmth and beauty.',
      'Excellent steward of people and resources.'
    ],
    growth: [
      'Release over-responsibility and rescuing.',
      'Perfectionism blocks flow—good enough is useful.',
      'Let others carry their share.'
    ],
    careers: ['People leadership, education, healthcare, design, hospitality, non-profits'],
    relationships: [
      'Devoted partner; mutuality matters.',
      'Ask for help as easily as you offer it.'
    ],
  },
  7: {
    strengths: [
      'Analytical, introspective; seeks truth beneath appearances.',
      'Deep focus; loves research, mastery, and craft.',
      'Original insights through solitude and study.'
    ],
    growth: [
      'Share your findings—don’t disappear.',
      'Balance skepticism with openness.',
      'Care for the body, not only the mind.'
    ],
    careers: ['Research, data, academia, strategy, security, spirituality, craft mastery'],
    relationships: [
      'Requires intellectual and spiritual connection.',
      'Schedule quality time; let others into your inner world.'
    ],
  },
  8: {
    strengths: [
      'Executive energy: organize, execute, and scale.',
      'Understands power, money, systems, and results.',
      'Brings discipline and endurance to ambitious goals.'
    ],
    growth: [
      'Lead with integrity; power serves purpose.',
      'Share credit; grow other leaders.',
      'Balance drive with compassion.'
    ],
    careers: ['Executive, founder, operations, finance, legal, real-estate, athletics'],
    relationships: [
      'Action-oriented; express tenderness, not only provision.',
      'Create “off-duty” time with presence.'
    ],
  },
  9: {
    strengths: [
      'Humanitarian, wise, big-picture perspective.',
      'Transforms pain into meaning; artistic sensitivity.',
      'Inclusive leadership; global mindset.'
    ],
    growth: [
      'Complete endings cleanly—avoid martyrdom.',
      'Stay practical; big heart needs boundaries.',
      'Let go of what is finished.'
    ],
    careers: ['Art, therapy, social impact, global work, communications, philanthropy'],
    relationships: [
      'Needs emotional honesty and shared purpose.',
      'Be specific about needs; don’t assume they’re known.'
    ],
  },
  11: {
    strengths: [
      'Master number of illumination: inspire, teach, catalyze.',
      'Heightened intuition and creativity; transmits ideas at scale.',
      'Bridge between the practical and the visionary.'
    ],
    growth: [
      'Ground nervous energy through routines.',
      'Choose a message and platform; avoid diffusion.',
      'Leadership through service, not perfection.'
    ],
    careers: ['Teaching at scale, writing, media, design, spiritual education, product evangelism'],
    relationships: [
      'Sensitive; needs calm environments and sincere communication.',
      'Protect recovery time to keep your light steady.'
    ],
  },
  22: {
    strengths: [
      'Master builder: turns vision into enduring institutions.',
      'Exceptional systems thinking and execution power.',
      'Creates leverage that outlives the creator.'
    ],
    growth: [
      'Pick fewer, larger bets; avoid scattered building.',
      'Share power; succession is part of mastery.',
      'Sustainability over speed.'
    ],
    careers: ['Founder/operator, architecture, civic projects, platforms, infrastructure'],
    relationships: [
      'Reliable but intense seasons; plan recovery and presence.',
      'Invite play to balance responsibility.'
    ],
  },
  33: {
    strengths: [
      'Master teacher/healer: unconditional service and compassion.',
      'Heals through presence, creativity, and example.',
      'Elevates communities with love plus practicality.'
    ],
    growth: [
      'Avoid self-sacrifice; boundaries are love.',
      'Rest is required for service to remain clear.',
      'Teach what you live, not what you perform.'
    ],
    careers: ['Healing arts, education, spiritual leadership, community design'],
    relationships: [
      'Depth and devotion; requires reciprocity and emotional safety.',
      'Keep one space that is “just for you.”'
    ],
  },
};

/* Helper to render a 2-column “detail” section for one number */
const DetailSection = ({
  title,
  n,
  accent,
}: {
  title: string;
  n: NumberKey;
  accent: string;
}) => {
  const d = DETAILS[n] || DETAILS[1];
  return (
    <div className={`report-card ${accent} rounded-xl p-6 print-no-break`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xl font-bold text-slate-900">{title}</h4>
        <span className="badge-emerald text-xs px-2 py-0.5 rounded">No. {n}</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <h5 className="font-semibold text-slate-800">Strengths</h5>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {d.strengths.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          <h5 className="mt-3 font-semibold text-slate-800">Growth Edges</h5>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {d.growth.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-slate-800">Career & Money</h5>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {d.careers.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          <h5 className="mt-3 font-semibold text-slate-800">Love & Relationships</h5>
          <ul className="list-disc list-inside text-slate-700 space-y-1">
            {d.relationships.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ---------- Component ----------------------------------------------------- */
const NumerologyReportDisplay: React.FC<{
  userProfile: UserProfile;
  report: NumerologyReport;
}> = ({ userProfile, report }) => {
  // loose access to optional fields if present
  const r: any = report;

  return (
    <div className="my-12 rounded-2xl p-8 bg-white/95 border border-slate-200 shadow-lg print-bg-white print-border-gray">
      {/* Header */}
      <h2 className="text-3xl font-extrabold mb-2 report-title-gradient print:text-slate-900">
        Your Personal Numerology Report
      </h2>
      <p className="text-slate-600 mb-6 max-w-2xl">
        An esoteric blueprint based on the vibrations of your name and date of birth.
      </p>

      {/* Identity row */}
      <div className="report-card border-l-indigo-400 rounded-xl p-5 mb-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Full Name</p>
            <p className="text-lg font-semibold text-slate-900">{userProfile.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Date of Birth</p>
            <p className="text-lg font-semibold text-slate-900">
              {new Date(userProfile.dob).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Core numbers at a glance */}
      <h3 className="text-2xl font-extrabold mb-3 report-title-gradient print:text-slate-900">Core Numbers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="report-card border-l-indigo-400 rounded-xl p-5">
          <div className="text-sm text-slate-500">Life Path</div>
          <div className="mt-1 badge-blue inline-flex px-2 py-0.5 rounded-full font-semibold">{report.life_path_number}</div>
          <p className="mt-2 text-slate-700">{report.life_path_interpretation}</p>
        </div>
        <div className="report-card border-l-emerald-400 rounded-xl p-5">
          <div className="text-sm text-slate-500">Expression</div>
          <div className="mt-1 badge-emerald inline-flex px-2 py-0.5 rounded-full font-semibold">{report.expression_number}</div>
          <p className="mt-2 text-slate-700">{report.expression_interpretation}</p>
        </div>
        <div className="report-card border-l-fuchsia-400 rounded-xl p-5">
          <div className="text-sm text-slate-500">Soul Urge</div>
          <div className="mt-1 badge-blue inline-flex px-2 py-0.5 rounded-full font-semibold">{report.soul_urge_number}</div>
          <p className="mt-2 text-slate-700">{report.soul_urge_interpretation}</p>
        </div>
      </div>

      {/* Deep dives (long-form, practical) */}
      <div className="grid grid-cols-1 gap-6 mb-10">
        <DetailSection title="Life Path Deep Dive" n={report.life_path_number as NumberKey} accent="border-l-indigo-400" />
        <DetailSection title="Expression Deep Dive" n={report.expression_number as NumberKey} accent="border-l-emerald-400" />
        <DetailSection title="Soul Urge Deep Dive" n={report.soul_urge_number as NumberKey} accent="border-l-fuchsia-400" />
      </div>

      {/* Optional extended numbers if present */}
      {(r.personality_number || r.maturity_number || r.birthday_number) && (
        <>
          <h3 className="text-2xl font-extrabold mb-3 report-title-gradient print:text-slate-900">
            Extended Numbers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {r.personality_number && (
              <div className="report-card border-l-amber-400 rounded-xl p-5">
                <div className="text-sm text-slate-500">Personality</div>
                <div className="mt-1 badge-blue inline-flex px-2 py-0.5 rounded-full font-semibold">{r.personality_number}</div>
                {r.personality_interpretation && <p className="mt-2 text-slate-700">{r.personality_interpretation}</p>}
              </div>
            )}
            {r.maturity_number && (
              <div className="report-card border-l-teal-400 rounded-xl p-5">
                <div className="text-sm text-slate-500">Maturity</div>
                <div className="mt-1 badge-emerald inline-flex px-2 py-0.5 rounded-full font-semibold">{r.maturity_number}</div>
                {r.maturity_interpretation && <p className="mt-2 text-slate-700">{r.maturity_interpretation}</p>}
              </div>
            )}
            {r.birthday_number && (
              <div className="report-card border-l-rose-400 rounded-xl p-5">
                <div className="text-sm text-slate-500">Birthday</div>
                <div className="mt-1 badge-blue inline-flex px-2 py-0.5 rounded-full font-semibold">{r.birthday_number}</div>
                {r.birthday_interpretation && <p className="mt-2 text-slate-700">{r.birthday_interpretation}</p>}
              </div>
            )}
          </div>
        </>
      )}

      {/* Personal year forecast if available */}
      {Array.isArray((r as any).personal_years) && (r as any).personal_years.length > 0 && (
        <>
          <h3 className="text-2xl font-extrabold mb-3 report-title-gradient print:text-slate-900">
            Personal Year Forecast (Next 10 Years)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {(r as any).personal_years.map(
              (row: { year: number; number: NumberKey; theme?: string }, i: number) => (
                <div key={i} className="report-card border-l-emerald-400 rounded-xl p-4 print-no-break">
                  <div className="flex items-center gap-2">
                    <span className="badge-year text-xs px-2 py-0.5 rounded">{row.year}</span>
                    <span className="text-xs text-slate-500">Year Number</span>
                    <span className="ml-auto badge-emerald text-xs px-2 py-0.5 rounded">{row.number}</span>
                  </div>
                  {row.theme && <p className="mt-2 text-slate-700">{row.theme}</p>}
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Summary */}
      {report.summary && (
        <div className="report-card border-l-indigo-400 rounded-xl p-6 print-no-break">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Synthesis & Summary</h3>
          <p className="text-slate-700">{report.summary}</p>
        </div>
      )}

      {/* Footer signature */}
      <div className="mt-10 text-center border-t border-slate-200 pt-6 print-no-break">
        <CosmicSignatureIcon className="h-16 w-16 mx-auto text-slate-400 opacity-70" />
        <p className="mt-2 text-sm text-slate-500 font-serif italic">Signature of the Universe</p>
      </div>
    </div>
  );
};

export default NumerologyReportDisplay;
