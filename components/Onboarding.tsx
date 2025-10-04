import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, Pathway, NumerologyReport } from '../types';
import { generatePathway, generateNumerologyReport } from '../services/geminiService';
import Spinner from './Spinner';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import Tooltip from './Tooltip';
import CalculatorModal from './CalculatorModal';

interface OnboardingProps {
  onComplete: (profile: UserProfile, pathway: Pathway, numerologyReport: NumerologyReport) => void;
  userEmail: string;
}

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

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, userEmail }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCalculatorOpen, setCalculatorOpen] = useState<null | 'income' | 'netWorth' | 'savingsRate' | 'liabilities'>(null);
  const [calculatorKey, setCalculatorKey] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: userEmail,
    dob: '',
    sex: '',
    location: '',
    lifeGoal: '',
    values: { growth: 0.5, stability: 0.5, impact: 0.5, family: 0.5 },
    skills: { general: '', ai: '' },
    health: { 
      height: 175, 
      weight: 70, 
      sleepHours: 7, 
      bedTime: '23:00',
      wakeTime: '06:00',
      exerciseFrequency: '1-2_weekly',
      addictionSelfRating: 1,
    },
    finance: { netWorth: 50000, savingsRate: 0.15, income: 60000, liabilities: 10000, currency: 'USD' },
  });

  useEffect(() => {
    const { bedTime, wakeTime } = formData.health;
    if (bedTime && wakeTime) {
        const [bedH, bedM] = bedTime.split(':').map(Number);
        const [wakeH, wakeM] = wakeTime.split(':').map(Number);
        
        let bedDate = new Date();
        bedDate.setHours(bedH, bedM, 0, 0);

        let wakeDate = new Date();
        wakeDate.setHours(wakeH, wakeM, 0, 0);

        if (wakeDate <= bedDate) {
            wakeDate.setDate(wakeDate.getDate() + 1);
        }

        const diffMs = wakeDate.getTime() - bedDate.getTime();
        const diffHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(1));
        
        setFormData(prev => ({
          ...prev,
          health: { ...prev.health, sleepHours: diffHours }
        }));
    }
  }, [formData.health.bedTime, formData.health.wakeTime]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, category: 'values' | 'health' | 'finance' | 'skills') => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: category === 'skills' ? value : parseFloat(value) || value,
      },
    }));
  };
  
  const bmi = useMemo(() => {
    const { height, weight } = formData.health;
    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return '0.0';
  }, [formData.health.height, formData.health.weight]);

  const getBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { text: "Underweight", color: "text-blue-400" };
    if (bmiValue < 25) return { text: "Normal", color: "text-green-400" };
    if (bmiValue < 30) return { text: "Overweight", color: "text-yellow-400" };
    return { text: "Obese", color: "text-red-400" };
  }

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const userProfile: UserProfile = {
      ...formData,
      sex: formData.sex as 'male' | 'female' | 'other',
      skills: {
        general: formData.skills.general.split(',').map(s => s.trim()).filter(Boolean),
        ai: formData.skills.ai.split(',').map(s => s.trim()).filter(Boolean),
      },
      health: {
        ...formData.health,
        exerciseFrequency: formData.health.exerciseFrequency as UserProfile['health']['exerciseFrequency']
      },
      finance: {
        ...formData.finance,
      }
    };
    
    try {
      const [pathway, numerologyReport] = await Promise.all([
        generatePathway(userProfile),
        generateNumerologyReport(userProfile)
      ]);
      onComplete(userProfile, pathway, numerologyReport);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Basics
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-brand-secondary">Welcome to Your Future</h2>
            <p className="text-center text-brand-muted mt-2 mb-8">Let's start with the basics to build your profile.</p>
            <div className="space-y-4">
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full input-glass rounded-md p-2 text-brand-secondary focus:outline-none" />
              <input name="location" value={formData.location} onChange={handleChange} placeholder="Current City, Country" className="w-full input-glass rounded-md p-2 text-brand-secondary focus:outline-none" />
              <div className="flex gap-4">
                <input name="dob" type="date" value={formData.dob} onChange={handleChange} className="w-full input-glass rounded-md p-2 text-brand-secondary focus:outline-none" />
                <select name="sex" value={formData.sex} onChange={handleChange} className="w-full input-glass rounded-md p-2 text-brand-secondary focus:outline-none" required>
                  <option value="" disabled>Select Sex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="mt-8 text-right">
              <button onClick={handleNext} disabled={!formData.name || !formData.dob || !formData.location || !formData.sex} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow">Next <ArrowRightIcon className="ml-3 h-5 w-5" /></button>
            </div>
          </div>
        );
      case 2: // Values
        const valueExplanations = {
            growth: "Prioritizing learning, new experiences, and personal development.",
            stability: "Valuing security, predictability, and a steady path in career and life.",
            impact: "Focusing on making a significant difference in your community or the world.",
            family: "Placing high importance on relationships with family and loved ones.",
        };
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-brand-secondary">Calibrate Your Values</h2>
            <p className="text-center text-brand-muted mt-2 mb-8">Adjust the sliders to reflect what matters most to you right now. This helps the AI tailor your plan.</p>
            <div className="space-y-6">
              {Object.entries(formData.values).map(([key, value]) => (
                <div key={key}>
                  {/* FIX: Cast 'value' to a number before calling 'toFixed' to resolve TypeScript error. */}
                  <label className="capitalize flex justify-between text-brand-muted"><span className="font-medium text-brand-secondary">{key}</span> <span>{(value as number).toFixed(2)}</span></label>
                  <input type="range" name={key} min="0" max="1" step="0.01" value={value} onChange={(e) => handleNestedChange(e, 'values')} className="w-full h-2 bg-brand-border rounded-lg appearance-none cursor-pointer accent-brand-primary" />
                  <p className="text-xs text-brand-muted mt-1">{valueExplanations[key as keyof typeof valueExplanations]}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <button type="button" onClick={handleBack} className="text-brand-muted hover:text-brand-secondary">Back</button>
              <button onClick={handleNext} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 transition-all hover:shadow-brand-glow">Next <ArrowRightIcon className="ml-3 h-5 w-5" /></button>
            </div>
          </div>
        );
      case 3: // Skills
        return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-brand-secondary">What Are Your Skills?</h2>
                <p className="text-center text-brand-muted mt-2 mb-8">List your key skills, separated by commas. This helps in career pathway generation.</p>
                <div className="space-y-6">
                    <InputField label="General Skills" name="general" type="textarea" value={formData.skills.general} onChange={e => handleNestedChange(e, 'skills')} tooltip="e.g., Project Management, Public Speaking, Data Analysis" />
                    <InputField label="AI-related Skills" name="ai" type="textarea" value={formData.skills.ai} onChange={e => handleNestedChange(e, 'skills')} tooltip="e.g., Python, Machine Learning, Prompt Engineering, LangChain" />
                </div>
                <div className="mt-8 flex justify-between">
                    <button type="button" onClick={handleBack} className="text-brand-muted hover:text-brand-secondary">Back</button>
                    <button onClick={handleNext} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 transition-all hover:shadow-brand-glow">Next <ArrowRightIcon className="ml-3 h-5 w-5" /></button>
                </div>
            </div>
        )
       case 4: // Health
        const bmiValue = parseFloat(bmi);
        const bmiCategory = getBmiCategory(bmiValue);
        return (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-brand-secondary">Health & Lifestyle Metrics</h2>
                <p className="text-center text-brand-muted mt-2 mb-8">Honest inputs here lead to a more realistic and achievable plan.</p>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <InputField label="Height (cm)" name="height" type="number" value={formData.health.height} onChange={e => handleNestedChange(e, 'health')} tooltip="Your height in centimeters." />
                        <InputField label="Weight (kg)" name="weight" type="number" value={formData.health.weight} onChange={e => handleNestedChange(e, 'health')} tooltip="Your weight in kilograms." />
                        <div className="input-glass rounded-md p-3 col-span-1 md:col-span-2 flex justify-between items-center">
                          <div className="flex items-center"><span className="font-medium text-brand-muted">Calculated BMI</span><Tooltip text="Body Mass Index. A general indicator of healthy body weight." /></div>
                          <div><span className="text-xl font-bold text-brand-secondary">{bmi}</span><span className={`ml-2 text-sm font-semibold ${bmiCategory.color}`}>{bmiCategory.text}</span></div>
                        </div>
                    </div>
                    
                    <div className="input-glass rounded-md p-3">
                         <label className="block text-sm font-medium text-brand-muted mb-2">Sleep Calculator</label>
                         <div className="flex items-center gap-4">
                            <InputField label="Bedtime" name="bedTime" type="time" value={formData.health.bedTime} onChange={e => handleNestedChange(e, 'health')} />
                            <InputField label="Wake-up" name="wakeTime" type="time" value={formData.health.wakeTime} onChange={e => handleNestedChange(e, 'health')} />
                            <div className="text-center flex-grow">
                                <div className="text-xs text-brand-muted">Avg. Sleep</div>
                                <div className="text-lg font-bold text-brand-secondary">{formData.health.sleepHours} hrs</div>
                            </div>
                         </div>
                    </div>

                    <SelectField label="How often do you exercise?" name="exerciseFrequency" value={formData.health.exerciseFrequency} onChange={e => handleNestedChange(e, 'health')} options={[
                        {label: 'Daily', value: 'daily'},
                        {label: '3-5 times a week', value: '3-5_weekly'},
                        {label: '1-2 times a week', value: '1-2_weekly'},
                        {label: 'Rarely or Never', value: 'rarely'},
                    ]} />

                    <InputField label="Addiction Self-Rating (Smoking, Alcohol, etc.)" name="addictionSelfRating" type="range" min="1" max="5" step="1" value={formData.health.addictionSelfRating} onChange={e => handleNestedChange(e, 'health')} tooltip="Rate the impact of any addictive habits on your life. 1 = None, 5 = Significant Impact." />
                </div>
                <div className="mt-8 flex justify-between">
                    <button type="button" onClick={handleBack} className="text-brand-muted hover:text-brand-secondary">Back</button>
                    <button onClick={handleNext} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 transition-all hover:shadow-brand-glow">Next <ArrowRightIcon className="ml-3 h-5 w-5" /></button>
                </div>
            </div>
        );
      case 5: // Finance & Goal
         return (
            <form onSubmit={handleSubmit} className="animate-fade-in">
                <h2 className="text-2xl font-bold text-center text-brand-secondary">Finance & Final Goal</h2>
                <p className="text-center text-brand-muted mt-2 mb-8">Finally, let's look at your finances and define your north star.</p>
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-brand-secondary border-b border-brand-border pb-2">Financial Metrics</h3>
                    <div className="space-y-4">
                        <SelectField label="Default Currency" name="currency" value={formData.finance.currency} onChange={e => handleNestedChange(e, 'finance')} options={currencies.map(c => ({label: `${c.code} - ${c.name}`, value: c.code}))} />
                        <CalculatorButton label="Annual Income" value={formData.finance.income.toLocaleString('en-US', { style: 'currency', currency: formData.finance.currency, minimumFractionDigits: 0 })} onClick={() => {
                            setCalculatorOpen('income');
                            setCalculatorKey(k => k + 1);
                        }} />
                        <CalculatorButton label="Net Worth" value={formData.finance.netWorth.toLocaleString('en-US', { style: 'currency', currency: formData.finance.currency, minimumFractionDigits: 0 })} onClick={() => {
                            setCalculatorOpen('netWorth');
                            setCalculatorKey(k => k + 1);
                        }} />
                        <CalculatorButton label="Total Liabilities" value={formData.finance.liabilities.toLocaleString('en-US', { style: 'currency', currency: formData.finance.currency, minimumFractionDigits: 0 })} onClick={() => {
                            setCalculatorOpen('liabilities');
                            setCalculatorKey(k => k + 1);
                        }} />
                        <CalculatorButton label="Savings Rate" value={`${(formData.finance.savingsRate * 100).toFixed(0)}%`} onClick={() => {
                            setCalculatorOpen('savingsRate');
                            setCalculatorKey(k => k + 1);
                        }} />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-brand-muted">What is your primary life goal for the next 10 years?</label>
                        <textarea name="lifeGoal" value={formData.lifeGoal} onChange={handleChange} rows={3} className="mt-1 w-full input-glass rounded-md p-2 text-brand-secondary focus:outline-none" placeholder="e.g., Achieve financial independence, start a family, build a successful company..." />
                    </div>
                </div>
                {error && <p className="mt-4 text-center text-red-400">{error}</p>}
                <div className="mt-8 flex justify-between items-center">
                    <button type="button" onClick={handleBack} className="text-brand-muted hover:text-brand-secondary">Back</button>
                    <button type="submit" disabled={isLoading} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-brand-primary hover:bg-blue-500 disabled:bg-gray-600 transition-all hover:shadow-brand-glow">{isLoading ? <Spinner /> : 'Generate My 10-Year Arc'}</button>
                </div>
            </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto glass-effect p-8 rounded-lg shadow-lg">
        {renderStep()}
      </div>
      {isCalculatorOpen && (
        <CalculatorModal 
            key={calculatorKey}
            type={isCalculatorOpen} 
            currency={formData.finance.currency}
            initialFinanceData={formData.finance}
            onClose={() => setCalculatorOpen(null)}
            onSave={(data) => {
                setFormData(prev => {
                    const oldFinance = prev.finance;
                    const updatedFinance = { ...oldFinance };
                    const key = isCalculatorOpen as keyof typeof formData.finance;

                    if (isCalculatorOpen === 'netWorth') {
                        updatedFinance.netWorth = data.value;
                        if (data.liabilities !== undefined) {
                            updatedFinance.liabilities = data.liabilities;
                        }
                    } else if (isCalculatorOpen === 'liabilities') {
                        const newLiabilities = data.value;
                        const assets = oldFinance.netWorth + oldFinance.liabilities;
                        updatedFinance.liabilities = newLiabilities;
                        updatedFinance.netWorth = assets - newLiabilities;
                    } else {
                        // This handles 'income' and 'savingsRate'
                        (updatedFinance as any)[key] = data.value;
                    }

                    return { ...prev, finance: updatedFinance };
                });
                setCalculatorOpen(null);
            }}
        />
      )}
    </>
  );
};

