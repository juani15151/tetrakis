module.exports = class Game {

    static initializeRoom(id, user) {
        return {
            roomId: id,
            players: {
                1: this._newPlayer(user),
                2: this._newPlayer({id: 2}, true),
            }
        }
    }

    static _newPlayer(user, isBot) {
        return {
            isBot: !!isBot,
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
        if(room.players[2].isBot) {
            room.players[2].isBot = false;
            return true;
        }
        return false;
    }

    static updateRoom(room, nextState) {
        // TODO: Validate user input.
        const currentUserId = Object.keys(nextState.players)[0];
        const opponentId = currentUserId === "2" ? 1 : 2;

        if(!room.players[opponentId].target && nextState.players[currentUserId].number) {
            room.players[opponentId].target = nextState.players[currentUserId].number;
        }

        room.players[currentUserId] = nextState.players[currentUserId];
    }

}