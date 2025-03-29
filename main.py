import os
import sys
import uvicorn
import SocketHandler
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET"], allow_headers=["*"])


# Determine if we're running as a bundled executable
if getattr(sys, 'frozen', False):
    # If bundled, use sys._MEIPASS as the base directory
    base_path = sys._MEIPASS
else:
    # If not bundled, use the current working directory
    base_path = os.path.abspath(os.path.dirname(__file__))

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
            if response is not None:
                await websocket.send_json(response)  # Send message back
    except WebSocketDisconnect:
        print("Client disconnected")

# Serve Static Files from the 'public' directory
app.mount("/", StaticFiles(directory=os.path.join(base_path, "public"), html=True), name="public")

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=80, log_level="debug", timeout_keep_alive=0)
