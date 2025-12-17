from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.routes import ai_router
# import sentry_sdk

# sentry_sdk.init(
#     dsn="https://46d28200c264287c4536b72f2bc6e938@o4510210789015552.ingest.us.sentry.io/4510210790260736",
#     # Add data like request headers and IP for users,
#     # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
#     send_default_pii=True,
#     # Enable sending logs to Sentry
#     enable_logs=True,
#     # Set traces_sample_rate to 1.0 to capture 100%
#     # of transactions for tracing.
#     traces_sample_rate=1.0,
#     # Set profile_session_sample_rate to 1.0 to profile 100%
#     # of profile sessions.
#     profile_session_sample_rate=1.0,
#     # Set profile_lifecycle to "trace" to automatically
#     # run the profiler on when there is an active transaction
#     profile_lifecycle="trace",
# )

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def base():
    return {"message": "Hello developer!"}


app.include_router(ai_router)
