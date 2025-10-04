import React from 'react';
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
  const handlePrint = () => {
    document.body.classList.add('printing-main');
    document.body.classList.remove('printing-scenario');
    // ensure class is applied before print UI opens
    setTimeout(() => {
      window.print();
      document.body.classList.remove('printing-main');
    }, 0);
  };

  return (
    <div className="space-y-12 animate-fade-in print:space-y-10 print:max-w-none">
      <div id="printable-area">
        {/* Snapshot (avoid splitting) */}
        <UserProfileSnapshot userProfile={userProfile} />

        {/* Numerology report (avoid splitting) */}
        <div className="print-no-break">
          <NumerologyReportDisplay userProfile={userProfile} report={numerologyReport} />
        </div>

        {/* Start the pathway on a fresh page for print */}
        <div style={{ breakBefore: 'page' }}>
          <PathwayDisplay pathway={pathway} onPrint={handlePrint} />
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
