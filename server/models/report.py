from datetime import date
from sqlalchemy import Column, Date, Integer, Text,  ForeignKey
from sqlalchemy.orm import relationship
from models.user import Base

class Report(Base):
    __tablename__ = 'reports'
    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id', ondelete="CASCADE"))
    content = Column(Text)
    created_at = Column(Date, default=date.today)

    ticket = relationship("Ticket", back_populates="reports")
