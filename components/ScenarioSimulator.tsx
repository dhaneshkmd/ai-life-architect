
import React, { useState } from 'react';
import { UserProfile, ScenarioComparison, MoveCountryScenarioInput, StartupScenarioInput, MarriageScenarioInput } from '../types';
import { compareMoveCountryScenario, compareStartupScenario, compareMarriageScenario } from '../services/geminiService';
import Spinner from './Spinner';
import { RiskIcon } from './icons/RiskIcon';
import { PrintIcon } from './icons/PrintIcon';

interface ScenarioSimulatorProps {
  userProfile: UserProfile;
}

const severityMap = {
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const currencies = [
  { code: 'USD', name: 'United States Dollar' }, { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' }, { code: 'GBP', name: 'British Pound Sterling' },
  { code: 'AUD', name: 'Australian Dollar' }, { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'CHF', name: 'Swiss Franc' }, { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'HKD', name: 'Hong Kong Dollar' }, { code: 'NZD', name: 'New Zealand Dollar' },
  { code: 'SEK', name: 'Swedish Krona' }, { code: 'KRW', name: 'South Korean Won' },
  { code: 'SGD', name: 'Singapore Dollar' }, { code: 'NOK', name: 'Norwegian Krone' },
  { code: 'MXN', name: 'Mexican Peso' }, { code: 'INR', name: 'Indian Rupee' },
  { code: 'BRL', name: 'Brazilian Real' }, { code: 'ZAR', name: 'South African Rand' },
  { code: 'RUB', name: 'Russian Ruble' }, { code: 'TRY', name: 'Turkish Lira' },
];

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'move' | 'startup' | 'marriage'>('move');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);

  // State for Move Country
  const [moveData, setMoveData] = useState({ to: '', expected_salary: '', expected_salary_currency: 'USD', dependents: 0, visa: 'express_entry', jobOffer: false, reasonForMoving: '', estimatedMonthlyLivingCost: '' });
  // State for Startup
  const [startupData, setStartupData] = useState({ businessIdea: '', initialCapital: '', monthlyBurn: '', capital_currency: 'USD', monetizationModel: 'SaaS', industry: '', teamSize: 1, targetMarket: '' });
  // State for Marriage
  const [marriageData, setMarriageData] = useState({ partnerIncome: '', partnerAssets: '', partnerLiabilities: '', partner_currency: 'USD', childrenPlan: 'undecided' as 'yes' | 'no' | 'undecided', sharedGoal: ''});
  
  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moveData.to || !moveData.expected_salary) return;
    
    const scenarioInput: MoveCountryScenarioInput = {
      type: 'move_country',
      from: userProfile.location,
      to: moveData.to,
      expected_salary: parseInt(moveData.expected_salary, 10),
      expected_salary_currency: moveData.expected_salary_currency,
      dependents: Number(moveData.dependents),
      visa: moveData.visa,
      jobOffer: moveData.jobOffer,
      reasonForMoving: moveData.reasonForMoving,
      estimatedMonthlyLivingCost: parseInt(moveData.estimatedMonthlyLivingCost, 10),
    };
    
    runSimulation(() => compareMoveCountryScenario(userProfile, scenarioInput));
  };

  const handleStartupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startupData.businessIdea || !startupData.initialCapital || !startupData.monthlyBurn) return;

    const scenarioInput: StartupScenarioInput = {
        type: 'start_business',
        businessIdea: startupData.businessIdea,
        initialCapital: parseInt(startupData.initialCapital, 10),
        monthlyBurn: parseInt(startupData.monthlyBurn, 10),
        capital_currency: startupData.capital_currency,
        monetizationModel: startupData.monetizationModel,
        industry: startupData.industry,
        teamSize: Number(startupData.teamSize),
        targetMarket: startupData.targetMarket,
    };

    runSimulation(() => compareStartupScenario(userProfile, scenarioInput));
  };

  const handleMarriageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marriageData.partnerIncome || !marriageData.partnerAssets || !marriageData.partnerLiabilities || !marriageData.sharedGoal) return;

    const scenarioInput: MarriageScenarioInput = {
      type: 'marriage',
      partnerIncome: parseInt(marriageData.partnerIncome, 10),
      partnerAssets: parseInt(marriageData.partnerAssets, 10),
      partnerLiabilities: parseInt(marriageData.partnerLiabilities, 10),
      partner_currency: marriageData.partner_currency,
      childrenPlan: marriageData.childrenPlan,
      sharedGoal: marriageData.sharedGoal
    };

    runSimulation(() => compareMarriageScenario(userProfile, scenarioInput));
  };

  const runSimulation = async (apiCall: () => Promise<ScenarioComparison>) => {
    setIsLoading(true);
    setError(null);
    setComparison(null);
    try {
      const result = await apiCall();
      setComparison(result);
    } catch (err: any) {
      setError(err.message || 'Failed to run simulation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabClick = (tab: 'move' | 'startup' | 'marriage') => {
    setActiveTab(tab);
    setComparison(null);
    setError(null);
  }

  const handlePrint = () => {
    document.body.classList.add('printing-scenario');
    document.body.classList.remove('printing-main');
    window.print();
    document.body.classList.remove('printing-scenario');
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-secondary mb-2">Scenario Simulator</h2>
      <p className="text-brand-muted mb-6 max-w-3xl">This tool uses AI to model the potential outcomes of major life decisions. By comparing a simulated scenario against your current path, you can gain insights into potential trade-offs, financial impacts, and hidden risks. Use it to pressure-test your assumptions before you make a real-world move.</p>
      
      <div className="glass-effect rounded-lg p-8">
        <div className="border-b border-brand-border mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => handleTabClick('move')} className={`${activeTab === 'move' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-secondary hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                Move Country
                </button>
                <button onClick={() => handleTabClick('startup')} className={`${activeTab === 'startup' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-secondary hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                Start a Business
                </button>
                <button onClick={() => handleTabClick('marriage')} className={`${activeTab === 'marriage' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-brand-muted hover:text-brand-secondary hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                Marriage
                </button>
            </nav>
        </div>

        {activeTab === 'move' && (
             <form onSubmit={handleMoveSubmit} className="space-y-4 animate-fade-in">
                <div className="grid sm:grid-cols-2 gap-4">
                    <input name="to" placeholder="Destination (e.g., Canada)" value={moveData.to} onChange={e => setMoveData({...moveData, to: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                    <input name="reasonForMoving" placeholder="Primary Reason for Moving" value={moveData.reasonForMoving} onChange={e => setMoveData({...moveData, reasonForMoving: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                    <div className="flex gap-2">
                      <input name="expected_salary" type="number" placeholder="Salary" value={moveData.expected_salary} onChange={e => setMoveData({...moveData, expected_salary: e.target.value})} className="w-2/3 input-glass rounded-md p-2 text-brand-secondary" required />
                      <select name="expected_salary_currency" value={moveData.expected_salary_currency} onChange={e => setMoveData({...moveData, expected_salary_currency: e.target.value})} className="w-1/3 input-glass rounded-md p-2 text-brand-secondary">
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                    </div>
                    <input name="estimatedMonthlyLivingCost" type="number" placeholder="Est. Monthly Living Cost" value={moveData.estimatedMonthlyLivingCost} onChange={e => setMoveData({...moveData, estimatedMonthlyLivingCost: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                    <input name="dependents" type="number" placeholder="Dependents" value={moveData.dependents} onChange={e => setMoveData({...moveData, dependents: Number(e.target.value)})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                    <input name="visa" placeholder="Visa Type" value={moveData.visa} onChange={e => setMoveData({...moveData, visa: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                    <select name="jobOffer" value={String(moveData.jobOffer)} onChange={e => setMoveData({...moveData, jobOffer: e.target.value === 'true'})} className="w-full input-glass rounded-md p-2 text-brand-secondary">
                        <option value="false">No Job Offer Yet</option>
                        <option value="true">Job Offer Secured</option>
                    </select>
                </div>
                <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow">
                    {isLoading ? <Spinner /> : 'Run "Move" Simulation'}
                </button>
            </form>
        )}

         {activeTab === 'startup' && (
            <form onSubmit={handleStartupSubmit} className="space-y-4 animate-fade-in">
                <input name="businessIdea" placeholder="Business Idea" value={startupData.businessIdea} onChange={e => setStartupData({...startupData, businessIdea: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                 <div className="grid sm:grid-cols-2 gap-4">
                    <input name="industry" placeholder="Industry (e.g., AI, HealthTech)" value={startupData.industry} onChange={e => setStartupData({...startupData, industry: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                    <input name="targetMarket" placeholder="Target Market (e.g., B2B SaaS)" value={startupData.targetMarket} onChange={e => setStartupData({...startupData, targetMarket: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="flex gap-2">
                      <input name="initialCapital" type="number" placeholder="Capital" value={startupData.initialCapital} onChange={e => setStartupData({...startupData, initialCapital: e.target.value})} className="w-2/3 input-glass rounded-md p-2 text-brand-secondary" required />
                      <select name="capital_currency" value={startupData.capital_currency} onChange={e => setStartupData({...startupData, capital_currency: e.target.value})} className="w-1/3 input-glass rounded-md p-2 text-brand-secondary">
                          {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                    </div>
                    <input name="monthlyBurn" type="number" placeholder="Monthly Burn" value={startupData.monthlyBurn} onChange={e => setStartupData({...startupData, monthlyBurn: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                    <input name="teamSize" type="number" placeholder="Team Size" value={startupData.teamSize} onChange={e => setStartupData({...startupData, teamSize: Number(e.target.value)})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                </div>
                <input name="monetizationModel" placeholder="Monetization (e.g., SaaS)" value={startupData.monetizationModel} onChange={e => setStartupData({...startupData, monetizationModel: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" />
                <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow">
                    {isLoading ? <Spinner /> : 'Run "Startup" Simulation'}
                </button>
            </form>
        )}

        {activeTab === 'marriage' && (
             <form onSubmit={handleMarriageSubmit} className="space-y-4 animate-fade-in">
                <p className="text-sm text-brand-muted text-center">Model the financial and lifestyle impact of a partnership.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex gap-2 col-span-2">
                      <span className="flex items-center px-3 text-brand-muted bg-brand-bg rounded-l-md border border-r-0 border-brand-border">Partner Currency</span>
                      <select name="partner_currency" value={marriageData.partner_currency} onChange={e => setMarriageData({...marriageData, partner_currency: e.target.value})} className="w-full input-glass rounded-r-md p-2 text-brand-secondary">
                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                      </select>
                  </div>
                  <input name="partnerIncome" type="number" placeholder="Partner's Annual Income" value={marriageData.partnerIncome} onChange={e => setMarriageData({...marriageData, partnerIncome: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                  <input name="partnerAssets" type="number" placeholder="Partner's Total Assets" value={marriageData.partnerAssets} onChange={e => setMarriageData({...marriageData, partnerAssets: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                  <input name="partnerLiabilities" type="number" placeholder="Partner's Total Liabilities" value={marriageData.partnerLiabilities} onChange={e => setMarriageData({...marriageData, partnerLiabilities: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                  <select name="childrenPlan" value={marriageData.childrenPlan} onChange={e => setMarriageData({...marriageData, childrenPlan: e.target.value as any})} className="w-full input-glass rounded-md p-2 text-brand-secondary">
                      <option value="undecided">Children Plan: Undecided</option>
                      <option value="yes">Children Plan: Yes</option>
                      <option value="no">Children Plan: No</option>
                  </select>
                </div>
                <input name="sharedGoal" placeholder="Primary Shared Goal (e.g., Buy a house)" value={marriageData.sharedGoal} onChange={e => setMarriageData({...marriageData, sharedGoal: e.target.value})} className="w-full input-glass rounded-md p-2 text-brand-secondary" required />
                <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow">
                    {isLoading ? <Spinner /> : 'Run "Marriage" Simulation'}
                </button>
            </form>
        )}

        {error && <p className="mt-4 text-center text-red-400">{error}</p>}
      </div>
      
      {comparison && (
        <div id="printable-scenario" className="mt-8">
            <div className="glass-effect rounded-lg p-8 animate-fade-in print-bg-white">
                <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-brand-secondary mb-4 print-text-black">Simulation Results</h3>
                    <button onClick={handlePrint} className="print-hide inline-flex items-center gap-2 px-3 py-1.5 border border-brand-border text-xs font-medium rounded-md text-brand-secondary bg-brand-surface/50 hover:bg-brand-surface">
                        <PrintIcon className="h-4 w-4" />
                        Print / Download PDF
                    </button>
                </div>

                <p className="text-brand-muted italic mb-6 print-text-black">"{comparison.summary}"</p>
                
                <div className="overflow-x-auto mb-8">
                  <table className="min-w-full divide-y divide-brand-border print-border-gray">
                    <thead className="bg-brand-bg/50 print-bg-white">
                      <tr>
                        <th scope="col" className="w-2/3 px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider print-text-black">Metric</th>
                        <th scope="col" className="w-1/3 px-6 py-3 text-left text-xs font-medium text-brand-muted uppercase tracking-wider print-text-black">Current Path</th>
                      </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-brand-border print-border-gray">
                      {comparison.comparison_points.map((point, index) => (
                        <tr key={index} className="hover:bg-brand-bg/50 print-no-break">
                          <td className="px-6 py-4 whitespace-normal align-top">
                            <div className="text-sm font-bold text-brand-secondary print-text-black">{point.metric}</div>
                            <div className="text-sm text-brand-muted print-text-black mt-2">{point.scenario}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-normal align-top text-sm text-brand-secondary print-text-black">{point.current}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="print-no-break">
                    <h4 className="text-xl font-bold text-brand-secondary mb-4 flex items-center gap-2 print-text-black"><RiskIcon className="h-6 w-6" />Risk Factors</h4>
                    <div className="space-y-3">
                        {comparison.risk_factors.map((factor, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className={`flex-shrink-0 mt-1 text-xs font-medium px-2 py-0.5 rounded-full border ${severityMap[factor.severity]}`}>
                                    {factor.severity.toUpperCase()}
                                </span>
                                <p className="text-brand-muted print-text-black">{factor.risk}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
