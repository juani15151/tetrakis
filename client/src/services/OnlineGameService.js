import GameService from "./GameService";
import { w3cwebsocket as W3CWebSocket } from "websocket";

export default class OnlineGameService extends GameService {

    constructor(roomId) {
        super();
        this.onMessage = this.onMessage.bind(this);

        this.setupSocket(roomId);
    }

    setupSocket(roomId) {
        // Setup socket.
        this.roomSocket = new W3CWebSocket(process.env.REACT_APP_SERVER_URL + "/api/room");

        this.roomSocket.onopen = () => {
            console.log("Connected to room server");
            this.roomSocket.send(JSON.stringify({
                type: "join",
                data: {
                    roomId: roomId || null
                }
            }));
            // The server will send back an update message through the websocket and initialize the state.
        };

        this.roomSocket.onmessage = this.onMessage;
    }

    onMessage(message) {
        message = JSON.parse(message.data);
        const type = message.type.toLowerCase();
        if(this["handle_" + type]) {
            this["handle_" + type](message.data);
        } else {
            console.error("Unknown message type: " + type);
        }
    }

    handle_update(data) {
        super.setState(data);
    }

    handle_setuserid(data) {
        this.currentUserId = data.userId;
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
            this.roomSocket.send(JSON.stringify({
                type: "update",
                data: userState
            }));
        }
    }

    actionPlayAgain(playerID) {
        this.roomSocket.send(JSON.stringify({
            type: "reset",
            data: null
        }));
    }

    isPlayerEnabled(player) {
        return this.currentUserId === player.id;
    }

    isLocalPlayer(player): boolean {
        return this.isPlayerEnabled(player);
    }
}