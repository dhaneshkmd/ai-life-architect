export interface UserProfile {
  name: string;
  email: string;
  dob: string;
  sex: 'male' | 'female' | 'other';
  location: string;
  lifeGoal: string;
  values: {
    growth: number;
    stability: number;
    impact: number;
    family: number;
  };
  skills: {
    general: string[];
    ai: string[];
  };
  health: {
    height: number; // in cm
    weight: number; // in kg
    sleepHours: number;
    exerciseFrequency: 'daily' | '3-5_weekly' | '1-2_weekly' | 'rarely';
    addictionSelfRating: number; // 1-5 scale
  };
  finance: {
    netWorth: number;
    savingsRate: number;
    income: number;
    liabilities: number;
    currency: string;
  };
}

export interface Epoch {
  years: string;
  theme: string;
  milestones: string[];
  habits: string[];
}

export interface Pathway {
  horizon_years: number;
  epochs: Epoch[];
  risks: string[];
  leading_indicators: string[];
}

export interface NumerologyReport {
  life_path_number: number;
  life_path_interpretation: string;
  expression_number: number;
  expression_interpretation: string;
  soul_urge_number: number;
  soul_urge_interpretation: string;
  summary: string;
}

export interface MoveCountryScenarioInput {
  type: 'move_country';
  from: string;
  to: string;
  expected_salary: number;
  expected_salary_currency: string;
  dependents: number;
  visa: string;
  jobOffer: boolean;
  reasonForMoving: string;
  estimatedMonthlyLivingCost: number;
}

export interface StartupScenarioInput {
    type: 'start_business';
    businessIdea: string;
    initialCapital: number;
    monthlyBurn: number;
    capital_currency: string;
    monetizationModel: string;
    industry: string;
    teamSize: number;
    targetMarket: string;
}

export interface MarriageScenarioInput {
    type: 'marriage';
    partnerIncome: number;
    partnerAssets: number;
    partnerLiabilities: number;
    partner_currency: string;
    childrenPlan: 'yes' | 'no' | 'undecided';
    sharedGoal: string;
}

export type ScenarioInput = MoveCountryScenarioInput | StartupScenarioInput | MarriageScenarioInput;


export interface ScenarioComparison {
  summary: string;
  comparison_points: {
    metric: string;
    current: string;
    scenario: string;
    insight: string;
  }[];
  risk_factors: {
    risk: string;
    severity: 'High' | 'Medium' | 'Low';
  }[];
}