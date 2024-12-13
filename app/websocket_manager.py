from fastapi import WebSocket
from typing import Dict, Set
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.ball_position = {"x": 200, "y": 200}  # Default position

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        await self.send_ball_position(client_id)

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_ball_position(self, client_id: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_json({
                "type": "position",
                "data": self.ball_position
            })

    async def broadcast(self, message: dict):
        self.ball_position = message["data"]
        for connection in self.active_connections.values():
            await connection.send_json(message) 