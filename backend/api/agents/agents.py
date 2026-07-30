import os
from crewai import Agent, LLM

groq_llm = LLM(
    model="groq/llama-3.3-70b-versatile",
    temperature=0.3,
    api_key=os.getenv("GROQ_API_KEY"),
    cache={"no-cache": True},
)

dieta_analista = Agent(
    role="Analista de Dietas",
    goal="Analisar o texto da dieta e extrair todas as regras, "
    "alimentos permitidos, proibidos, horários, quantidades e restrições.",
    backstory="Nutricionista especializado em interpretar planos alimentares. "
    "Consegue extrair informações estruturadas de qualquer texto de dieta.",
    verbose=True,
    llm=groq_llm,
)

nutricionista = Agent(
    role="Nutricionista Montador de Cardápios",
    goal="Criar um cardápio semanal detalhado respeitando rigorosamente "
    "as regras da dieta fornecida, com 6 refeições por dia.",
    backstory="Chef nutrólogo com 15 anos de experiência em montar cardápios "
    "personalizados. Cada refeição inclui horário, nome, ingredientes e modo de preparo.",
    verbose=True,
    llm=groq_llm,
)

revisor = Agent(
    role="Revisor de Cardápios",
    goal="Validar o cardápio gerado, garantir que segue todas as regras "
    "da dieta original, e estruturar no formato JSON final.",
    backstory="Supervisor de qualidade nutricional. Verifica cada refeição "
    "contra as regras da dieta e garante consistência em todos os dias.",
    verbose=True,
    llm=groq_llm,
)
