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

const InfoCard = ({ title, value, icon, unit = '' }: { title: string, value: string | number, icon: React.ReactNode, unit?: string }) => (
    <div className="glass-effect rounded-lg p-4 flex items-start gap-4 print-bg-white print-border-gray print-no-break">
        <div className="text-brand-primary">{icon}</div>
        <div>
            <p className="text-sm text-brand-muted print-text-black">{title}</p>
            <p className="text-lg font-bold text-brand-secondary print-text-black">{value} <span className="text-sm font-normal text-brand-muted print-text-black">{unit}</span></p>
        </div>
    </div>
)

const UserProfileSnapshot: React.FC<{ userProfile: UserProfile }> = ({ userProfile }) => {
    const lifePathNumber = calculateLifePathNumber(userProfile.dob);
    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-brand-secondary mb-4 print-text-black">Your Digital Twin Snapshot</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InfoCard title="Life Path Number" value={lifePathNumber} icon={<UserIcon className="h-8 w-8" />} />
                <InfoCard title="Annual Income" value={`${userProfile.finance.income.toLocaleString()}`} icon={<FinanceIcon className="h-8 w-8" />} unit={userProfile.finance.currency}/>
                <InfoCard title="Net Worth" value={`${userProfile.finance.netWorth.toLocaleString()}`} icon={<FinanceIcon className="h-8 w-8" />} unit={userProfile.finance.currency}/>
                {/* FIX: Replaced non-existent 'vo2max' with 'sleepHours' which exists on the UserProfile type. */}
                <InfoCard title="Avg. Sleep" value={userProfile.health.sleepHours} icon={<HealthIcon className="h-8 w-8" />} unit="hours" />
            </div>
             <div className="mt-6 glass-effect rounded-lg p-4 print-bg-white print-border-gray">
                <p className="text-sm text-brand-muted print-text-black">Primary 10-Year Goal</p>
                <p className="text-lg font-semibold text-brand-secondary print-text-black">"{userProfile.lifeGoal}"</p>
            </div>
        </div>
    )
}


const Dashboard: React.FC<DashboardProps> = ({ userProfile, pathway, numerologyReport }) => {
    const handlePrint = () => {
        document.body.classList.add('printing-main');
        document.body.classList.remove('printing-scenario');
        window.print();
        document.body.classList.remove('printing-main');
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <div id="printable-area">
                <UserProfileSnapshot userProfile={userProfile} />
                <NumerologyReportDisplay userProfile={userProfile} report={numerologyReport} />
                <PathwayDisplay pathway={pathway} onPrint={handlePrint} />
            </div>
            <div id="simulator-section" className="print-hide">
                 <ScenarioSimulator userProfile={userProfile} />
            </div>
        </div>
    );
};

export default Dashboard;