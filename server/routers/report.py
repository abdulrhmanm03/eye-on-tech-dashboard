from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db import get_db
from auth.utils import get_current_user
from models.user import User
from controllers import report as controller
from schemas.report import ReportCreate, ReportRead

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/create", response_model=ReportRead)
def create_ticket(payload: ReportCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.create_report_controller(db,payload.ticket_id, payload.content, current_user)


