from sqlalchemy.orm import Session
from crud import report as crud
from models.user import User


def create_report_controller(db: Session, ticket_id: int, content: str, current_user: User):
    return crud.create_report(db, ticket_id, content)
