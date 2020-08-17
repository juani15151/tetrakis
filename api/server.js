const Game = require('./Game')
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const port = 3080;


// TODO: Use a proper DB engine.
const database = {
    nextRoomId: 1,
    rooms: {},
};

app.use(bodyParser.json());

app.post('/api/room', (request, response) => {
    const user = request.body.user;

    const roomId = database.nextRoomId++;
    database.rooms[roomId] = Game.initializeRoom(roomId, user);

    response.json(database.rooms[roomId]);
});

app.put('/api/room/:roomId', (request, response) => {
    // TODO: Handle room not found exceptions.
    const nextState = request.body;
    const room = database.rooms[request.params.roomId];
    Game.updateRoom(room, nextState);

    response.json(room);
});

app.post('/api/room/:roomId/join', (request, response) => {
    const user = request.body.user;
    // TODO: Handle room not found exceptions.
    const room = database.rooms[request.params.roomId];
    const added = Game.addPlayer(room, user);

    if (added) {
        response.json(room);
    } else {
        response.status(400).json({
            msg: 'Room is full'
        });
    }
});

app.get('/api/room/:roomId', (request, response) => {
    // TODO: Handle room not found exceptions.
    response.json(database.rooms[request.params.roomId]);
});


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});