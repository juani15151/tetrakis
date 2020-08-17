import GameService from './GameService';

export default class MultiplayerGameService extends GameService {

    constructor() {
        super();
        const state = this.state;
        state.players[1] = this._newPlayer(1);
        state.players[2] = this._newPlayer(2);
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
}