
import { UserProfile, Pathway, ScenarioComparison, StartupScenarioInput, MoveCountryScenarioInput, NumerologyReport, MarriageScenarioInput } from '../types';
import { generateStaticPathway, generateStaticNumerologyReport, generateStaticComparison } from '../utils/localPlanner';


export const generatePathway = async (profile: UserProfile): Promise<Pathway> => {
    console.log("Generating static pathway for:", profile.name);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateStaticPathway();
};

export const generateNumerologyReport = async (profile: UserProfile): Promise<NumerologyReport> => {
    console.log("Generating static numerology report for:", profile.name);
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateStaticNumerologyReport();
};

export const compareMoveCountryScenario = async (profile: UserProfile, scenario: MoveCountryScenarioInput): Promise<ScenarioComparison> => {
    console.log("Generating static comparison for Move Country scenario:", scenario);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateStaticComparison();
};

export const compareStartupScenario = async (profile: UserProfile, scenario: StartupScenarioInput): Promise<ScenarioComparison> => {
    console.log("Generating static comparison for Startup scenario:", scenario);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateStaticComparison();
};

export const compareMarriageScenario = async (profile: UserProfile, scenario: MarriageScenarioInput): Promise<ScenarioComparison> => {
    console.log("Generating static comparison for Marriage scenario:", scenario);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return generateStaticComparison();
};