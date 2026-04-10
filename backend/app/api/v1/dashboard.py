from datetime import datetime, timedelta
from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from pydantic import BaseModel

from ...core.dependencies import get_current_user
from ...db.session import get_session
from ...models.user import User
from ...models.transaction import Transaction
from ...models.goal import Goal
from ... import crud

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class DashboardSummary(BaseModel):
    """Resumo financeiro do mês atual"""
    real_balance: Decimal  # Saldo real (entradas - saídas)
    available_balance: Decimal  # Saldo disponível (após comprometimentos)
    income: Decimal  # Total de entradas do mês
    expenses: Decimal  # Total de despesas do mês
    patrimony: Decimal  # Patrimônio total
    goals_progress: float  # Percentual de progresso nas metas (0-100)
    total_invested: Decimal  # Total investido


class ChartDataPoint(BaseModel):
    """Ponto de dados do gráfico"""
    month: str  # "Jan", "Fev", etc
    income: Decimal
    expenses: Decimal


class DashboardChart(BaseModel):
    """Dados para gráfico de fluxo mensal"""
    data: list[ChartDataPoint]


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Retorna resumo financeiro do mês atual"""
    now = datetime.now()
    current_month = now.strftime("%Y-%m")

    # Busca transações do mês atual
    transactions = session.exec(
        select(Transaction).where(
            Transaction.user_id == current_user.id,
            Transaction.reference_month == current_month,
            Transaction.deleted_at == None,
        )
    ).all()

    # Calcula entradas, saídas e patrimônio
    income = Decimal("0")
    expenses = Decimal("0")
    patrimony = Decimal("0")

    for tx in transactions:
        if tx.type == "income":
            income += tx.amount
        elif tx.type == "expense":
            expenses += tx.amount
        elif tx.type == "patrimony":
            patrimony += tx.amount

    # Saldo real = entradas - saídas
    real_balance = income - expenses

    # Busca investimentos para patrimônio total
    from ...models.investment import Investment
    investments = session.exec(
        select(Investment).where(Investment.user_id == current_user.id)
    ).all()
    total_invested = sum(inv.current_value for inv in investments)

    # Busca metas
    goals = session.exec(
        select(Goal).where(Goal.user_id == current_user.id)
    ).all()
    total_goal_progress = Decimal("0")
    if goals:
        total_goal_amount = sum(g.target_amount for g in goals)
        total_goal_current = sum(g.current_amount for g in goals)
        goals_progress = float((total_goal_current / total_goal_amount * 100)) if total_goal_amount > 0 else 0.0
    else:
        goals_progress = 0.0

    # Saldo disponível = saldo real (simplificado, sem comprometimentos ainda)
    available_balance = real_balance

    return DashboardSummary(
        real_balance=real_balance,
        available_balance=available_balance,
        income=income,
        expenses=expenses,
        patrimony=patrimony,
        goals_progress=goals_progress,
        total_invested=total_invested,
    )


@router.get("/chart", response_model=DashboardChart)
def get_dashboard_chart(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    """Retorna dados do gráfico de fluxo (últimos 6 meses)"""
    now = datetime.now()

    # Gera lista dos últimos 6 meses
    months = []
    data = []
    for i in range(5, -1, -1):
        month_date = now - timedelta(days=30 * i)
        month_str = month_date.strftime("%Y-%m")
        months.append((month_str, month_date.strftime("%b")))

    # Busca transações dos últimos 6 meses
    transactions = session.exec(
        select(Transaction).where(
            Transaction.user_id == current_user.id,
            Transaction.deleted_at == None,
        )
    ).all()

    # Agrupa por mês
    for month_str, month_display in months:
        month_txs = [tx for tx in transactions if tx.reference_month == month_str]

        income = sum(tx.amount for tx in month_txs if tx.type == "income")
        expenses = sum(tx.amount for tx in month_txs if tx.type == "expense")

        data.append(ChartDataPoint(
            month=month_display,
            income=income,
            expenses=expenses,
        ))

    return DashboardChart(data=data)
