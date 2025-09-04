from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes.upload import router as upload_router
from server.app.routes.ai import router as ai_router




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get('/')
def base():
    return {"message": "Hello developer!"}

app.include_router(upload_router)
app.include_router(ai_router)