from sqlalchemy.orm import Session
from models.ticket import Ticket
from models.user import User
from schemas.ticket import TicketCreate, TicketRead
from typing import List

def create_ticket(db: Session, ticket_in: TicketCreate) -> Ticket:
    handlers = db.query(User).filter(User.id.in_(ticket_in.handler_ids)).all()
    ticket = Ticket(
        object_type=ticket_in.object_type,
        object_id=ticket_in.object_id,
        description=ticket_in.description,
        creation_date=ticket_in.creation_date,
        status=ticket_in.status,
        owner_id=ticket_in.owner_id,
        handlers=handlers
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

def get_ticket(db: Session, ticket_id: int) -> Ticket | None:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def get_tickets(db: Session, skip: int = 0, limit: int = 100) -> List[Ticket]:
    return db.query(Ticket).offset(skip).limit(limit).all()

def update_ticket(db: Session, ticket_id: int, ticket_in: TicketCreate) -> Ticket | None:
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        return None

    handlers = db.query(User).filter(User.id.in_(ticket_in.handler_ids)).all()

    for field, value in ticket_in.model_dump(exclude={"handler_ids"}).items():
        setattr(ticket, field, value)

    ticket.handlers = handlers
    db.commit()
    db.refresh(ticket)
    return ticket

def delete_ticket(db: Session, ticket_id: int) -> bool:
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        return False
    db.delete(ticket)
    db.commit()
    return True
