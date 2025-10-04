
const sumDigits = (num: number): number => {
    let sum = 0;
    while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
    }
    return sum;
};

export const calculateLifePathNumber = (dob: string): number => {
    if (!dob) return 0;
    
    const [year, month, day] = dob.split('-').map(Number);

    let yearSum = year;
    while (yearSum > 9) {
        yearSum = sumDigits(yearSum);
    }

    let monthSum = month;
    while (monthSum > 9 && monthSum !== 11) {
        monthSum = sumDigits(monthSum);
    }

    let daySum = day;
    while (daySum > 9 && daySum !== 11 && daySum !== 22) {
        daySum = sumDigits(daySum);
    }

    let totalSum = yearSum + monthSum + daySum;

    while (totalSum > 9 && totalSum !== 11 && totalSum !== 22 && totalSum !== 33) {
        totalSum = sumDigits(totalSum);
    }

    return totalSum;
};
