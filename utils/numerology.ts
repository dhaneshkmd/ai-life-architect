const sumDigits = (num: number): number => {
  return num
    .toString()
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);
};

export const calculateLifePathNumber = (dob: string): number => {
  if (!dob) return 0;

  // Expecting ISO format YYYY-MM-DD
  const digits = dob.replace(/[^0-9]/g, ''); // strip non-digits
  let totalSum = digits
    .split('')
    .map(Number)
    .reduce((a, b) => a + b, 0);

  const masterNumbers = new Set([11, 22, 33]);

  while (totalSum > 9 && !masterNumbers.has(totalSum)) {
    totalSum = sumDigits(totalSum);
  }

  return totalSum;
};
