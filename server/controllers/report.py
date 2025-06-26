from typing import Optional
from sqlalchemy.orm import Session
from crud import report as crud
from models.user import User


def create_report_controller(
    db: Session,
    current_user: User,
    ticket_id: int,
    content: str,
    task_id: Optional[int] = None
):
    user_id = current_user.get("id")
    return crud.create_report(db, ticket_id, content, user_id, task_id)

def get_ticket_reports_controller(db: Session, ticket_id: int, current_user: User):
    return crud.get_tickets_reports(db, ticket_id)

def get_task_reports_controller(db: Session, task_id: int, current_user: User):
    return crud.get_task_reports(db, task_id)

def delete_report_controller(db: Session, report_id: int, current_user: User):
    crud.delete_report(db, report_id)
