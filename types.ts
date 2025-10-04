// types.ts

export interface UserProfile {
  name: string;
  email: string;
  dob: string; // ISO: YYYY-MM-DD
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
    height: number; // cm
    weight: number; // kg
    sleepHours: number;
    exerciseFrequency: 'daily' | '3-5_weekly' | '1-2_weekly' | 'rarely';
    addictionSelfRating: number; // 1-5
  };
  finance: {
    netWorth: number;
    savingsRate: number;
    income: number;
    liabilities: number;
    currency: string;
  };
}

/* ---------- Pathway ---------- */

export interface Epoch {
  /** For year-based plans, this is a single year, e.g. "2026" */
  years: string;
  theme: string;
  milestones: string[];
  habits: string[];
}

export interface Pathway {
  horizon_years: number;   // e.g. 10
  epochs: Epoch[];         // usually 10 epochs (one per year)
  risks: string[];
  leading_indicators: string[];
}

/* ---------- Numerology ---------- */

export interface PinnacleOrChallenge {
  cycle: number;           // 1..4
  startYear: number;       // calendar year
  endYear: number;         // calendar year
  number: number;          // pinnacle/challenge number
  meaning: string;         // human-readable meaning
}

export interface PersonalYearForecast {
  year: number;            // calendar year
  number: number;          // personal year number
  theme: string;           // short theme/description
}

export interface NumerologyReport {
  // Existing fields (kept for compatibility)
  life_path_number: number;
  life_path_interpretation: string;
  expression_number: number;
  expression_interpretation: string;
  soul_urge_number: number;
  soul_urge_interpretation: string;

  // New detailed fields
  personality_number?: number;
  personality_interpretation?: string;

  maturity_number?: number;
  maturity_interpretation?: string;

  birthday_number?: number;
  birthday_interpretation?: string;

  pinnacles?: PinnacleOrChallenge[];
  challenges?: PinnacleOrChallenge[];

  /** Next 10 years forecast */
  personal_years?: PersonalYearForecast[];

  summary: string;
}

/* ---------- Scenario inputs / comparisons ---------- */

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

export type ScenarioInput =
  | MoveCountryScenarioInput
  | StartupScenarioInput
  | MarriageScenarioInput;

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
