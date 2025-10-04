import React, { useRef } from 'react';
import { UserProfile, Pathway, NumerologyReport } from '../types';
import PathwayDisplay from './PathwayDisplay';
import ScenarioSimulator from './ScenarioSimulator';
import { calculateLifePathNumber } from '../utils/numerology';
import { UserIcon } from './icons/UserIcon';
import { FinanceIcon } from './icons/FinanceIcon';
import { HealthIcon } from './icons/HealthIcon';
import NumerologyReportDisplay from './NumerologyReportDisplay';

interface DashboardProps {
  userProfile: UserProfile;
  pathway: Pathway;
  numerologyReport: NumerologyReport;
}

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

const UserProfileSnapshot: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
  const lifePathNumber = calculateLifePathNumber(userProfile.dob);
  return (
    <div className="mb-12 print-no-break">
      <h2 className="text-3xl font-bold text-brand-secondary mb-4 print-text-black">
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
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ userProfile, pathway, numerologyReport }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    document.body.classList.add('printing-main');
    document.body.classList.remove('printing-scenario');
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-main');
    }, 0);
  };

  // Download the whole plan as PDF using current print layout (no sideways scroll)
  const handleExportPdf = async () => {
    if (!printRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default as any;

    document.body.classList.add('printing-main'); // reuse your print CSS
    const filename = `AI-Life-Architect_${userProfile.name.replace(/\s+/g, '_')}_plan.pdf`;

    const options = {
      margin: [10, 10, 10, 10],                  // mm
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: -window.scrollY },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }, // respects .print-no-break
    };

    await html2pdf().set(options).from(printRef.current).save();
    document.body.classList.remove('printing-main');
  };

  return (
    <div className="space-y-12 animate-fade-in print:space-y-10 print:max-w-none">
      <div id="printable-area" ref={printRef}>
        {/* Snapshot (avoid splitting) */}
        <UserProfileSnapshot userProfile={userProfile} />

        {/* Numerology report (avoid splitting) */}
        <div className="print-no-break">
          <NumerologyReportDisplay userProfile={userProfile} report={numerologyReport} />
        </div>

        {/* Start the pathway on a fresh page for print/PDF */}
        <div style={{ breakBefore: 'page' }}>
          <PathwayDisplay
            pathway={pathway}
            onPrint={handlePrint}
            // If your PathwayDisplay supports it, show a "Download PDF" button there:
            // onExportPdf={handleExportPdf}
          />
        </div>
      </div>

      {/* Global Download button (always visible) */}
      <div className="print-hide">
        <div className="flex gap-3 justify-end">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
          >
            🖨 Print
          </button>
          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
          >
            ⤓ Download PDF
          </button>
        </div>
      </div>

      {/* Simulator should never appear in print */}
      <div id="simulator-section" className="print-hide">
        <ScenarioSimulator userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
