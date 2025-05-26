from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from schemas.ticket import TicketCreate, TicketRead
from schemas.task import TaskRead
from db import get_db
from auth.utils import get_current_user
from models.user import User
from controllers import ticket as controller

router = APIRouter(prefix="/tickets", tags=["tickets"])

@router.post("/create", response_model=TicketRead)
def create_ticket(ticket_in: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.create_ticket_controller(ticket_in, db, current_user)

@router.post("/add-tech")
def add_tech_to_ticket(
        ticket_id: int,
        tech_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    return controller.add_tech_to_ticket_controller(ticket_id, tech_id, db, current_user) 

@router.get("/search-techs")
def search_techs(query: str, db: Session = Depends(get_db)):
    return controller.search_techs_controller(query, db)

@router.get("/", response_model=List[TicketRead])
def list_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.list_tickets_controller(skip, limit, db, current_user)

@router.get("/tasks/{ticket_id}", response_model=List[TaskRead])
def get_ticket_tasks(ticket_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.get_ticket_tasks_controller(ticket_id, skip, limit, db, current_user)

@router.get("/{ticket_id}", response_model=TicketRead)
def read_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.read_ticket_controller(ticket_id, db, current_user)

@router.put("/{ticket_id}", response_model=TicketRead)
def update_ticket(ticket_id: int, ticket_in: TicketCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.update_ticket_controller(ticket_id, ticket_in, db, current_user) 

@router.delete("/delete/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.delete_ticket_controller(ticket_id, db, current_user)

@router.delete("/{ticket_id}/tech/{tech_id}", status_code=204)
def delete_tech_from_ticket(ticket_id: int, tech_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.delete_tech_from_ticket_controller(db, ticket_id, tech_id, current_user)

