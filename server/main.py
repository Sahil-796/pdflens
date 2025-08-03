from fastapi import FastAPI
from routes.upload import router as upload_router

app = FastAPI()


@app.get('/')
def base():
    return {"message": "Hello developer!"}
app.include_router(upload_router)