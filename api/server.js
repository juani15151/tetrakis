const Game = require('./Game')
const express = require('express');
const expressWs = require('express-ws')
const wsInstance = expressWs(express());
const app = wsInstance.app;
const crypto = require('crypto');

const bodyParser = require("body-parser"); // TODO: Remove if not required on WebSocket.
const port = 3080; // TODO: Read from environment.


// TODO: Only track the signature of the last state on a room instead of the whole object.
// TODO: On a multi-server environment this requires a proper shared database.
const database = {
    rooms: {},
};
const getNewRoomUUID = () => crypto.randomUUID();
const getNewUserUUID = () => crypto.randomUUID();

/**
 * The app handles the websocket connection from players to each room. Whenever one player updates the state of the room,
 * it's also sent to the other player.
 *
 * TODO: Handle lost connections. Will have to request last state from the other player.
 */
app.use(bodyParser.json());

app.ws('/api/room', (ws, request) => {
    // Setup listeners.
    ws.on('message', (message) => {
        message = JSON.parse(message);
        const type = message.type;
        handleMessage[type](ws, message.data);
    });
    ws.on('close', () => {
        handleMessage["close"](ws);
    });
});

const handleMessage = {
    // // TODO: Deprecate, use the "join" message both for creation and joining.
    // "create": (ws, data) => {
    //     ws.roomId = getNewRoomUUID();
    //     ws.userId = getNewUserUUID();
    //
    //     database.rooms[ws.roomId] = Game.initializeRoom(ws.roomId, {id: ws.userId});
    //     ws.send(JSON.stringify({
    //         type: 'setUserId',
    //         data: {
    //             userId: ws.userId
    //         }
    //     }));
    //     sendUpdate(ws.roomId);
    // },
    /**
     * Adds a player to an existent or new room. The player can be a real user or a bot created by a player.
     * @param ws
     * @param data
     */
    "join": (ws, data) => {
        ws.userId = ws.userId || getNewUserUUID();
        const roomId = data.roomId; // TODO: Validate it's an UUID.
        let room = database.rooms[roomId];

        if (!room) {
            room = Game.initializeRoom(ws.roomId, {id: ws.userId});
            database.rooms[roomId] = room;
        }

        // TODO: Validate only 2 active users per room?
        ws.roomId = roomId;

        Game.addPlayer(roomId, {id: ws.userId}, data.isBot);
        if (!data.isBot) {
            ws.send(JSON.stringify({
                type: 'setUserId',
                data: {
                    userId: ws.userId
                }
            }));
        }

        sendUpdate(ws.roomId);
    },
    "update": (ws, data) => {
        const room = database.rooms[ws.roomId];
        if(room) {
            Game.updateRoom(room, data);
            sendUpdate(ws.roomId);
        }
    },
    "reset": (ws, data) => {
        if(ws.roomId && ws.userId) {
            const roomId = ws.roomId;
            const room = database.rooms[roomId];
            Game.resetRoom(room, ws.userId);
            sendUpdate(roomId);
        }
    },
    "close": (ws, data) => {
        // TODO: When no more clients listen to a room, delete it.
        if(ws.roomId && ws.userId) {
            const roomId = ws.roomId;
            const room = database.rooms[roomId];
            Game.removePlayer(room, ws.userId);
            ws.roomId = null;
            sendUpdate(roomId);
        }
    }
}

const sendUpdate = (roomId) => {
    // TODO: Check that only connected users are listed here.
    wsInstance.getWss().clients.forEach((client) => { // TODO: Use a map to avoid this loop.
        if (client.roomId === roomId) {
            client.send(JSON.stringify({
                type: 'Update',
                data: database.rooms[roomId]
            }));
        }
    });
};

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

express()
    .use('/api/game', require('./GameService'))
    .listen(3081, () => { // TODO: Read port from environment variable.
        console.log(`Game API listening on the port::${3081}`);
    });