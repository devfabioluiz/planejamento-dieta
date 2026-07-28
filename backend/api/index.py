import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.geracao import router as geracao_router

app = FastAPI(title="Planejador de Dieta API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(geracao_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Planejador de Dieta API"}
