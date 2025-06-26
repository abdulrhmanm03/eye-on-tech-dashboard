from datetime import date
from sqlalchemy import Column, Date, Integer, Text,  ForeignKey
from sqlalchemy.orm import relationship
from db import Base 

class Report(Base):
    __tablename__ = 'reports'
    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id', ondelete="CASCADE"))
    task_id = Column(Integer, ForeignKey('tasks.id', ondelete="CASCADE"))
    content = Column(Text)
    created_at = Column(Date, default=date.today)
    created_by = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    ticket = relationship("Ticket", back_populates="reports")
    task = relationship("Task", back_populates="reports")
    user = relationship("User", back_populates="reports")
