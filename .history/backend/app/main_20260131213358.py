from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users,

app = FastAPI(
    title="FastAPI Auth System",
    description="Système d'authentification avec FastAPI",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routeurs
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(clients.router)


@app.get("/")
def read_root():
    return {
        "message": "FastAPI Auth System",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth": {
                "login": "POST /auth/login",
                "register": "POST /auth/register"
            },
            "users": {
                "get_me": "GET /users/me",
                "update_me": "PUT /users/me",
                "change_password": "PUT /users/me/password"
            }
        }
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}