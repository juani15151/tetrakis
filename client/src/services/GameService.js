class Player { // interface
    isBot
    id
    name
    number
    target
    attempts
    isPlaying
    isFinished
    wantsReplay
}

class Attempt { // interface
    number
    result // Array: [B, R]
}

export default class GameService {

    constructor() {
        this.stateListeners = [];
        this.state = {
            players: {}
        }
    }

    destroy() {

    }

    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    setState(nextState) {
        this.state = this.getState();
        Object.assign(this.state, nextState);
        this.stateListeners.forEach((fn) => fn.call(this, this.getState()));
    }

    registerStateListener(fn) {
        this.stateListeners.push(fn);
        return fn;
    }

    removeStateListener(fn) {
        this.stateListeners = this.stateListeners.filter((item) => item !== fn);
    }

    async actionAttempt(playerID, attempt) {
        if (!GameUtils.isValidNumber(attempt) || this.state.players[playerID].isFinished) {
            return;
        }

        const result = await this._checkNumber(attempt, this.state.players[playerID].target);

        const state = this.getState();
        state.players[playerID].attempts.push({
            number: attempt,
            result: result,
        });
        state.players[playerID].isFinished = result[0] === 4;

        this.onAfterActionAttempt(playerID, attempt, state);
        this.setState(state);
    }

    async _checkNumber(attempt, target) {
        return GameUtils.checkNumber(attempt, target);
    }

    onAfterActionAttempt(playerID, attempt, state) {
        // Extension point for subclasses.
    }

    actionSurrender(playerID) {
        const state = this.getState();
        state.players[playerID].isFinished = true;
        // TODO: If surrenders during his turn, should set the other player as isPlaying.

        this.setState(state);
    }

    actionSetNumber(playerID, number) {
        // TODO: Validate is empty.
        const state = this.getState();
        state.players[playerID].number = number;

        this.onAfterActionSetNumber(playerID, number, state);
        this.setState(state);
    }

    actionPlayAgain(playerID) {
        throw Error("Not implemented"); // MUST be implemented by subclasses.
    }

    onAfterActionSetNumber(playerID, number, state) {
        // Extension point for subclasses.
    }

    isPlayerEnabled(player) {
        throw Error("Not implemented"); // MUST be implemented by subclasses.
    }

    getOpponent(currentPlayer) {
        return Object.values(this.getState().players)
            .find((player) => player.id !== currentPlayer.id);
    }
}

export class GameUtils {

    static generateNumber() {
        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let number = "";
        for (let i = 0; i < 4; i++) {
            const digitIndex = Math.floor(Math.random() * validDigits.length);
            number += validDigits[digitIndex];
            validDigits.splice(digitIndex, 1);
        }

        return number;
    }

    static isValidNumber(number) {
        if (number.length !== 4) {
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

    static checkNumber(attempt, target) {
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