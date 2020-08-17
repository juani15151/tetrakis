import GameService from "./GameService";

export default class OnlineGameService extends GameService {

    static UPDATE_INTERVAL = 5000;

    constructor(roomId) {
        super();
        if (!roomId) {
            this.currentUserId = 1;
            this.createRoom({
                id: 1
            }).then(super.setState.bind(this));
        } else {
            this.currentUserId = 2;
            this.joinRoom(roomId, {
                id: 2,
            }).then(super.setState.bind(this));
        }

        this.updateTimer = setInterval(this._updateState.bind(this), OnlineGameService.UPDATE_INTERVAL);
    }

    _updateState() {
        if (this.state.roomId) {
            this.getRoom(this.state.roomId)
                .then(super.setState.bind(this));
        }
    }

    destroy() {
        clearInterval(this.updateTimer);
        super.destroy();
    }

    setState(nextState) {
        super.setState(nextState);
        this.updateRoom(nextState.roomId, nextState)
            .then(super.setState.bind(this)); // In case there are new changes from server.
    }

    onAfterActionSetNumber(playerID, number, state) {
        Object.values(state.players).forEach(player => {
            if(player.id !== playerID) {
                player.target = number;
            }
        });
    }

    isPlayerEnabled(player) {
        return this.currentUserId === player.id;
    }

    async createRoom(user) {
        const response = await fetch('/api/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user: user
            })
        });
        return await response.json();
    }

    async joinRoom(roomId, user) {
        const response = await fetch('/api/room/' + roomId + '/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                user: user
            })
        });
        return await response.json();
    }

    async updateRoom(roomId, state) {
        return await fetch('/api/room/' + roomId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(state)
        });
    }

    async getRoom(roomId) {
        const response = await fetch('/api/room/' + roomId, {
            headers: {
                'Accept': 'application/json'
            }
        });
        return await response.json();
    }

}