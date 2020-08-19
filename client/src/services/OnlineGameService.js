import GameService from "./GameService";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class OnlineGameService extends GameService {

    constructor(roomId) {
        super();
        this.listenRoom = this.listenRoom.bind(this);

        if (!roomId) {
            this.currentUserId = 1;
            this.createRoom({
                id: 1
            }).then((response) => this.listenRoom(response.roomId));
        } else {
            this.currentUserId = 2;
            this.listenRoom(roomId);
        }
    }

    listenRoom(roomId) {
        // Setup socket.
        const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        const socketUrl = socketProtocol + '//' + window.location.hostname + ':3080/api/room/' + roomId
        this.roomSocket = new W3CWebSocket(socketUrl);

        this.roomSocket.onopen = () => {
            console.log("Connected to room #" + roomId);
        };
        this.roomSocket.onmessage = (message) => {
            super.setState(JSON.parse(message.data));
            if(this.state.players[this.currentUserId].isBot) {
                const nextState = this.getState();
                nextState.players[this.currentUserId].isBot = false;
                this.setState(nextState);
            }
        }
    }

    destroy() {
        if(this.roomSocket) {
            this.roomSocket.close();
        }
        super.destroy();
    }

    setState(nextState) {
        if(this.roomSocket) {
            // Update only current user. Avoids concurrency issues.
            const userState = {
                players: {}
            };
            userState.players[this.currentUserId] = nextState.players[this.currentUserId];
            this.roomSocket.send(JSON.stringify(userState));
        }
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

}