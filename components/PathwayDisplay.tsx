import React from 'react';
import { Pathway, Epoch } from '../types';
import { MilestoneIcon } from './icons/MilestoneIcon';
import { HabitIcon } from './icons/HabitIcon';
import { RiskIcon } from './icons/RiskIcon';
import { IndicatorIcon } from './icons/IndicatorIcon';
import { PrintIcon } from './icons/PrintIcon';

interface PathwayDisplayProps {
  pathway: Pathway;
  onPrint: () => void;
  onExportPdf?: () => void; // optional download handler
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3v12" />
    <path d="M7 11l5 5 5-5" />
    <path d="M20 21H4" />
  </svg>
);

/** Single epoch card — accepts an accent class for the left border color */
const EpochCard: React.FC<{ epoch: Epoch; accentClass: string }> = ({ epoch, accentClass }) => (
  <div
    className={[
      // screen look
      'glass-effect rounded-xl p-6 w-full',
      // report/print look
      'report-card', accentClass,
      // print fallbacks
      'print-bg-white print-border-gray print-no-break print:w-full print:min-w-0 print:max-w-none',
    ].join(' ')}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-extrabold text-slate-100 report-mode:text-slate-900 print-text-black">
        {epoch.theme}
      </h3>
      <span
        className="text-xs font-mono px-2 py-1 rounded badge-year print-text-black"
        aria-label={`Year ${epoch.years}`}
        title={epoch.years}
      >
        {epoch.years}
      </span>
    </div>

    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-slate-100 report-mode:text-slate-900 flex items-center gap-2 mb-2 print-text-black">
          <MilestoneIcon className="h-5 w-5 text-indigo-400 report-mode:text-indigo-500" />
          Milestones
        </h4>
        <ul className="list-disc list-inside text-slate-300 report-mode:text-slate-700 space-y-1 print-text-black">
          {epoch.milestones.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-slate-100 report-mode:text-slate-900 flex items-center gap-2 mb-2 print-text-black">
          <HabitIcon className="h-5 w-5 text-emerald-400 report-mode:text-emerald-600" />
          Habits
        </h4>
        <ul className="list-disc list-inside text-slate-300 report-mode:text-slate-700 space-y-1 print-text-black">
          {epoch.habits.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const PathwayDisplay: React.FC<PathwayDisplayProps> = ({ pathway, onPrint, onExportPdf }) => {
  // rotating accent colors for left border (prints beautifully)
  const accents = [
    'border-l-indigo-400',
    'border-l-cyan-400',
    'border-l-fuchsia-400',
    'border-l-amber-400',
    'border-l-emerald-400',
    'border-l-sky-400',
    'border-l-violet-400',
    'border-l-rose-400',
    'border-l-lime-400',
    'border-l-teal-400',
  ];

  return (
    <div className="space-y-8 print:max-w-none">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-extrabold mb-2 report-title-gradient print:text-slate-900">
            Your {pathway.horizon_years}-Year Pathway
          </h2>
          <p className="text-slate-300 report-mode:text-slate-600 max-w-2xl print-text-black">
            This is your AI-generated strategic blueprint. Remember, it’s a living document—refine it as you grow.
          </p>
        </div>

        {/* Actions (hidden on print) */}
        <div className="print-hide flex items-center gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
          >
            <PrintIcon className="h-5 w-5" />
            Print
          </button>

          {onExportPdf && (
            <button
              onClick={onExportPdf}
              className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
            >
              <DownloadIcon />
              Download PDF
            </button>
          )}
        </div>
      </div>

      {/* Epoch cards — flow downward, no horizontal scroll. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
        {pathway.epochs.map((epoch, index) => (
          <EpochCard key={index} epoch={epoch} accentClass={accents[index % accents.length]} />
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
        <div className="glass-effect report-card border-l-rose-400 rounded-xl p-6 print-bg-white print-border-gray print-no-break">
          <h3 className="text-lg font-bold text-slate-100 report-mode:text-slate-900 mb-3 flex items-center gap-2 print-text-black">
            <RiskIcon className="h-5 w-5 text-rose-400 report-mode:text-rose-600" />
            Potential Risks
          </h3>
          <ul className="list-disc list-inside text-slate-300 report-mode:text-slate-700 space-y-1 print-text-black">
            {pathway.risks.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </div>

        <div className="glass-effect report-card border-l-emerald-400 rounded-xl p-6 print-bg-white print-border-gray print-no-break">
          <h3 className="text-lg font-bold text-slate-100 report-mode:text-slate-900 mb-3 flex items-center gap-2 print-text-black">
            <IndicatorIcon className="h-5 w-5 text-emerald-400 report-mode:text-emerald-600" />
            Leading Indicators
          </h3>
          <ul className="list-disc list-inside text-slate-300 report-mode:text-slate-700 space-y-1 print-text-black">
            {pathway.leading_indicators.map((indicator, i) => (
              <li key={i}>{indicator}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PathwayDisplay;
