from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine, Base
from routers import user, auth, ticket, asset, poc, task, component, report, db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(ticket.router)
app.include_router(asset.router)
app.include_router(poc.router)
app.include_router(task.router)
app.include_router(component.router)
app.include_router(db.router)
app.include_router(report.router)
