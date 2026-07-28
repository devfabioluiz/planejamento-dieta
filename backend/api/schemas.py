from pydantic import BaseModel
from uuid import UUID


class GerarCardapioRequest(BaseModel):
    dieta_id: str
    usuario_id: str


class CardapioResponse(BaseModel):
    plano_id: str
    status: str
    mensagem: str
