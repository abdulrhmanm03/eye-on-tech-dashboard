from sqlalchemy.orm import Session
from models.report import Report

def create_report(db: Session, ticket_id: int, content: str) -> Report:
    new_report = Report(
        ticket_id=ticket_id,
        content=content,
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

def delete_report(db: Session, report_id: int):
    report = db.query(Report).filter(Report.id == report_id).first()
    db.delete(report)
    db.commit()
