from typing import List
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends
from db import get_db
from auth.utils import get_current_user
from models.user import User
from controllers import report as controller
from schemas.report import ReportCreate, ReportRead

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/{ticket_id}", response_model=List[ReportRead])
def get_ticket_reports(ticket_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.get_ticket_reports_controller(db, ticket_id, current_user)

@router.post("/create/{ticket_id}", response_model=ReportRead)
def create_ticket(ticket_id: int, report: ReportCreate,  db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return controller.create_report_controller(db,ticket_id, report.content, current_user)

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    controller.delete_report_controller(db, report_id, current_user)
