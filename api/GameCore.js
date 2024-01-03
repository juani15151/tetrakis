/**
 * This class is responsible of all the game rules.
 */
class GameCore {

    /**
     * Generates a random 4-digit number composed of unique digits only.
     * @returns {string} A valid 4-digit string to be used as player secret (as checked by isValidNumber()).
     */
    generateNumber() {
        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let number = "";
        for (let i = 0; i < 4; i++) {
            const digitIndex = Math.floor(Math.random() * validDigits.length);
            number += validDigits[digitIndex];
            validDigits.splice(digitIndex, 1);
        }

        return number;
    }

    /**
     * Validates the given string is a 4-digit number without repeated digits.
     * @param number the number to check.
     * @returns {boolean} true if valid, false otherwise.
     */
    isValidNumber(number) {
        if (!number || number.length !== 4) {
            return false;
        }

        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        for (let i = 0; i < 4; i++) {
            const digit = number[i];
            const digitIndex = validDigits.findIndex((element) => element === digit);
            if (digitIndex < 0) {
                return false;
            }
            validDigits.splice(digitIndex, 1);
        }

        return true;
    }

    /**
     * Calculates the amount of Correct and Regular matches that a guess produces over a secret (target) number.
     * @param attempt a player guess
     * @param target a player secret number
     * @returns {number[]} A 2 elements array with the amount of Correct and Regular matches.
     */
    checkNumber(attempt, target) {
        const result = [0, 0];

        for (let i = 0; i < 4; i++) {
            const attemptDigit = attempt[i];
            for (let j = 0; j < 4; j++) {
                const targetDigit = target[j];
                if (attemptDigit === targetDigit) {
                    if (i === j) {
                        result[0]++;
                    } else {
                        result[1]++;
                    }
                }
            }
        }

        return result;
    }

}

module.exports = GameCore;