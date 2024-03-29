import GameService from './GameService';

/**
 * Controls a 2-Player game where both players user the same computer.
 *
 * This variation is turn-based and users are responsible for not looking at the opponents number during setup.
 * All calculations are done on the browser (via the parent class 'GameService'), so once the application is loaded it
 * can work offline.
 */
export default class LocalPlayersGameService extends GameService {

    constructor() {
        super();
        const state = this.state;
        state.players[1] = this._newPlayer(1);
        state.players[2] = this._newPlayer(2);
    }

    actionPlayAgain(playerID) {
        const state = this.getState();
        state.players[1] = this._newPlayer(1);
        state.players[2] = this._newPlayer(2);

        this.setState(state);
    }

    _newPlayer(id) {
        return {
            id: id,
            name: "Player " + id,
            number: null,
            target: null,
            attempts: [],
            isPlaying: false,
            isFinished: false,
        }
    }

    onAfterActionAttempt(playerID, attempt, state) {
        // Change turn to next player
        const playingOpponent = Object.values(state.players)
            .find(player => player.id !== playerID && !player.isFinished);
        if(playingOpponent) {
            state.players[playerID].isPlaying = false;
            playingOpponent.isPlaying = true;
        }
    }

    onAfterActionSetNumber(playerID, number, state) {
        Object.values(state.players).forEach(player => {
            if(player.id === playerID) {
                player.isPlaying = false;
            } else {
                player.target = number;
                player.isPlaying = true;
            }
        });
    }

    isPlayerEnabled(player) {
        return !player.number || (player.target && player.isPlaying);
    }

    isLocalPlayer(player) {
        return true;
    }
}