import React, { useRef } from 'react';
import { UserProfile, Pathway, NumerologyReport } from '../types';
import PathwayDisplay from './PathwayDisplay';
import ScenarioSimulator from './ScenarioSimulator';
import { calculateLifePathNumber } from '../utils/numerology';
import { UserIcon } from './icons/UserIcon';
import { FinanceIcon } from './icons/FinanceIcon';
import { HealthIcon } from './icons/HealthIcon';
import NumerologyReportDisplay from './NumerologyReportDisplay';

declare global {
  interface Window {
    html2pdf?: any;
  }
}

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

/** Load html2pdf bundle from CDN only when needed */
const ensureHtml2Pdf = (): Promise<any> => {
  if (window.html2pdf) return Promise.resolve(window.html2pdf);
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js';
    s.async = true;
    s.onload = () => resolve(window.html2pdf);
    s.onerror = () => reject(new Error('Failed to load html2pdf bundle'));
    document.body.appendChild(s);
  });
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

  const handleExportPdf = async () => {
    if (!printRef.current) return;
    try {
      document.body.classList.add('printing-main'); // use print CSS for layout
      const html2pdf = await ensureHtml2Pdf();

      const filename = `AI-Life-Architect_${userProfile.name.replace(/\s+/g, '_')}_plan.pdf`;
      const options = {
        margin: [10, 10, 10, 10],
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: -window.scrollY },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      };

      await html2pdf().set(options).from(printRef.current).save();
    } catch (e) {
      console.error(e);
      // graceful fallback
      window.alert('Could not generate PDF automatically. Opening print dialog instead.');
      window.print();
    } finally {
      document.body.classList.remove('printing-main');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in print:space-y-10 print:max-w-none">
      <div id="printable-area" ref={printRef}>
        {/* Snapshot */}
        <UserProfileSnapshot userProfile={userProfile} />

        {/* Numerology */}
        <div className="print-no-break">
          <NumerologyReportDisplay userProfile={userProfile} report={numerologyReport} />
        </div>

        {/* Pathway starts on new page for print/PDF */}
        <div style={{ breakBefore: 'page' }}>
          <PathwayDisplay
            pathway={pathway}
            onPrint={handlePrint}
            // pass the PDF downloader to show the button in PathwayDisplay
            // (PathwayDisplay has onExportPdf?: () => void)
            // If you kept it optional, this is safe.
            onExportPdf={handleExportPdf}
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
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2 border border-brand-border text-sm font-medium rounded-md shadow-sm text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface transition-colors"
          >
            ⤓ Download PDF
          </button>
        </div>
      </div>

      {/* Simulator hidden in print */}
      <div id="simulator-section" className="print-hide">
        <ScenarioSimulator userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
