import {
  UserProfile,
  Pathway,
  ScenarioComparison,
  StartupScenarioInput,
  MoveCountryScenarioInput,
  NumerologyReport,
  MarriageScenarioInput,
} from '../types';

import { generateStaticComparison } from '../utils/localPlanner';

import {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateMaturityNumber,
  calculateBirthdayNumber,
  getPersonalYearNumber,
  getPinnaclesAndChallenges,
  numberMeaning,
  personalYearTheme,
  planForPersonalYear,
} from '../utils/numerology';

/* ---------------- Pathway: real 10-year plan from Personal Year numbers ---------------- */

const buildTenYearPathway = (profile: UserProfile): Pathway => {
  const startYear = new Date().getFullYear();

  const epochs = Array.from({ length: 10 }).map((_, i) => {
    const yr = startYear + i;
    const py = getPersonalYearNumber(profile.dob, yr);
    const plan = planForPersonalYear(py);

    return {
      years: `${yr}`,
      theme: plan.theme,
      milestones: plan.milestones,
      habits: plan.habits,
    };
  });

  return {
    horizon_years: 10,
    epochs,
    risks: [
      'Overextension during 5/8 Personal Years; protect bandwidth and recovery.',
      'Stagnation during 4/6 Personal Years; schedule creativity and play.',
      'Misalignment: goals not mapped to yearly energy; review quarterly.',
    ],
    leading_indicators: [
      'Quarterly progress on top-3 milestones',
      'Weekly habit completion rate ≥ 70%',
      'Net energy score trending upward (self-assessed)',
    ],
  };
};

export const generatePathway = async (profile: UserProfile): Promise<Pathway> => {
  console.log('Generating 10-year pathway for:', profile.name);
  await new Promise((resolve) => setTimeout(resolve, 400));
  return buildTenYearPathway(profile);
};

/* ---------------- Numerology: full local report (no API) ---------------- */

export const generateNumerologyReport = async (profile: UserProfile): Promise<NumerologyReport> => {
  console.log('Generating numerology report (detailed) for:', profile.name);
  await new Promise((resolve) => setTimeout(resolve, 400));

  const life = calculateLifePathNumber(profile.dob);
  const expr = calculateExpressionNumber(profile.name);
  const soul = calculateSoulUrgeNumber(profile.name);
  const pers = calculatePersonalityNumber(profile.name);
  const matur = calculateMaturityNumber(life, expr);
  const bday = calculateBirthdayNumber(profile.dob);

  const { pinnacles, challenges } = getPinnaclesAndChallenges(profile.dob, life);

  // Next 10 calendar years forecast
  const startYear = new Date().getFullYear();
  const personal_years = Array.from({ length: 10 }).map((_, i) => {
    const yr = startYear + i;
    const n = getPersonalYearNumber(profile.dob, yr);
    return { year: yr, number: n, theme: personalYearTheme(n) };
  });

  const report: NumerologyReport = {
    life_path_number: life,
    life_path_interpretation: numberMeaning('life', life),

    expression_number: expr,
    expression_interpretation: numberMeaning('expression', expr),

    soul_urge_number: soul,
    soul_urge_interpretation: numberMeaning('soul', soul),

    personality_number: pers,
    personality_interpretation: numberMeaning('personality', pers),

    maturity_number: matur,
    maturity_interpretation: numberMeaning('maturity', matur),

    birthday_number: bday,
    birthday_interpretation: numberMeaning('birthday', bday),

    pinnacles: pinnacles.map(p => ({
      ...p,
      meaning: `Pinnacle ${p.cycle}: ${numberMeaning('life', p.number)}`,
    })),
    challenges: challenges.map(c => ({
      ...c,
      meaning: `Challenge ${c.cycle}: Develop the higher side of ${c.number}—turn friction into mastery.`,
    })),

    personal_years,

    summary:
      'This numerology profile is generated locally from your name and birth date. Use the Personal Year cycle to time moves: start/seed in 1, partner in 2, express in 3, build in 4, pivot in 5, nurture in 6, study in 7, execute/monetize in 8, complete/transition in 9. Master numbers (11/22/33) bring higher responsibility and visibility.',
  };

  return report;
};

/* ---------------- Scenario comparisons (still static for now) ---------------- */

export const compareMoveCountryScenario = async (
  profile: UserProfile,
  scenario: MoveCountryScenarioInput
): Promise<ScenarioComparison> => {
  console.log('Generating static comparison for Move Country scenario:', scenario);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateStaticComparison();
};

export const compareStartupScenario = async (
  profile: UserProfile,
  scenario: StartupScenarioInput
): Promise<ScenarioComparison> => {
  console.log('Generating static comparison for Startup scenario:', scenario);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateStaticComparison();
};

export const compareMarriageScenario = async (
  profile: UserProfile,
  scenario: MarriageScenarioInput
): Promise<ScenarioComparison> => {
  console.log('Generating static comparison for Marriage scenario:', scenario);
  await new Promise((resolve) => setTimeout(resolve, 800));
  return generateStaticComparison();
};
