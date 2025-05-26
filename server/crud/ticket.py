from sqlalchemy.orm import Session
from models.ticket import Ticket
from models.user import User
from schemas.ticket import TicketCreate 
from typing import List

def create_ticket(db: Session, ticket_in: TicketCreate, owner_id: int) -> Ticket:
    ticket = Ticket(
        object_type=ticket_in.object_type,
        object_id=ticket_in.object_id,
        description=ticket_in.description,
        creation_date=ticket_in.creation_date,
        status=ticket_in.status,
        owner_id=owner_id,
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

def get_ticket(db: Session, ticket_id: int) -> Ticket | None:
    return db.query(Ticket).filter(Ticket.id == ticket_id).first()

def get_user_tickets(db: Session, user_id: int) -> List[Ticket] | None:
    return db.query(Ticket).filter(Ticket.owner_id == user_id).all()

def get_tickets(db: Session, skip: int = 0, limit: int = 100) -> List[Ticket]:
    return db.query(Ticket).offset(skip).limit(limit).all()

def update_ticket(db: Session, ticket_id: int, ticket_in: TicketCreate) -> Ticket | None:
    ticket = get_ticket(db, ticket_id)
    if not ticket:
        return None

    for field, value in ticket_in.model_dump().items():
        setattr(ticket, field, value)

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

def add_tech_to_ticket(
    db: Session,
    ticket_id: int,
    tech_id: int
):
    # Fetch the ticket by ID
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        return False, f"Ticket with id {ticket_id} not found"

    # Fetch the technician by ID
    technician = db.query(User).filter(User.id == tech_id).first()
    if not technician:
        return False, f"Technician with id {tech_id} not found"

    # Check if the technician is already assigned
    if technician in ticket.handlers:
        return False, f"Technician with id {tech_id} is already assigned to ticket {ticket_id}"

    # Add the technician to the ticket's handlers
    ticket.handlers.append(technician)
    db.commit()

    return True, "Technician successfully added to the ticket"

def search_tech(query: str, db: Session):
    return (
        db.query(User)
        .filter(User.role == "technician")
        .filter(User.id.ilike(f"%{query}%"))
        .limit(10)
        .all()
    )
def get_ticket_techs(db: Session, ticket_id: int):
        ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
        if not ticket:
            return None
        return ticket.handlers

def delete_tech_from_ticket(db: Session, ticket_id: int, tech_id: int):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if ticket:
        technician = db.query(User).filter(User.id == tech_id).first()
        if technician in ticket.handlers:
            ticket.handlers.remove(technician)
            db.commit()
