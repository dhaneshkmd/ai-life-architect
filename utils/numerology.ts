// utils/numerology.ts

// ---------- helpers ----------
const VOWELS = new Set(['A','E','I','O','U','Y']);
const MASTER_SET = new Set([11, 22, 33]);

const LETTER_VAL: Record<string, number> = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

const sumDigits = (n: number): number =>
  n.toString().split('').map(Number).reduce((a,b)=>a+b,0);

const reduceSingle = (n: number): number => {
  while (n > 9) n = sumDigits(n);
  return n;
};

const reduceWithMasters = (n: number): number => {
  while (n > 9 && !MASTER_SET.has(n)) n = sumDigits(n);
  return n;
};

const onlyLetters = (name: string) =>
  (name || '').toUpperCase().replace(/[^A-Z]/g, '');

// ---------- core calculators ----------
export const calculateLifePathNumber = (dob: string): number => {
  if (!dob) return 0;
  const digits = dob.replace(/[^0-9]/g, '');
  let total = digits.split('').map(Number).reduce((a,b)=>a+b,0);
  return reduceWithMasters(total);
};

export const calculateBirthdayNumber = (dob: string): number => {
  if (!dob) return 0;
  const [, , dayStr] = dob.split('-');
  const day = parseInt(dayStr, 10);
  return reduceWithMasters(day);
};

export const calculateExpressionNumber = (name: string): number => {
  const letters = onlyLetters(name);
  const total = [...letters].reduce((a,c)=>a+(LETTER_VAL[c]||0),0);
  return reduceWithMasters(total);
};

export const calculateSoulUrgeNumber = (name: string): number => {
  const letters = onlyLetters(name);
  const total = [...letters].filter(c=>VOWELS.has(c)).reduce((a,c)=>a+(LETTER_VAL[c]||0),0);
  return reduceWithMasters(total);
};

export const calculatePersonalityNumber = (name: string): number => {
  const letters = onlyLetters(name);
  const total = [...letters].filter(c=>!VOWELS.has(c)).reduce((a,c)=>a+(LETTER_VAL[c]||0),0);
  return reduceWithMasters(total);
};

export const calculateMaturityNumber = (lifePath: number, expression: number): number =>
  reduceWithMasters(lifePath + expression);

// ---------- personal year / pinnacles / challenges ----------
export const getPersonalYearNumber = (dob: string, year: number): number => {
  // Common method: reduce(M + D) to single + Universal Year (reduced to single), then allow masters in final reduce
  const [y, m, d] = dob.split('-').map(Number);
  const mR = reduceSingle(m);
  const dR = reduceSingle(d);
  const universal = reduceSingle(year);
  return reduceWithMasters(mR + dR + universal);
};

type Cycle = { cycle: number; startYear: number; endYear: number; number: number };

export const getPinnaclesAndChallenges = (dob: string, lifePath: number) => {
  const [Y, M, D] = dob.split('-').map(Number);
  const birthYear = Y;

  // Reduce to single digits for challenge math
  const m1 = reduceSingle(M);
  const d1 = reduceSingle(D);
  const y1 = reduceSingle(sumDigits(Y));

  // Pinnacles (allow masters)
  const pin1 = reduceWithMasters(m1 + d1);
  const pin2 = reduceWithMasters(d1 + y1);
  const pin3 = reduceWithMasters(pin1 + pin2);
  const pin4 = reduceWithMasters(m1 + y1);

  // Challenges (0–8 range by tradition)
  const ch1 = Math.abs(d1 - m1);
  const ch2 = Math.abs(y1 - d1);
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(m1 - y1);

  // Ages: first cycle = 36 - lifePath; then 9-year cycles
  const firstLen = 36 - lifePath;
  const ranges = [
    { start: 0, end: firstLen },
    { start: firstLen, end: firstLen + 9 },
    { start: firstLen + 9, end: firstLen + 18 },
    { start: firstLen + 18, end: firstLen + 27 },
  ];

  const pins: Cycle[] = [
    { cycle: 1, startYear: birthYear + ranges[0].start, endYear: birthYear + ranges[0].end - 1, number: pin1 },
    { cycle: 2, startYear: birthYear + ranges[1].start, endYear: birthYear + ranges[1].end - 1, number: pin2 },
    { cycle: 3, startYear: birthYear + ranges[2].start, endYear: birthYear + ranges[2].end - 1, number: pin3 },
    { cycle: 4, startYear: birthYear + ranges[3].start, endYear: birthYear + ranges[3].end - 1, number: pin4 },
  ];

  const chs: Cycle[] = [
    { cycle: 1, startYear: pins[0].startYear, endYear: pins[0].endYear, number: ch1 },
    { cycle: 2, startYear: pins[1].startYear, endYear: pins[1].endYear, number: ch2 },
    { cycle: 3, startYear: pins[2].startYear, endYear: pins[2].endYear, number: ch3 },
    { cycle: 4, startYear: pins[3].startYear, endYear: pins[3].endYear, number: ch4 },
  ];

  return { pinnacles: pins, challenges: chs };
};

