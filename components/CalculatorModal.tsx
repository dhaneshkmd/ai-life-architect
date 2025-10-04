import React, { useState } from 'react';
import Modal from './Modal';
import { UserProfile } from '../types';

type CalculatorType = 'income' | 'netWorth' | 'savingsRate' | 'liabilities';

interface CalculatorModalProps {
    type: CalculatorType;
    currency: string;
    initialFinanceData: UserProfile['finance'];
    onClose: () => void;
    onSave: (data: { value: number; liabilities?: number }) => void;
}

// A safe parsing function to prevent NaN values.
// parseFloat('') returns NaN, so we default it to 0.
const safeParse = (val: any): number => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
};


const CalculatorModal: React.FC<CalculatorModalProps> = ({ type, currency, initialFinanceData, onClose, onSave }) => {
    // State is now initialized directly from props using the safeParse function.
    // The parent component must provide a unique `key` to this component
    // each time it opens to ensure the state is reset correctly.
    const [incomeData, setIncomeData] = useState(() => ({
        salary: type === 'income' ? safeParse(initialFinanceData.income) : 0,
        bonus: 0,
        other: 0,
    }));
    
    const [netWorthData, setNetWorthData] = useState(() => ({
        assets: type === 'netWorth' ? safeParse(initialFinanceData.netWorth + initialFinanceData.liabilities) : 0,
        liabilities: type === 'netWorth' ? safeParse(initialFinanceData.liabilities) : 0,
    }));

    const [savingsData, setSavingsData] = useState(() => ({
        monthlyIncome: type === 'savingsRate' ? safeParse(initialFinanceData.income / 12) : 0,
        retirement: 0,
        investments: 0,
        cash: 0,
    }));

    const [liabilitiesData, setLiabilitiesData] = useState({
        mortgage: 0, studentLoan: 0, creditCard: 0, autoLoan: 0, other: 0,
    });


    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    const handleSave = () => {
        let result: { value: number; liabilities?: number } = { value: 0 };
        if (type === 'income') {
            result.value = safeParse(incomeData.salary) + safeParse(incomeData.bonus) + safeParse(incomeData.other);
        } else if (type === 'netWorth') {
            result.value = safeParse(netWorthData.assets) - safeParse(netWorthData.liabilities);
            result.liabilities = safeParse(netWorthData.liabilities);
        } else if (type === 'savingsRate') {
            const totalSavings = safeParse(savingsData.retirement) + safeParse(savingsData.investments) + safeParse(savingsData.cash);
            const monthlyIncome = safeParse(savingsData.monthlyIncome);
            result.value = monthlyIncome > 0 ? totalSavings / monthlyIncome : 0;
        } else if (type === 'liabilities') {
            result.value = safeParse(liabilitiesData.mortgage) + safeParse(liabilitiesData.studentLoan) + safeParse(liabilitiesData.creditCard) + safeParse(liabilitiesData.autoLoan) + safeParse(liabilitiesData.other);
        }
        onSave(result);
    };

    const renderCalculator = () => {
        switch (type) {
            case 'income':
                const totalIncome = safeParse(incomeData.salary) + safeParse(incomeData.bonus) + safeParse(incomeData.other);
                return (
                    <div className="space-y-4">
                        <CalcInput currency={currency} label="Annual Salary (pre-tax)" value={incomeData.salary} onChange={e => setIncomeData({...incomeData, salary: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Annual Bonus (estimate)" value={incomeData.bonus} onChange={e => setIncomeData({...incomeData, bonus: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Other Annual Income" value={incomeData.other} onChange={e => setIncomeData({...incomeData, other: safeParse(e.target.value)})} />
                        <div className="border-t border-brand-border pt-4 text-right">
                            <p className="text-brand-muted">Total Annual Income</p>
                            <p className="text-2xl font-bold text-brand-secondary">
                                {formatCurrency(totalIncome)}
                            </p>
                        </div>
                    </div>
                );
            case 'netWorth':
                 const totalNetWorth = safeParse(netWorthData.assets) - safeParse(netWorthData.liabilities);
                return (
                     <div className="space-y-4">
                        <CalcInput currency={currency} label="Total Assets (Cash, Investments, etc.)" value={netWorthData.assets} onChange={e => setNetWorthData({...netWorthData, assets: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Total Liabilities (Debt, Loans, etc.)" value={netWorthData.liabilities} onChange={e => setNetWorthData({...netWorthData, liabilities: safeParse(e.target.value)})} />
                        <div className="border-t border-brand-border pt-4 text-right">
                            <p className="text-brand-muted">Estimated Net Worth</p>
                            <p className="text-2xl font-bold text-brand-secondary">
                                {formatCurrency(totalNetWorth)}
                            </p>
                        </div>
                    </div>
                );
            case 'savingsRate':
                 const totalSavings = safeParse(savingsData.retirement) + safeParse(savingsData.investments) + safeParse(savingsData.cash);
                 const monthlyIncome = safeParse(savingsData.monthlyIncome);
                 const rate = monthlyIncome > 0 ? (totalSavings / monthlyIncome) * 100 : 0;
                 return (
                     <div className="space-y-4">
                        <div>
                            <CalcInput currency={currency} label="Monthly Take-Home Income" value={savingsData.monthlyIncome} onChange={e => setSavingsData({...savingsData, monthlyIncome: safeParse(e.target.value)})} />
                            <p className="text-xs text-brand-muted mt-1 px-1">Your income after all taxes and deductions (e.g., health insurance).</p>
                        </div>

                        <div className="border-t border-brand-border pt-4">
                            <p className="text-sm font-medium text-brand-muted mb-2">Average Monthly Savings Breakdown</p>
                             <div className="space-y-3">
                                <CalcInput currency={currency} label="Retirement (401k, IRA)" value={savingsData.retirement} onChange={e => setSavingsData({...savingsData, retirement: safeParse(e.target.value)})} />
                                <CalcInput currency={currency} label="Investments (Brokerage)" value={savingsData.investments} onChange={e => setSavingsData({...savingsData, investments: safeParse(e.target.value)})} />
                                <CalcInput currency={currency} label="Cash Savings (Bank)" value={savingsData.cash} onChange={e => setSavingsData({...savingsData, cash: safeParse(e.target.value)})} />
                             </div>
                        </div>

                        <div className="border-t border-brand-border pt-4 text-right">
                            <p className="text-brand-muted">Calculated Savings Rate</p>
                            <p className="text-2xl font-bold text-brand-secondary">
                                {rate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                );
            case 'liabilities':
                const totalLiabilities = safeParse(liabilitiesData.mortgage) + safeParse(liabilitiesData.studentLoan) + safeParse(liabilitiesData.creditCard) + safeParse(liabilitiesData.autoLoan) + safeParse(liabilitiesData.other);
                return (
                    <div className="space-y-4">
                        <CalcInput currency={currency} label="Mortgage / Rent" value={liabilitiesData.mortgage} onChange={e => setLiabilitiesData({...liabilitiesData, mortgage: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Student Loans" value={liabilitiesData.studentLoan} onChange={e => setLiabilitiesData({...liabilitiesData, studentLoan: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Credit Card Debt" value={liabilitiesData.creditCard} onChange={e => setLiabilitiesData({...liabilitiesData, creditCard: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Auto Loans" value={liabilitiesData.autoLoan} onChange={e => setLiabilitiesData({...liabilitiesData, autoLoan: safeParse(e.target.value)})} />
                        <CalcInput currency={currency} label="Other Loans" value={liabilitiesData.other} onChange={e => setLiabilitiesData({...liabilitiesData, other: safeParse(e.target.value)})} />
                        <div className="border-t border-brand-border pt-4 text-right">
                            <p className="text-brand-muted">Total Liabilities</p>
                            <p className="text-2xl font-bold text-brand-secondary">
                                {formatCurrency(totalLiabilities)}
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const titles = {
        income: "Annual Income Calculator",
        netWorth: "Net Worth Calculator",
        savingsRate: "Savings Rate Calculator",
        liabilities: "Total Liabilities Calculator"
    }

    return (
        <Modal isOpen={true} onClose={onClose} title={titles[type]}>
            <div>
                {renderCalculator()}
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-500 transition-colors">
                        Calculate & Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const CalcInput = ({ label, value, currency, onChange }: { label: string, value: number, currency: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const currencySymbol = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).formatToParts(0).find(p => p.type === 'currency')?.value || currency;
    
    return (
        <div>
            <label className="block text-sm font-medium text-brand-muted mb-1">{label}</label>
            <div className="relative">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">{currencySymbol}</span>
                 <input type="number" value={value} onChange={onChange} className="w-full input-glass rounded-md p-2 pl-7 text-brand-secondary focus:outline-none" />
            </div>
        </div>
    );
}

export default CalculatorModal;