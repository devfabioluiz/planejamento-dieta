import os
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse

INTERNAL_API_KEY = os.getenv("INTERNAL_API_KEY", "dev-key")


async def verify_internal_api_key(request: Request, call_next):
    if request.url.path.startswith("/api/gerar-cardapio"):
        api_key = request.headers.get("X-API-Key")
        if api_key != INTERNAL_API_KEY:
            return JSONResponse(status_code=403, content={"erro": "Acesso negado"})
    return await call_next(request)
