import React from 'react';
import { UserProfile, NumerologyReport } from '../types';
import { CosmicSignatureIcon } from './icons/CosmicSignatureIcon';

interface NumerologyReportDisplayProps {
  userProfile: UserProfile;
  report: NumerologyReport;
}

/* ---- Small helpers ------------------------------------------------------- */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl font-extrabold mb-3 report-title-gradient print:text-slate-900">
    {children}
  </h3>
);

const StatCard = ({
  label,
  value,
  accent = 'border-l-indigo-400',
  chipClass = 'badge-blue',
}: {
  label: string;
  value: React.ReactNode;
  accent?: string;
  chipClass?: string;
}) => (
  <div className={`report-card ${accent} rounded-xl p-5 print-no-break`}>
    <div className="text-sm text-slate-500">{label}</div>
    <div className="mt-1 flex items-center gap-2">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-semibold ${chipClass}`}>
        {value}
      </span>
    </div>
  </div>
);

const InterpretBlock = ({
  title,
  number,
  text,
  accent = 'border-l-cyan-400',
}: {
  title: string;
  number?: number | string;
  text?: string;
  accent?: string;
}) => {
  if (number == null && !text) return null;
  return (
    <div className={`report-card ${accent} rounded-xl p-6 space-y-2 print-no-break`}>
      <h4 className="text-xl font-bold text-slate-900">
        {title}
        {number != null && (
          <>
            {': '}
            <span className="text-slate-700">{number}</span>
          </>
        )}
      </h4>
      {text && <p className="text-slate-700">{text}</p>}
    </div>
  );
};

/* ---- Component ----------------------------------------------------------- */

const NumerologyReportDisplay: React.FC<NumerologyReportDisplayProps> = ({
  userProfile,
  report,
}) => {
  // Access optional fields safely (works even if your types didn’t include them originally)
  const r: any = report;

  const personalYears: Array<{ year: number; number: number; theme?: string }> =
    r.personal_years || [];

  const pinnacles:
    | Array<{ cycle?: number | string; number: number; start?: number; end?: number; meaning?: string }>
    | undefined = r.pinnacles;

  const challenges:
    | Array<{ cycle?: number | string; number: number; start?: number; end?: number; meaning?: string }>
    | undefined = r.challenges;

  return (
    <div className="my-12 glass-effect rounded-2xl p-8 print-bg-white print-border-gray">
      {/* Header */}
      <h2 className="text-3xl font-extrabold mb-2 report-title-gradient print:text-slate-900">
        Your Personal Numerology Report
      </h2>
      <p className="text-slate-300 report-mode:text-slate-600 mb-6 max-w-2xl">
        An esoteric blueprint based on the vibrations of your name and date of birth.
      </p>

      {/* Identity */}
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

      {/* Core Numbers – compact stat cards */}
      <SectionTitle>Core Numbers</SectionTitle>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Life Path" value={report.life_path_number} accent="border-l-indigo-400" chipClass="badge-blue" />
        <StatCard label="Expression" value={report.expression_number} accent="border-l-emerald-400" chipClass="badge-emerald" />
        <StatCard label="Soul Urge" value={report.soul_urge_number} accent="border-l-fuchsia-400" chipClass="badge-blue" />
      </div>

      {/* Extended Numbers – only rendered if present */}
      {(r.personality_number != null ||
        r.maturity_number != null ||
        r.birthday_number != null) && (
        <>
          <SectionTitle>Extended Numbers</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {r.personality_number != null && (
              <StatCard
                label="Personality"
                value={r.personality_number}
                accent="border-l-amber-400"
                chipClass="badge-blue"
              />
            )}
            {r.maturity_number != null && (
              <StatCard
                label="Maturity"
                value={r.maturity_number}
                accent="border-l-teal-400"
                chipClass="badge-emerald"
              />
            )}
            {r.birthday_number != null && (
              <StatCard
                label="Birthday"
                value={r.birthday_number}
                accent="border-l-rose-400"
                chipClass="badge-blue"
              />
            )}
          </div>
        </>
      )}

      {/* Interpretations */}
      <SectionTitle>Interpretations</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InterpretBlock
          title="Life Path"
          number={report.life_path_number}
          text={report.life_path_interpretation}
          accent="border-l-indigo-400"
        />
        <InterpretBlock
          title="Expression"
          number={report.expression_number}
          text={report.expression_interpretation}
          accent="border-l-emerald-400"
        />
        <InterpretBlock
          title="Soul Urge"
          number={report.soul_urge_number}
          text={report.soul_urge_interpretation}
          accent="border-l-fuchsia-400"
        />
        {r.personality_interpretation && (
          <InterpretBlock
            title="Personality"
            number={r.personality_number}
            text={r.personality_interpretation}
            accent="border-l-amber-400"
          />
        )}
        {r.maturity_interpretation && (
          <InterpretBlock
            title="Maturity"
            number={r.maturity_number}
            text={r.maturity_interpretation}
            accent="border-l-teal-400"
          />
        )}
        {r.birthday_interpretation && (
          <InterpretBlock
            title="Birthday"
            number={r.birthday_number}
            text={r.birthday_interpretation}
            accent="border-l-rose-400"
          />
        )}
      </div>

      {/* Pinnacles & Challenges */}
      {(pinnacles?.length || challenges?.length) && (
        <>
          <SectionTitle>Pinnacles & Challenges</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {pinnacles?.length && (
              <div className="report-card border-l-sky-400 rounded-xl p-6 print-no-break">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Pinnacles</h4>
                <ul className="space-y-3">
                  {pinnacles.map((p, i) => (
                    <li key={i} className="text-slate-700">
                      <span className="font-semibold">Cycle {p.cycle}</span>
                      {p.start != null && p.end != null && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded badge-year">{p.start}–{p.end}</span>
                      )}
                      <div className="mt-1 text-sm">
                        Number <strong>{p.number}</strong>{p.meaning ? ` — ${p.meaning}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {challenges?.length && (
              <div className="report-card border-l-rose-400 rounded-xl p-6 print-no-break">
                <h4 className="text-xl font-bold text-slate-900 mb-2">Challenges</h4>
                <ul className="space-y-3">
                  {challenges.map((c, i) => (
                    <li key={i} className="text-slate-700">
                      <span className="font-semibold">Cycle {c.cycle}</span>
                      {c.start != null && c.end != null && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded badge-year">{c.start}–{c.end}</span>
                      )}
                      <div className="mt-1 text-sm">
                        Number <strong>{c.number}</strong>{c.meaning ? ` — ${c.meaning}` : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}

      {/* 10-Year Personal Year Forecast */}
      {!!personalYears.length && (
        <>
          <SectionTitle>Personal Year Forecast (Next 10 Years)</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {personalYears.map((row, i) => (
              <div key={i} className="report-card border-l-emerald-400 rounded-xl p-4 print-no-break">
                <div className="flex items-center gap-2">
                  <span className="badge-year text-xs px-2 py-0.5 rounded">{row.year}</span>
                  <span className="text-sm text-slate-500">Year Number</span>
                  <span className="ml-auto badge-emerald text-xs px-2 py-0.5 rounded">{row.number}</span>
                </div>
                {row.theme && <p className="mt-2 text-slate-700">{row.theme}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Summary */}
      {report.summary && (
        <>
          <SectionTitle>Synthesis & Summary</SectionTitle>
          <div className="report-card border-l-indigo-400 rounded-xl p-6 print-no-break mb-8">
            <p className="text-slate-700">{report.summary}</p>
          </div>
        </>
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
