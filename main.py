import sys
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import uvicorn
from fastapi.staticfiles import StaticFiles
import json
from starlette.responses import FileResponse
import SocketHandler

app = FastAPI()

# Determine if we're running as a bundled executable
if getattr(sys, 'frozen', False):
    # If bundled, use sys._MEIPASS as the base directory
    base_path = sys._MEIPASS
else:
    # If not bundled, use the current working directory
    base_path = os.path.abspath(os.path.dirname(__file__))

# Serve Static Files from the 'public' directory
app.mount("/public", StaticFiles(directory=os.path.join(base_path, "public")), name="public")

# WebSocket Route
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()  # Accept the WebSocket connection
    try:
        while True:
            data = await websocket.receive_json()  # Receive a message from client
            print(f"Received message: {data}")

            # Respond with a message (broadcast to all if needed)
            # response = {"data": "Hello from server!"}
            response = SocketHandler.handle(data)
            await websocket.send_json(response)  # Send message back
    except WebSocketDisconnect:
        print("Client disconnected")

# Entry point to serve index.html (use 'public' directory for JS)
@app.get("/")
async def get_index():
    # Return the index.html file from the 'public' directory
    return FileResponse(os.path.join(base_path, "public", "index.html"))

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=80, log_level="debug")
