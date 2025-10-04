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
  onExportPdf?: () => void; // NEW: optional download handler
}

// lightweight inline download icon (so we don't rely on another file)
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

const EpochCard: React.FC<{ epoch: Epoch }> = ({ epoch }) => (
  <div
    className="
      glass-effect rounded-lg p-6 w-full
      print-bg-white print-border-gray print-no-break
      print:w-full print:min-w-0 print:max-w-none
    "
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-xl font-bold text-brand-primary print-text-black">{epoch.theme}</h3>
      <span className="text-sm font-mono bg-brand-bg/50 text-brand-muted px-2 py-1 rounded print-text-black print-bg-white print-border-gray">
        {epoch.years}
      </span>
    </div>

    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-brand-secondary flex items-center gap-2 mb-2 print-text-black">
          <MilestoneIcon className="h-5 w-5" />
          Milestones
        </h4>
        <ul className="list-disc list-inside text-brand-muted space-y-1 print-text-black">
          {epoch.milestones.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-brand-secondary flex items-center gap-2 mb-2 print-text-black">
          <HabitIcon className="h-5 w-5" />
          Habits
        </h4>
        <ul className="list-disc list-inside text-brand-muted space-y-1 print-text-black">
          {epoch.habits.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const PathwayDisplay: React.FC<PathwayDisplayProps> = ({ pathway, onPrint, onExportPdf }) => {
  return (
    <div className="space-y-8 print:max-w-none">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-brand-secondary mb-2 print-text-black">
            Your {pathway.horizon_years}-Year Pathway
          </h2>
          <p className="text-brand-muted max-w-2xl print-text-black">
            This is your AI-generated strategic blueprint. Remember, it's a living document, meant to adapt as you grow.
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

      {/* Cards wrap downward (no horizontal scroll) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 print:grid-cols-1 print:gap-4">
        {pathway.epochs.map((epoch, index) => (
          <EpochCard key={index} epoch={epoch} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1">
        <div className="glass-effect rounded-lg p-6 print-bg-white print-border-gray print-no-break">
          <h3 className="text-lg font-bold text-brand-secondary mb-3 flex items-center gap-2 print-text-black">
            <RiskIcon className="h-5 w-5 text-red-400" />
            Potential Risks
          </h3>
          <ul className="list-disc list-inside text-brand-muted space-y-1 print-text-black">
            {pathway.risks.map((risk, i) => (
              <li key={i}>{risk}</li>
            ))}
          </ul>
        </div>
        <div className="glass-effect rounded-lg p-6 print-bg-white print-border-gray print-no-break">
          <h3 className="text-lg font-bold text-brand-secondary mb-3 flex items-center gap-2 print-text-black">
            <IndicatorIcon className="h-5 w-5 text-green-400" />
            Leading Indicators
          </h3>
          <ul className="list-disc list-inside text-brand-muted space-y-1 print-text-black">
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
