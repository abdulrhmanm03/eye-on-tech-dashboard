from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from schemas.ticket import TicketCreate, TicketRead
from schemas.task import TaskRead
from crud import ticket as crud_ticket
from crud import task as crud_task
from db import get_db
from auth.utils import get_current_user
from models.user import User
from enums.user_role import UserRole

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.post("/create", response_model=TicketRead)
def create_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = crud_ticket.create_ticket(db, ticket_in)
    return ticket

@router.get("/", response_model=List[TicketRead])
def list_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.get("id")
    user_role = current_user.get("role")
    if user_role not in [UserRole.supervisor, UserRole.administrator]:
        return crud_ticket.get_user_tickets(db, user_id)
    return crud_ticket.get_tickets(db, skip, limit)

@router.get("/tasks/{ticket_id}", response_model=List[TaskRead])
def get_ticket_tasks(ticket_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return crud_task.get_ticket_tasks(db, ticket_id, skip, limit)

@router.get("/{ticket_id}", response_model=TicketRead)
def read_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ticket = crud_ticket.get_ticket(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.put("/{ticket_id}", response_model=TicketRead)
def update_ticket(ticket_id: int, ticket_in: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
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

@router.delete("/delete/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_role = current_user.get("role")
    if user_role != UserRole.supervisor:
        raise HTTPException(status_code=403, detail="Forbidden")
    success = crud_ticket.delete_ticket(db, ticket_id)
    if not success:
        raise HTTPException(status_code=404, detail="Ticket not found")

