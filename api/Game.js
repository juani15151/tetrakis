module.exports = class Game {

    static initializeRoom(id, user) {
        let room = {
            roomId: id,
            players: {}
            // TODO: Add server-side signature to all validated states, clients should confirm the signature before accepting the new state.
        }
        room.players[user.id] = this._newPlayer(user)
        return room
    }

    static _newPlayer(user, isBot) {
        return {
            isBot: !!isBot,
            id: isBot ? user.id + "-bot" : user.id,
            name: user.name || "Player " + user.id[0],
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
            room.players[playerId].isBot = true; // TODO: Not sure about this.
        }
    }

    static updateRoom(room, currentUserId, nextState) {
        // TODO: Validate user input.
        const opponentId = Object.keys(room.players).find(id => id !== currentUserId);

        // Update the opponent target based on the current user number.
        if (opponentId && !room.players[opponentId].target && nextState.players[currentUserId].number) {
            room.players[opponentId].target = nextState.players[currentUserId].number;
        }

        // Update the current user target based on the opponent number.
        if (opponentId && !nextState.players[currentUserId].target && room.players[opponentId].number) {
            nextState.players[currentUserId].target = room.players[opponentId].number;
        }

        // A player can only modify itself.
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