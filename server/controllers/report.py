from sqlalchemy.orm import Session
from sqlalchemy.sql.functions import current_user
from crud import report as crud
from models.user import User


def create_report_controller(db: Session, ticket_id: int, content: str, current_user: User):
    return crud.create_report(db, ticket_id, content)

def get_ticket_reports_controller(db: Session, ticket_id: int, current_user: User):
    return crud.get_tickets_reports(db, ticket_id)

def delete_report_controller(db: Session, report_id: int, current_user: User):
    crud.delete_report(db, report_id)
