class OnlineRoomService {

    async createRoom(user) {
        const response = await fetch('/api/room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: user
            })
        });
        return await response.json();
    }

    async joinRoom(roomId, user) {
        const response = await fetch('/api/room/' + roomId + '/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: user
            })
        });
        return await response.json();
    }

    async updateRoom(roomId, state) {
        return await fetch('/api/room/' + roomId, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(state)
        });
    }

    async getRoom(roomId) {
        const response = await fetch('/api/room/' + roomId);
        return await response.json();
    }
}