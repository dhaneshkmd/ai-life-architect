// src/components/Dashboard.tsx
import React, { useRef } from 'react';
import { UserProfile, Pathway, NumerologyReport } from '../types';
import PathwayDisplay from './PathwayDisplay';
import ScenarioSimulator from './ScenarioSimulator';
import { calculateLifePathNumber } from '../utils/numerology';
import { UserIcon } from './icons/UserIcon';
import { FinanceIcon } from './icons/FinanceIcon';
import { HealthIcon } from './icons/HealthIcon';
import NumerologyReportDisplay from './NumerologyReportDisplay';

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

interface DashboardProps {
  userProfile: UserProfile;
  pathway: Pathway;
  numerologyReport: NumerologyReport;
}

/* ---------- Small components ---------- */

const InfoCard = ({
  title,
  value,
  icon,
  unit = '',
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  unit?: string;
}) => (
  <div className="glass-effect rounded-lg p-4 flex items-start gap-4 print-bg-white print-border-gray print-no-break">
    <div className="text-brand-primary">{icon}</div>
    <div>
      <p className="text-sm text-brand-muted print-text-black">{title}</p>
      <p className="text-lg font-bold text-brand-secondary print-text-black">
        {value}{' '}
        <span className="text-sm font-normal text-brand-muted print-text-black">{unit}</span>
      </p>
    </div>
  </div>
);

const ReportHeader: React.FC<{ name: string }> = ({ name }) => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  return (
    <header className="mb-8 report-card border-l-indigo-400 rounded-xl p-5 print-no-break">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold report-title-gradient print:text-slate-900">
            AI Life Architect — Personal Plan
          </h1>
          <p className="opacity-90">Prepared for <span className="font-semibold">{name}</span></p>
        </div>
        <div className="text-sm opacity-80">Generated on {today}</div>
      </div>
    </header>
  );
};

const UserProfileSnapshot: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
  const lifePathNumber = calculateLifePathNumber(userProfile.dob);
  return (
    <section className="mb-12 print-no-break">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-secondary mb-4 print-text-black">
        Your Digital Twin Snapshot
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InfoCard title="Life Path Number" value={lifePathNumber} icon={<UserIcon className="h-8 w-8" />} />
        <InfoCard
          title="Annual Income"
          value={`${userProfile.finance.income.toLocaleString()}`}
          icon={<FinanceIcon className="h-8 w-8" />}
          unit={userProfile.finance.currency}
        />
        <InfoCard
          title="Net Worth"
          value={`${userProfile.finance.netWorth.toLocaleString()}`}
          icon={<FinanceIcon className="h-8 w-8" />}
          unit={userProfile.finance.currency}
        />
        <InfoCard title="Avg. Sleep" value={userProfile.health.sleepHours} icon={<HealthIcon className="h-8 w-8" />} unit="hours" />
      </div>
      <div className="mt-6 glass-effect rounded-lg p-4 print-bg-white print-border-gray print-no-break">
        <p className="text-sm text-brand-muted print-text-black">Primary 10-Year Goal</p>
        <p className="text-lg font-semibold text-brand-secondary print-text-black">
          "{userProfile.lifeGoal}"
        </p>
      </div>
    </section>
  );
};

/* ---------- report-mode toggles (used for screen skin + print) ---------- */
const addReportMode = () => document.body.classList.add('report-mode', 'printing-main');
const removeReportMode = () => document.body.classList.remove('report-mode', 'printing-main');

/* ---------- Word export (reads text from the rendered report) ---------- */
const exportNodeToWord = async (root: HTMLElement, filename: string) => {
  // Gather visible text with basic paragraph splitting
  const text = root.innerText
    .replace(/\r/g, '')
    .split(/\n{2,}/g)
    .map(s => s.trim())
    .filter(Boolean);

  const children: Paragraph[] = [
    new Paragraph({ text: 'AI Life Architect — Personal Plan', heading: HeadingLevel.HEADING_1 }),
  ];

  text.forEach((block) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: block })],
        spacing: { after: 200 },
      })
    );
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
};

/* ---------- Main ---------- */

const Dashboard: React.FC<DashboardProps> = ({ userProfile, pathway, numerologyReport }) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Apply the new light-blue + white theme for the report region on mount
  React.useEffect(() => {
    addReportMode();
    return () => removeReportMode();
  }, []);

  const handlePrint = () => {
    // ensure report-mode styles are applied while printing
    addReportMode();
    requestAnimationFrame(() => {
      window.print();
      removeReportMode();
    });
  };

  const handleExportWord = async () => {
    if (!printRef.current) return;
    const filename = `AI-Life-Architect_${userProfile.name.replace(/\s+/g, '_')}_plan.docx`;
    await exportNodeToWord(printRef.current, filename);
  };

  return (
    <div className="space-y-12 animate-fade-in print:space-y-10 print:max-w-none">
      {/* Report Sheet: allow gradient to show (no hard white background) */}
      <div
        id="printable-area"
        ref={printRef}
        className="report-sheet mx-auto rounded-2xl md:rounded-3xl shadow-xl print:shadow-none"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="p-4 md:p-8 lg:p-10">
          <ReportHeader name={userProfile.name} />

          {/* Snapshot */}
          <UserProfileSnapshot userProfile={userProfile} />

          {/* Numerology */}
          <div className="print-no-break">
            <NumerologyReportDisplay userProfile={userProfile} report={numerologyReport} />
          </div>

          {/* Pathway starts on a fresh page for print */}
          <div className="print-page-break-before" />
          <PathwayDisplay
            pathway={pathway}
            onPrint={handlePrint}
            /* removed PDF handler */
          />
        </div>
      </div>

      {/* Global actions (hidden in print) */}
      <div className="print-hide">
        <div className="flex gap-3 justify-end">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
          >
            🖨 Print
          </button>
          <button
            onClick={handleExportWord}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
          >
            ⤓ Download Word
          </button>
        </div>
      </div>

      {/* Simulator (never printed) */}
      <div id="simulator-section" className="print-hide">
        <ScenarioSimulator userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
