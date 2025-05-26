from typing import List
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.ticket import TicketCreate, TicketRead
from crud import ticket as crud_ticket
from crud import task as crud_task
from db import get_db
from auth.utils import get_current_user
from models.user import User
from enums.user_role import UserRole
import models


def create_ticket_controller(
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> TicketRead:
    owner_id = current_user.get("id")
    return crud_ticket.create_ticket(db, ticket_in, owner_id)


def list_tickets_controller(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[models.Ticket]:
    user_id = current_user.get("id")
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        return crud_ticket.get_user_tickets(db, user_id)
    return crud_ticket.get_tickets(db, skip, limit)


def get_ticket_tasks_controller(
    ticket_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> List[models.Task]:
    return crud_task.get_ticket_tasks(db, ticket_id, skip, limit)


def read_ticket_controller(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> TicketRead:
    ticket = crud_ticket.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


def update_ticket_controller(
    ticket_id: int,
    ticket_in: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> TicketRead:
    user_role = current_user.get("role")

    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden",
        )
    updated = crud_ticket.update_ticket(db, ticket_id, ticket_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return updated


def delete_ticket_controller(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role != UserRole.supervisor:
        raise HTTPException(status_code=403, detail="Forbidden")
    success = crud_ticket.delete_ticket(db, ticket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")

def add_tech_to_ticket_controller(
    ticket_id: int,
    tech_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator, UserRole.engineer]:
        raise HTTPException(status_code=403, detail="Forbidden")
    success, message = crud_ticket.add_tech_to_ticket(db, ticket_id, tech_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    return {"success": True, "message": message}

def search_techs_controller(query: str, db: Session):
    return crud_ticket.search_tech(query, db)

def delete_tech_from_ticket_controller(
    db: Session,
    ticket_id: int,
    tech_id: int,
    current_user: User,
):
    crud_ticket.delete_tech_from_ticket(db, ticket_id, tech_id)
