from sqlalchemy import Column, Integer, Text, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from models.user import Base
from enums.task_status import TaskStatus

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id', ondelete="CASCADE"))  # Link to Ticket
    description = Column(Text, nullable=True)
    creation_date = Column(Date)
    status = Column(Enum(TaskStatus))

    ticket = relationship("Ticket", back_populates="tasks")  # Reverse link to Ticket
