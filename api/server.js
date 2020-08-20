const Game = require('./Game')
const express = require('express');
const expressWs = require('express-ws')
const wsInstance = expressWs(express());
const app = wsInstance.app;

const bodyParser = require("body-parser"); // TODO: Remove if not required on WebSocket.
const port = 3080;


// TODO: Use a proper DB engine.
const database = {
    nextRoomId: 1,
    rooms: {},
};
const getNextRoomId = () => database.nextRoomId++;

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
    "create": (ws, data) => {
        ws.roomId = getNextRoomId();
        ws.userId = 1;

        database.rooms[ws.roomId] = Game.initializeRoom(ws.roomId, {id: 1});
        ws.send(JSON.stringify({
            type: 'setUserId',
            data: {
                userId: ws.userId
            }
        }));
        sendUpdate(ws.roomId);
    },
    "join": (ws, data) => {
        let roomId;
        try {
            roomId = parseInt(data.roomId);
        } catch (e) {
            roomId = 0;
        }
        const room = database.rooms[roomId];
        if(!room) {
            return;
        }

        // TODO: Validate only 2 active users per room.
        ws.roomId = roomId;
        ws.userId = 2;

        room.players[ws.userId].isBot = false;
        ws.send(JSON.stringify({
            type: 'setUserId',
            data: {
                userId: ws.userId
            }
        }));
        sendUpdate(ws.roomId);
    },
    "update": (ws, data) => {
        const room = database.rooms[ws.roomId];
        if(room) {
            Game.updateRoom(room, data);
            sendUpdate(ws.roomId);
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
    wsInstance.getWss().clients.forEach((client) => {
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