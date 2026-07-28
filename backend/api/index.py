import os
import sys
import logging
import traceback
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

import_error = None
try:
    from api.routes.geracao import router as geracao_router
    logger.info("geracao_router imported successfully")
except Exception as e:
    import_error = traceback.format_exc()
    logger.error(f"Failed to import geracao_router: {e}", exc_info=True)
    geracao_router = None

app = FastAPI(title="Planejador de Dieta API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if geracao_router is not None:
    app.include_router(geracao_router)
    logger.info("geracao_router included in app")
else:
    logger.warning("geracao_router is None, not including")


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "routes_count": len(app.routes),
        "routes": [{"path": r.path, "methods": list(r.methods)} for r in app.routes],
        "import_error": import_error,
    }


@app.get("/api/debug-env")
def debug_env():
    return {
        "GROQ_API_KEY_set": os.getenv("GROQ_API_KEY") is not None,
        "GROQ_API_KEY_length": len(os.getenv("GROQ_API_KEY", "")),
        "DATABASE_URL_set": os.getenv("DATABASE_URL") is not None,
        "PYTHON_VERSION": os.getenv("PYTHON_VERSION", "not set"),
    }


@app.get("/")
def root():
    return {"message": "Planejador de Dieta API"}
