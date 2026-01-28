from fastapi import FastAPI
from app.database import Base, engine
from app.routes.routes import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Starter FastAPI + PostgreSQL")

# Inclure les routes
app.include_router(auth_router, prefix="/auth", tags=["auth"])
