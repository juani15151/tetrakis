const Game = require('./Game')
const express = require('express');
const expressWs = require('express-ws')
const wsInstance = expressWs(express());
const app = wsInstance.app;

const bodyParser = require("body-parser");
const port = 3080;


// TODO: Use a proper DB engine.
const database = {
    nextRoomId: 1,
    rooms: {},
};

app.use(bodyParser.json());

app.ws('/api/room/:roomId', (ws, request) => {
    // TODO: Validate room exists.
    // TODO: Validate only 2 active users per room.

    const roomId = request.params.roomId;
    ws.roomId = roomId
    ws.on('message', (message) => {
        const nextState = JSON.parse(message);
        const room = database.rooms[roomId];
        Game.updateRoom(room, nextState);
        sendUpdate(roomId);
    });
    ws.on('close', () => {
        // TODO: When no more clients listen to a room, delete it.
        // TODO: Change user to bot to signal leave.
    });

    sendUpdate(roomId);
});

const sendUpdate = (roomId) => {
    // TODO: Check that only connected users are listed here.
    wsInstance.getWss().clients.forEach((client) => {
        if (client.roomId === roomId) {
            client.send(JSON.stringify(database.rooms[roomId]));
        }
    });
};

app.post('/api/room', (request, response) => {
    const user = request.body.user;

    const roomId = database.nextRoomId++;
    database.rooms[roomId] = Game.initializeRoom(roomId, user);

    response.json({
        roomId: roomId
    });
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});