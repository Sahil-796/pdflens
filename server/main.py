from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str

@app.get('/')
def root():
    return {"message": "Welcome to the FastAPI server!"}

@app.post('/items/')
def create_item(item: Item):
    return {"item_name": item.name, "message": "Item created successfully!"}