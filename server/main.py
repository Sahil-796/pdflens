
from fastapi import FastAPI
from routes.upload import router as upload_router
from routes.ai import router as ai_router




app = FastAPI()



@app.get('/')
def base():
    return {"message": "Hello developer!"}

app.include_router(upload_router)
app.include_router(ai_router)