/**
 * Process number format: XXXXXXX-XX.YYYY.X.XX.XXXX
 * Example: 5000918-41.2021.8.13.0487
 */
export const PROCESS_NUMBER_PATTERN = /^\d{7}-\d{2}\.\d{4}\.\d{1,2}\.\d{2}\.\d{4}$/;
export const PROCESS_NUMBER_LENGTH = 25; // Total length with separators: 7-2.4.1.2.4

/**
 * Removes all non-numeric characters from a string
 */
const removeNonNumeric = (value: string): string => {
    return value.replace(/\D/g, '');
};

/**
 * Applies mask to process number input
 * Format: XXXXXXX-XX.YYYY.X.XX.XXXX
 */
export const applyProcessNumberMask = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = removeNonNumeric(value);

    // Limit to maximum length (25 characters with mask)
    const maxLength = 20; // 7+2+4+1+2+4 = 20 digits
    const limitedNumbers = numbers.slice(0, maxLength);

    // Apply mask based on position
    if (limitedNumbers.length === 0) return '';

    let masked = limitedNumbers.slice(0, 7); // First 7 digits

    if (limitedNumbers.length > 7) {
        masked += '-' + limitedNumbers.slice(7, 9); // Next 2 digits with dash
    }

    if (limitedNumbers.length > 9) {
        masked += '.' + limitedNumbers.slice(9, 13); // Next 4 digits with dot
    }

    if (limitedNumbers.length > 13) {
        masked += '.' + limitedNumbers.slice(13, 14); // Next 1 digit with dot
    }

    if (limitedNumbers.length > 14) {
        masked += '.' + limitedNumbers.slice(14, 16); // Next 2 digits with dot
    }

    if (limitedNumbers.length > 16) {
        masked += '.' + limitedNumbers.slice(16, 20); // Last 4 digits with dot
    }

    return masked;
};

/**
 * Validates if process number format is complete and valid
 * Only shows error when the number is complete
 */
export const isCompleteProcessNumber = (value: string): boolean => {
    if (!value.trim()) return false;
    return PROCESS_NUMBER_PATTERN.test(value.trim());
};

/**
 * Validates process number format
 * Format: XXXXXXX-XX.YYYY.X.XX.XXXX (e.g., 5000918-41.2021.8.13.0487)
 */
export const isValidProcessNumber = (value: string): boolean => {
    if (!value.trim()) return true; // Empty is valid (no filter)
    return PROCESS_NUMBER_PATTERN.test(value.trim());
};
