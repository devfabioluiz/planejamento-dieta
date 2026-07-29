import os
from fastapi import APIRouter, HTTPException
from api.schemas import GerarCardapioRequest, CardapioResponse
from api.agents.crew import gerar_cardapio

router = APIRouter()


@router.post("/api/gerar-cardapio", response_model=CardapioResponse)
def gerar_cardapio_endpoint(req: GerarCardapioRequest):
    try:
        resultado = gerar_cardapio(req.dieta_id, req.usuario_id)
        return CardapioResponse(
            plano_id=resultado["plano_id"],
            status=resultado["status"],
            mensagem=resultado["mensagem"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
