
import React from 'react';
import { UserProfile, NumerologyReport } from '../types';
import { CosmicSignatureIcon } from './icons/CosmicSignatureIcon';

interface NumerologyReportDisplayProps {
    userProfile: UserProfile;
    report: NumerologyReport;
}

const ReportSection: React.FC<{ title: string; number: number; children: React.ReactNode }> = ({ title, number, children }) => (
    <div className="print-no-break">
        <h4 className="text-xl font-bold text-brand-primary print-text-black">{title}: <span className="text-brand-secondary">{number}</span></h4>
        <p className="mt-2 text-brand-muted print-text-black">{children}</p>
    </div>
);


const NumerologyReportDisplay: React.FC<NumerologyReportDisplayProps> = ({ userProfile, report }) => {
    return (
        <div className="my-12 glass-effect rounded-lg p-8 print-bg-white print-border-gray">
            <h2 className="text-3xl font-bold text-brand-secondary mb-2 print-text-black">Your Personal Numerology Report</h2>
            <p className="text-brand-muted mb-6 max-w-2xl print-text-black">An esoteric blueprint based on the vibrations of your name and date of birth.</p>
            
            <div className="border-b border-brand-border pb-4 mb-6">
                <p className="text-sm text-brand-muted print-text-black">Full Name</p>
                <p className="text-lg font-semibold text-brand-secondary print-text-black">{userProfile.name}</p>
                 <p className="text-sm text-brand-muted mt-2 print-text-black">Date of Birth</p>
                <p className="text-lg font-semibold text-brand-secondary print-text-black">{new Date(userProfile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
            </div>

            <div className="space-y-8">
                <ReportSection title="Life Path Number" number={report.life_path_number}>
                    {report.life_path_interpretation}
                </ReportSection>

                <ReportSection title="Expression Number" number={report.expression_number}>
                    {report.expression_interpretation}
                </ReportSection>

                <ReportSection title="Soul Urge Number" number={report.soul_urge_number}>
                    {report.soul_urge_interpretation}
                </ReportSection>

                <div>
                    <h4 className="text-xl font-bold text-brand-primary print-text-black">Synthesis & Summary</h4>
                    <p className="mt-2 text-brand-muted print-text-black">{report.summary}</p>
                </div>
            </div>
            
            <div className="mt-12 text-center border-t border-brand-border pt-6 print-no-break">
                <CosmicSignatureIcon className="h-16 w-16 mx-auto text-brand-muted opacity-50"/>
                <p className="mt-2 text-sm text-brand-muted font-serif italic">Signature of the Universe</p>
            </div>
        </div>
    );
};

export default NumerologyReportDisplay;
