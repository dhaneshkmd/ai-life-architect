import {
  UserProfile,
  Pathway,
  ScenarioComparison,
  StartupScenarioInput,
  MoveCountryScenarioInput,
  NumerologyReport,
  MarriageScenarioInput,
} from '../types';

import { generateStaticPathway, generateStaticComparison } from '../utils/localPlanner';
import { calculateLifePathNumber } from '../utils/numerology';

/**
 * All generators work offline. Pathway & comparisons stay static.
 * Numerology report is now computed from the user's DOB + name (no more hard-coded 8).
 */

export const generatePathway = async (profile: UserProfile): Promise<Pathway> => {
  console.log('Generating static pathway for:', profile.name);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateStaticPathway();
};

export const generateNumerologyReport = async (profile: UserProfile): Promise<NumerologyReport> => {
  console.log('Generating numerology report (dynamic) for:', profile.name);
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Life Path from DOB (supports Master Numbers 11/22/33 without reducing further)
  const lifePath = calculateLifePathNumber(profile.dob);

  // Deterministic, offline-friendly derivations from the name:
  const baseName = (profile.name || '').replace(/[^A-Za-z]/g, '').toUpperCase();
  const vowels = new Set(['A', 'E', 'I', 'O', 'U', 'Y']); // include Y

  const charVal = (ch: string) => {
    const n = ch.charCodeAt(0) - 64; // A=1..Z=26
    return n >= 1 && n <= 26 ? n : 0;
  };

  const reduceWithMasters = (n: number) => {
    const masters = new Set([11, 22, 33]);
    while (n > 9 && !masters.has(n)) {
      n = (n + '').split('').map(Number).reduce((a, b) => a + b, 0);
    }
    return n;
  };

  const sumAll = Array.from(baseName).reduce((a, c) => a + charVal(c), 0);
  const sumVowels = Array.from(baseName)
    .filter((c) => vowels.has(c))
    .reduce((a, c) => a + charVal(c), 0);

  const expression = reduceWithMasters(sumAll);
  const soulUrge = reduceWithMasters(sumVowels);

  const report: NumerologyReport = {
    life_path_number: lifePath,
    life_path_interpretation: `Demo interpretation: Your Life Path ${lifePath} reflects your core lessons and trajectory.`,
    expression_number: expression,
    expression_interpretation: `Demo interpretation: Expression ${expression} highlights how you show up and develop your talents.`,
    soul_urge_number: soulUrge,
    soul_urge_interpretation: `Demo interpretation: Soul Urge ${soulUrge} points to your inner motivations and desires.`,
    summary: 'This demonstration report is generated locally so it works without any API key.',
  };

  return report;
};

export const compareMoveCountryScenario = async (
  profile: UserProfile,
  scenario: MoveCountryScenarioInput
): Promise<ScenarioComparison> => {
  console.log('Generating static comparison for Move Country scenario:', scenario);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateStaticComparison();
};

export const compareStartupScenario = async (
  profile: UserProfile,
  scenario: StartupScenarioInput
): Promise<ScenarioComparison> => {
  console.log('Generating static comparison for Startup scenario:', scenario);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateStaticComparison();
};

export const compareMarriageScenario = async (
  profile: UserProfile,
  scenario: MarriageScenarioInput
): Promise<ScenarioComparison> => {
  console.log('Generating static comparison for Marriage scenario:', scenario);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateStaticComparison();
};
