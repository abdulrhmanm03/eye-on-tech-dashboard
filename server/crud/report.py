from typing import Optional
from sqlalchemy.orm import Session
from models.report import Report

def create_report(
    db: Session,
    ticket_id: int,
    content: str,
    created_by: int,
    task_id: Optional[int] = None
) -> Report:
    new_report = Report(
        ticket_id=ticket_id,
        content=content,
        created_by=created_by,
        task_id=task_id
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

def get_tickets_reports(db: Session, ticket_id: int):
    return (
        db.query(Report)
        .filter(Report.ticket_id == ticket_id)
        .all()
    )

def get_task_reports(db: Session, task_id: int):
    return (
        db.query(Report)
        .filter(Report.task_id == task_id)
        .all()
    )

def delete_report(db: Session, report_id: int):
    report = db.query(Report).filter(Report.id == report_id).first()
    db.delete(report)
    db.commit()
