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
          <h1 className="text-3xl font-extrabold report-title-gradient print:text-slate-900">
            AI Life Architect — Personal Plan
          </h1>
          <p className="text-slate-600">Prepared for <span className="font-semibold">{name}</span></p>
        </div>
        <div className="text-slate-500 text-sm">Generated on {today}</div>
      </div>
    </header>
  );
};

const UserProfileSnapshot: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
  const lifePathNumber = calculateLifePathNumber(userProfile.dob);
  return (
    <section className="mb-12 print-no-break">
      <h2 className="text-2xl font-bold text-brand-secondary mb-4 print-text-black">
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

/* ---------- html2pdf loader & report-mode toggles ---------- */

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

const addReportMode = () => document.body.classList.add('report-mode', 'printing-main');
const removeReportMode = () => document.body.classList.remove('report-mode', 'printing-main');

/* ---------- Main ---------- */

const Dashboard: React.FC<DashboardProps> = ({ userProfile, pathway, numerologyReport }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    addReportMode();
    requestAnimationFrame(() => {
      window.print();
      removeReportMode();
    });
  };

  const handleExportPdf = async () => {
    if (!printRef.current) return;
    try {
      addReportMode();
      await new Promise<void>((r) => requestAnimationFrame(() => r())); // let styles apply

      const html2pdf = await ensureHtml2Pdf();
      const filename = `AI-Life-Architect_${userProfile.name.replace(/\s+/g, '_')}_plan.pdf`;

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2.5,
            useCORS: true,
            scrollX: 0,
            scrollY: -window.scrollY,
            backgroundColor: '#ffffff', // prevents gray wash
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(printRef.current)
        .save();
    } catch (e) {
      console.error(e);
      alert('Could not generate PDF automatically. Opening print dialog instead.');
      window.print();
    } finally {
      removeReportMode();
    }
  };

  return (
    <div className="space-y-12 animate-fade-in print:space-y-10 print:max-w-none">
      {/* Report Sheet: solid white background so screen + PDF are crisp */}
      <div
        id="printable-area"
        ref={printRef}
        className="report-sheet mx-auto rounded-2xl md:rounded-3xl shadow-xl print:shadow-none"
        style={{ backgroundColor: '#ffffff' }}  // hard fallback even without CSS
      >
        <div className="p-4 md:p-8 lg:p-10">
          <ReportHeader name={userProfile.name} />

          {/* Snapshot */}
          <UserProfileSnapshot userProfile={userProfile} />

          {/* Numerology (now detailed & white inside the component) */}
          <div className="print-no-break">
            <NumerologyReportDisplay userProfile={userProfile} report={numerologyReport} />
          </div>

          {/* Pathway starts on a fresh page for print/PDF */}
          <div className="print-page-break-before" />
          <PathwayDisplay
            pathway={pathway}
            onPrint={handlePrint}
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

      {/* Simulator (never printed) */}
      <div id="simulator-section" className="print-hide">
        <ScenarioSimulator userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Dashboard;
