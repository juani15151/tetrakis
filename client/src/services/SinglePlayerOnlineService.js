import GameService from "./GameService";

/**
 * Controls the SinglePlayer game mode.
 *
 * An encrypted random number is requested to the server and each guess is sent to the server for calculation.
 */
export default class SinglePlayerOnlineService extends GameService {

    constructor() {
        super();

        let state = this.getState();
        state.players[0] = this._newPlayer(0);
        this.setState(state);

        fetch(process.env.REACT_APP_SERVER_API_URL + "/api/game/number/random")
            .then(res => res.text())
            .then(encryptedNumber => {
                let state = this.getState();
                state.players[0].target = encryptedNumber;
                this.setState(state);
            })
            .catch(e => {
                alert(e);
            });
    }

    _checkNumber(attempt, target) {
        return fetch(process.env.REACT_APP_SERVER_API_URL + `/api/game/number/check?number=${attempt}&target=${target}`)
            .then(res => res.json())
            .catch(e => {
                alert(e);
            });
    }

    _newPlayer(id) {
        return {
            id: id,
            name: "SinglePlayer",
            number: '0123',
            target: null,
            attempts: [],
            isFinished: false,
        }
    }

    actionPlayAgain(playerID) {
        const state = this.getState();
        state.players[playerID] = this._newPlayer(playerID);

        this.setState(state);
    }

    isPlayerEnabled(player) {
        return true;
    }

    isLocalPlayer(player): boolean {
        return true;
    }

    getOpponent(currentPlayer) {
        return currentPlayer;
    }

}