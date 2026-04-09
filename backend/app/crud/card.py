from uuid import UUID
from sqlmodel import Session, select
from ..models.card import Card
from ..schemas.card import CardCreate, CardUpdate


def get_all(session: Session, user_id: UUID) -> list[Card]:
    return session.exec(select(Card).where(Card.user_id == user_id)).all()


def get_one(session: Session, card_id: UUID, user_id: UUID) -> Card | None:
    return session.exec(
        select(Card).where(Card.id == card_id, Card.user_id == user_id)
    ).first()


def create(session: Session, data: CardCreate, user_id: UUID) -> Card:
    card = Card(user_id=user_id, nickname=data.nickname)
    session.add(card)
    session.commit()
    session.refresh(card)
    return card


def update(session: Session, card: Card, data: CardUpdate) -> Card:
    card.nickname = data.nickname
    session.add(card)
    session.commit()
    session.refresh(card)
    return card


def delete(session: Session, card: Card) -> None:
    session.delete(card)
    session.commit()