// ---------- meanings / themes ----------
export const numberMeaning = (kind: 'life'|'expression'|'soul'|'personality'|'maturity'|'birthday', n: number): string => {
  const base: Record<number,string> = {
    1: 'Initiation, independence, leadership, originality.',
    2: 'Cooperation, diplomacy, patience, partnerships.',
    3: 'Creativity, expression, social magnetism, optimism.',
    4: 'Structure, discipline, systems, craftsmanship.',
    5: 'Change, freedom, travel, experimentation.',
    6: 'Responsibility, family, service, care.',
    7: 'Introspection, study, spirituality, analysis.',
    8: 'Power, finance, executive ability, results.',
    9: 'Completion, impact, compassion, legacy.',
    11: 'Illumination, inspiration, teaching at scale (master).',
    22: 'Grand building, practical mastery, institutions (master).',
    33: 'Compassionate mastery, service through teaching/healing (master).',
  };
  return base[n] || '—';
};

export const personalYearTheme = (n: number): string => {
  const t: Record<number,string> = {
    1: 'New beginnings: plant seeds, launch initiatives.',
    2: 'Partnerships & patience: nurture alliances.',
    3: 'Creativity & communication: be seen and share.',
    4: 'Work & structure: build foundations steadily.',
    5: 'Change & adventure: pivot, market, travel.',
    6: 'Responsibility & home: strengthen relationships.',
    7: 'Study & insight: research, retool, restore.',
    8: 'Power & results: execute, lead, monetize.',
    9: 'Completion & impact: finish, release, give back.',
    11: 'Vision & inspiration: teach, publish, mentor.',
    22: 'Build big: systems, teams, long-term assets.',
    33: 'Serve widely: community healing & education.',
  };
  return t[n] || '';
};

export type PersonalYearPlan = {
  theme: string;
  milestones: string[];
  habits: string[];
};

export const planForPersonalYear = (n: number): PersonalYearPlan => {
  const commonHabits = ['Weekly review & planning', 'Daily deep-work block', 'Monthly reflection journal'];

  const lib: Record<number, PersonalYearPlan> = {
    1: {
      theme: personalYearTheme(1),
      milestones: ['Define audacious 3-year vision', 'Start one flagship project', 'Create baseline health & finance dashboards'],
      habits: [...commonHabits, 'Daily 20-minute ideation sprint'],
    },
    2: {
      theme: personalYearTheme(2),
      milestones: ['Secure 2–3 strategic partners', 'Join/lead a professional community', 'Improve conflict-resolution toolkit'],
      habits: [...commonHabits, 'Weekly relationship-nurture sessions'],
    },
    3: {
      theme: personalYearTheme(3),
      milestones: ['Publish consistently (video/blog/social)', 'Prototype a creative product', 'Public speaking or podcast guesting'],
      habits: [...commonHabits, 'Daily creative hour (writing/design)'],
    },
    4: {
      theme: personalYearTheme(4),
      milestones: ['Codify SOPs and systems', 'Ship v1 of internal knowledge base', 'Rebuild budget with 20% buffer'],
      habits: [...commonHabits, 'Block 2× 90-minute system-building sessions/week'],
    },
    5: {
      theme: personalYearTheme(5),
      milestones: ['Test 2 growth channels', 'Travel/field research for opportunities', 'Run one bold experiment/month'],
      habits: [...commonHabits, 'Weekly “market test” ritual'],
    },
    6: {
      theme: personalYearTheme(6),
      milestones: ['Family/mentorship commitments', 'Upgrade home/work environment', 'Launch service/education offering'],
      habits: [...commonHabits, 'Weekly relationship & wellbeing check-in'],
    },
    7: {
      theme: personalYearTheme(7),
      milestones: ['Deep study program', 'Publish a research/report', 'Sabbath day for recovery & reflection'],
      habits: [...commonHabits, 'Daily 30-minute learning block'],
    },
    8: {
      theme: personalYearTheme(8),
      milestones: ['Hit revenue/profit targets', 'Negotiate a major deal', 'Hire or delegate strategically'],
      habits: [...commonHabits, 'Daily KPI review (5 minutes)'],
    },
    9: {
      theme: personalYearTheme(9),
      milestones: ['Close or hand off old projects', 'Philanthropy/impact initiative', 'Storytelling: your decade in review'],
      habits: [...commonHabits, 'Weekly cleanse: remove what no longer serves'],
    },
    11: {
      theme: personalYearTheme(11),
      milestones: ['Publish a signature idea', 'Teach/mentor at scale', 'Design a retreat or masterclass'],
      habits: [...commonHabits, 'Daily reflection: “What light can I bring?”'],
    },
    22: {
      theme: personalYearTheme(22),
      milestones: ['Architect a long-term platform', 'Secure infrastructure/partners', 'Write a 5-year execution roadmap'],
      habits: [...commonHabits, 'Weekly systems review with team'],
    },
    33: {
      theme: personalYearTheme(33),
      milestones: ['Community service program', 'Train future trainers', 'Codify a compassionate leadership model'],
      habits: [...commonHabits, 'Daily kindness act & gratitude log'],
    },
  };

  return lib[n] || lib[1];
};