const InputField = ({ label, name, type, value, onChange, tooltip, min, max, step }: any) => (
    <div className="w-full">
        <label htmlFor={name} className="block text-sm font-medium text-brand-muted flex items-center mb-1">
            {label}
            {tooltip && <Tooltip text={tooltip} />}
        </label>
        {type === 'textarea' ? (
             <textarea id={name} name={name} value={value} onChange={onChange} rows={3} className="block w-full input-glass rounded-md shadow-sm py-2 px-3 text-brand-secondary focus:outline-none sm:text-sm" placeholder={tooltip}/>
        ) : (
            <input
                id={name} name={name} type={type} value={value} onChange={onChange} min={min} max={max} step={step}
                className={`block w-full input-glass rounded-md shadow-sm py-2 px-3 text-brand-secondary focus:outline-none sm:text-sm ${type === 'range' ? 'accent-brand-primary h-2 cursor-pointer p-0' : ''}`}
            />
        )}
        {type === 'range' && <div className="text-right text-xs text-brand-muted mt-1">{value} / 5</div>}
    </div>
);

const SelectField = ({ label, name, value, onChange, options }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-muted mb-1">{label}</label>
        <select id={name} name={name} value={value} onChange={onChange} className="block w-full input-glass rounded-md shadow-sm py-2 px-3 text-brand-secondary focus:outline-none sm:text-sm">
            {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const CalculatorButton = ({ label, value, onClick }: { label: string, value: string, onClick: () => void }) => (
    <div className="input-glass rounded-md p-3 flex justify-between items-center">
        <span className="font-medium text-brand-muted">{label}</span>
        <div className="flex items-center gap-4">
            <span className="text-lg font-bold text-brand-secondary">{value}</span>
            <button type="button" onClick={onClick} className="text-xs font-semibold text-brand-primary hover:underline">CALCULATE</button>
        </div>
    </div>
)

export default Onboarding;