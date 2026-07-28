from sqlalchemy import Column, String, Text, Integer, Boolean, Date, Time, JSON, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from .database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    nome = Column(Text, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    senha_hash = Column(Text)
    avatar_url = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class Dieta(Base):
    __tablename__ = "dietas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    titulo = Column(Text, nullable=False)
    texto_original = Column(Text, nullable=False)
    objetivos = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class PlanoAlimentar(Base):
    __tablename__ = "planos_alimentares"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    dieta_id = Column(UUID(as_uuid=True), ForeignKey("dietas.id", ondelete="CASCADE"), nullable=False)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    semana_inicio = Column(Date, nullable=False)
    semana_fim = Column(Date, nullable=False)
    status = Column(Text, default="rascunho")
    created_at = Column(DateTime, server_default=func.now())


class Refeicao(Base):
    __tablename__ = "refeicoes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plano_id = Column(UUID(as_uuid=True), ForeignKey("planos_alimentares.id", ondelete="CASCADE"), nullable=False)
    dia_semana = Column(Text, nullable=False)
    nome = Column(Text, nullable=False)
    horario = Column(Time)
    itens = Column(JSON, default=list)
    observacao = Column(Text)
    ordem = Column(Integer, nullable=False)


class Receita(Base):
    __tablename__ = "receitas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    nome = Column(Text, nullable=False)
    ingredientes = Column(JSON, default=list)
    modo_preparo = Column(Text)
    tempo_preparo = Column(Text)
    nivel_dificuldade = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class Despensa(Base):
    __tablename__ = "despensa"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    nome = Column(Text, nullable=False)
    quantidade = Column(Text)
    categoria = Column(Text)
    quantidade_max = Column(Text)
    validade = Column(Text)


class ProgressoDiario(Base):
    __tablename__ = "progresso_diario"
    __table_args__ = (UniqueConstraint("usuario_id", "data"),)

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    data = Column(Date, nullable=False)
    agua_ml = Column(Integer, default=0)
    refeicoes_concluidas = Column(JSON, default=dict)


class ListaCompra(Base):
    __tablename__ = "lista_compras"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id", ondelete="CASCADE"), nullable=False)
    item = Column(Text, nullable=False)
    concluido = Column(Boolean, default=False)
