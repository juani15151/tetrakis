class Game {

    static initializeRoom(user) {
        return {
            players: {
                1: this._newPlayer(user),
                2: null,
            }
        }
    }

    static _newPlayer(user) {
        return {
            id: user.id,
            name: user.name || "Player " + user.id,
            number: null,
            target: null,
            attempts: [],
            isPlaying: false,
            isFinished: false,
        }
    }

    static addPlayer(room, user) {
        if(!room.players[2]) {
            room.players[2] = this._newPlayer(user);
            return true;
        }
        return false;
    }

    static updateRoom(room, nextState) {
        // TODO: Validate user input.
        Object.assign(room.players, nextState.players);
    }

}