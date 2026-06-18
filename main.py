from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import random
import time

app = FastAPI()

# Allow our React frontend (port 5173) to communicate with this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/scan-receipt")
async def scan_receipt(file: UploadFile = File(...)):
    # 1. This is where your future ML model will process the 'file'
    print(f"Received image: {file.filename}")
    
    # 2. Simulate the inference time of a Neural Network
    time.sleep(2) 
    
    # 3. Return a dynamically generated amount back to React
    simulated_amount = round(random.uniform(15.0, 120.0), 2)
    
    return {"amount": simulated_amount, "filename": file.filename}