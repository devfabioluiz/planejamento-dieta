import json
import os
import uuid
from datetime import date, timedelta
from crewai import Crew, Process
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from .agents import dieta_analista, nutricionista, revisor
from .tasks import analisar_dieta, montar_cardapio, revisar_cardapio

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:oVhsZv1JGEObT0DY@db.fenzegbtfxotssxgibxb.supabase.co:5432/postgres",
)

engine = create_engine(DATABASE_URL)


def gerar_cardapio(dieta_id: str, usuario_id: str) -> dict:
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT texto_original, objetivos FROM dietas WHERE id = :id"),
            {"id": dieta_id},
        )
        row = result.fetchone()
        if not row:
            return {"status": "error", "mensagem": "Dieta não encontrada"}

        texto_dieta = row[0]
        objetivos = row[1] or ""

        crew = Crew(
            agents=[dieta_analista, nutricionista, revisor],
            tasks=[analisar_dieta, montar_cardapio, revisar_cardapio],
            process=Process.sequential,
            verbose=True,
        )

        result_crew = crew.kickoff(
            inputs={
                "texto_dieta": texto_dieta,
                "objetivos": objetivos,
            }
        )

        cardapio_json = _extrair_json(result_crew.raw)

        hoje = date.today()
        inicio_semana = hoje - timedelta(days=hoje.weekday())
        fim_semana = inicio_semana + timedelta(days=6)

        plano_id = str(uuid.uuid4())

        conn.execute(
            text(
                """INSERT INTO planos_alimentares (id, dieta_id, usuario_id, semana_inicio, semana_fim, status)
                   VALUES (:id, :dieta_id, :usuario_id, :inicio, :fim, 'ativo')"""
            ),
            {
                "id": plano_id,
                "dieta_id": dieta_id,
                "usuario_id": usuario_id,
                "inicio": inicio_semana,
                "fim": fim_semana,
            },
        )

        for dia in cardapio_json.get("dias", []):
            for ref in dia.get("refeicoes", []):
                conn.execute(
                    text(
                        """INSERT INTO refeicoes (id, plano_id, dia_semana, nome, horario, itens, observacao, ordem)
                           VALUES (:id, :plano_id, :dia_semana, :nome, :horario, :itens, :obs, :ordem)"""
                    ),
                    {
                        "id": str(uuid.uuid4()),
                        "plano_id": plano_id,
                        "dia_semana": dia["dia"],
                        "nome": ref["nome"],
                        "horario": ref["horario"],
                        "itens": json.dumps(ref.get("ingredientes", [])),
                        "obs": ref.get("preparo", ""),
                        "ordem": ref["ordem"],
                    },
                )

        conn.commit()

        return {
            "plano_id": plano_id,
            "status": "success",
            "mensagem": "Cardápio gerado com sucesso",
        }


def _extrair_json(raw: str) -> dict:
    try:
        inicio = raw.index("{")
        fim = raw.rindex("}") + 1
        return json.loads(raw[inicio:fim])
    except (ValueError, json.JSONDecodeError):
        return {"dias": []}
