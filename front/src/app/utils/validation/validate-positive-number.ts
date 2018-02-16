import { createBigNumber, ZERO } from '../create-big-number';

export function validatePositiveNumber(value: string): string[] {
    const result = [];

    if (value === '') {
        result.push('Required value');
    } else {
        const amount = createBigNumber(value);

        if (amount === undefined) {
            result.push('Incorrect amount');
        } else if (amount.lte(ZERO)) {
            result.push('Value should be positive');
        }
    }

    return result;
}

export default validatePositiveNumber;
