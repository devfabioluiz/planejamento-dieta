from crewai import Task
from .agents import dieta_analista, nutricionista, revisor

DIAS_SEMANA = [
    "segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"
]

REFEICOES = [
    {"nome": "Café da Manhã", "ordem": 1, "horario": "06:00"},
    {"nome": "Colação", "ordem": 2, "horario": "09:00"},
    {"nome": "Almoço", "ordem": 3, "horario": "12:00"},
    {"nome": "Lanche", "ordem": 4, "horario": "15:00"},
    {"nome": "Jantar", "ordem": 5, "horario": "18:00"},
    {"nome": "Ceia", "ordem": 6, "horario": "21:00"},
]

analisar_dieta = Task(
    description=(
        "Analise o texto da dieta abaixo e extraia:\n"
        "1. Alimentos permitidos e proibidos\n"
        "2. Horários das refeições\n"
        "3. Quantidades e porções\n"
        "4. Restrições e regras especiais\n"
        "5. Objetivos da dieta\n\n"
        "Texto da dieta: {texto_dieta}\n\n"
        "Objetivos: {objetivos}\n\n"
        "Retorne um resumo estruturado com todas as regras extraídas."
    ),
    expected_output="Resumo estruturado das regras da dieta em formato de tópicos.",
    agent=dieta_analista,
)

_dias_str = ", ".join(DIAS_SEMANA)
_qtd_refeicoes = len(REFEICOES)
_lista_refeicoes = "\n- ".join([f"{r['nome']} ({r['horario']})" for r in REFEICOES])

montar_cardapio = Task(
    description=(
        "Com base nas regras extraídas da dieta, crie um cardápio semanal completo.\n\n"
        "Regras da dieta: {regras_dieta}\n\n"
        f"Para cada dia da semana ({_dias_str}), crie {_qtd_refeicoes} refeições:\n"
        f"- {_lista_refeicoes}\n\n"
        "Cada refeição deve conter:\n"
        "- Nome do prato\n"
        "- Ingredientes com quantidades\n"
        "- Modo de preparo resumido\n\n"
        "Respeite rigorosamente as regras da dieta."
    ),
    expected_output="Cardápio semanal completo em formato estruturado.",
    agent=nutricionista,
)

revisar_cardapio = Task(
    description=(
        "Revise o cardápio gerado e:\n"
        "1. Verifique se todas as refeições seguem as regras da dieta\n"
        "2. Corriça qualquer inconsistência\n"
        "3. Estruture o resultado no formato JSON abaixo:\n\n"
        "{{\n"
        '  "dias": [\n'
        "    {{\n"
        '      "dia": "segunda",\n'
        '      "refeicoes": [\n'
        "        {{\n"
        '          "nome": "Café da Manhã",\n'
        '          "horario": "06:00",\n'
        '          "ordem": 1,\n'
        '          "prato": "Omelete de claras",\n'
        '          "ingredientes": ["3 claras", "espinafre", "tomate"],\n'
        '          "preparo": "Bata as claras e cozinhe em frigideira antiaderente..."\n'
        "        }}\n"
        "      ]\n"
        "    }}\n"
        "  ]\n"
        "}}\n\n"
        "Regras da dieta: {regras_dieta}\n"
        "Cardápio gerado: {cardapio_gerado}"
    ),
    expected_output="JSON estruturado do cardápio semanal revisado e validado.",
    agent=revisor,
)
