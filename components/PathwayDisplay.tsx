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
}

const EpochCard: React.FC<{ epoch: Epoch }> = ({ epoch }) => (
  <div
    className="
      glass-effect rounded-lg p-6 flex-1 min-w-[300px] snap-start
      print-bg-white print-border-gray print-no-break
      print:w-full print:min-w-0 print:max-w-none print:flex-none
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

const PathwayDisplay: React.FC<PathwayDisplayProps> = ({ pathway, onPrint }) => {
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
        <button
          onClick={onPrint}
          className="print-hide inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
        >
          <PrintIcon className="h-5 w-5" />
          Print Plan
        </button>
      </div>

      <div className="relative print:static">
        <div
          className="
            flex space-x-6 overflow-x-auto pb-4 snap-x snap-mandatory
            print:flex-col print:space-x-0 print:space-y-4 print:overflow-visible print:snap-none
          "
        >
          {pathway.epochs.map((epoch, index) => (
            <EpochCard key={index} epoch={epoch} />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 print:grid-cols-1">
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
