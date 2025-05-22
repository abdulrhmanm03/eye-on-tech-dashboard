from datetime import date
from sqlalchemy import Column, Integer, String, Text, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from models.user import Base
from enums.task_status import TaskStatus

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id', ondelete="CASCADE"))  # Link to Ticket
    object_type = Column(String)
    object_id = Column(Integer)
    description = Column(Text)
    creation_date = Column(Date, default=date.today)
    status = Column(Enum(TaskStatus))

    ticket = relationship("Ticket", back_populates="tasks")  # Reverse link to Ticket
