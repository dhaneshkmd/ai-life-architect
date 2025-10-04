import { Pathway, NumerologyReport, ScenarioComparison } from '../types';

export const generateStaticPathway = (): Pathway => ({
  horizon_years: 10,
  epochs: [
    {
      years: "Years 1-2",
      theme: "Foundation & Skill Acquisition (Demo)",
      milestones: ["Complete a certification in a new skill.", "Increase savings rate by 5%."],
      habits: ["Dedicate 30 minutes daily to learning.", "Weekly financial review."],
    },
    {
      years: "Years 3-5",
      theme: "Career Acceleration & Impact (Demo)",
      milestones: ["Achieve a promotion or significant project lead.", "Start a side project related to your passion."],
      habits: ["Network with 2 new people in your industry monthly.", "Time block for deep work sessions."],
    },
     {
      years: "Years 6-10",
      theme: "Leadership & Mentorship (Demo)",
      milestones: ["Mentor two junior colleagues.", "Take a leadership role in a community organization."],
      habits: ["Practice active listening in all conversations.", "Delegate tasks effectively."],
    }
  ],
  risks: ["Market downturn affecting job stability.", "Personal burnout from overworking."],
  leading_indicators: ["Monthly progress on skill acquisition.", "Number of meaningful professional connections made."],
});

export const generateStaticNumerologyReport = (): NumerologyReport => ({
    life_path_number: 8,
    life_path_interpretation: "This is a static demo. The Life Path 8 suggests a journey of mastering material and financial worlds, marked by ambition, leadership, and a drive for success. You are a natural executive.",
    expression_number: 1,
    expression_interpretation: "This is a static demo. With an Expression number of 1, you are a natural leader, independent, and a pioneer. You are meant to innovate and lead the way for others.",
    soul_urge_number: 6,
    soul_urge_interpretation: "This is a static demo. A Soul Urge of 6 points to a deep need for harmony, family, and community. You are a natural nurturer and find fulfillment in serving others.",
    summary: "This is a demonstration report. Your numbers indicate a powerful combination of leadership (1), ambition (8), and a deep-seated need for community and harmony (6). Your path involves balancing high achievement with meaningful relationships."
});

export const generateStaticComparison = (): ScenarioComparison => ({
    summary: "This is a static comparison. The proposed scenario offers higher potential rewards but comes with significantly increased risk and uncertainty compared to your current stable path.",
    comparison_points: [
        {
            metric: "Financial Outcome (3-Year)",
            current: "Stable, predictable income growth.",
            scenario: "High variance; potential for significant gains or total loss of capital.",
            insight: "The key trade-off is security for potential upside."
        },
        {
            metric: "Stress & Well-being",
            current: "Low to moderate stress levels.",
            scenario: "High stress levels are almost guaranteed due to uncertainty and workload.",
            insight: "Mental and physical health must be proactively managed in the new scenario."
        },
    ],
    risk_factors: [
        { risk: "Market adoption risk for the new venture.", severity: 'High' },
        { risk: "Cash flow and runway management.", severity: 'High' },
        { risk: "Founder burnout and team dynamics.", severity: 'Medium' },
    ]
});