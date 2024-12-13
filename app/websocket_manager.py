import json
from typing import Dict, Set

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.ball_positions: Dict[str, dict] = {}  # Store positions for all balls

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        # Initialize new ball position
        self.ball_positions[client_id] = {"x": 200, "y": 200, "clientId": client_id}
        # Send all current ball positions to the new client
        await self.send_all_positions(client_id)

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            del self.ball_positions[client_id]

    async def send_all_positions(self, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json({
                "type": "initial_positions",
                "data": list(self.ball_positions.values())
            })

    async def broadcast(self, message: dict, sender_id: str):
        self.ball_positions[sender_id] = message["data"]
        for connection in self.active_connections.values():
            await connection.send_json(message) 