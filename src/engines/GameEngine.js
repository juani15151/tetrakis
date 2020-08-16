class GameEngine {

    constructor() {
        this.state = {
            mainPlayer: null,
            players: {},
        }
    }

    initialize(player) {
        this.state.mainPlayer = player.id;
        this._addPlayer(player);
    }

    _addPlayer(player) {
        this.state.players[player.id] = {
            id: player.id,
            name: player.name,
            number: null, // Chosen by user, will be opponents target.
            target: null,
            attempts: [],
            enabled: true,
        }
    }

    onAttempt(playerID, attempt) {
        if (!this._isValidNumber(attempt) || !this.state.players[playerID].enabled) {
            return;
        }

        const result = this._checkNumber(attempt, this.state.players[playerID].target);
        const playerState = this.state.players[playerID];

        playerState.attempts = this.state.players[playerID].attempts.concat({
            number: attempt,
            result: result,
        });
        playerState.enabled = result[0] !== 4;
    }

    getPlayers() {
        return Object.assign({}, this.state.players);
    }

    _generateNumber() {
        const validDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

        let number = "";
        for (let i = 0; i < 4; i++) {
            const digitIndex = Math.floor(Math.random() * validDigits.length);
            number += validDigits[digitIndex];
            validDigits.splice(digitIndex, 1);
        }

        return number;
    }

    _isValidNumber(number) {
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

    _checkNumber(attempt, target) {
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

export class SinglePlayerGame extends GameEngine {

    initialize(player) {
        super.initialize(player);
        this.state.players[player.id].target = this._generateNumber();
    }

}