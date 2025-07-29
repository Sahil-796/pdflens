from fastapi import FastAPI
import os
from dotenv import load_dotenv

load_dotenv()
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

app = FastAPI()


@app.get('/')
def root():
    return {"message": "Welcome to the FastAPI server!"}

