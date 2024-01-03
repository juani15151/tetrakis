interface Guess {
    timestamp,
    number
}

module.exports = class Game {

    static initializeRoom(id, user) {
        let room = {
            roomId: id,
            players: {}
        }
        room.players[user.id] = this._newPlayer(user)
        return room
    }

    static _newPlayer(user, isBot) {
        return {
            isBot: !!isBot,
            id: isBot ? user.id + "-bot" : user.id,
            name: user.name || "Player " + user.id,
            number: null,
            target: null, // TODO: Remove.
            attempts: [],
            isPlaying: false,
            isFinished: false,
            wantsReplay: false,
        }
    }

    static _resetPlayer(player) {
        player.number = null;
        player.target = null;
        player.attempts = [];
        player.isPlaying = false;
        player.isFinished = false;
        player.wantsReplay = false;
    }

    static addPlayer(room, user, isBot) {
        room.players[user.id] = this._newPlayer(user, isBot);
    }

    static removePlayer(room, playerId) {
        if (room.players[playerId]) {
            room.players[playerId].isBot = true;
        }
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

    static resetRoom(room, playerID) {
        room.players[playerID].wantsReplay = true;
        if(!Object.values(room.players).find(player => !player.wantsReplay)) {
            // Reset room when both players want replay.
            Object.values(room.players).forEach(Game._resetPlayer);
        }
    }

}