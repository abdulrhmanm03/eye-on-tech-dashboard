from datetime import date
from sqlalchemy import Column, Integer, String, Text, Date, Enum, ForeignKey, Table
from sqlalchemy.orm import relationship
from models.user import Base
from enums.ticket_status import TicketStatus

ticket_technicians = Table(
    'ticket_technicians',
    Base.metadata,
    Column('ticket_id', ForeignKey('tickets.id', ondelete="CASCADE"), primary_key=True),
    Column('technician_id', ForeignKey('users.id', ondelete="CASCADE"), primary_key=True)
)

class Ticket(Base):
    __tablename__ = 'tickets'
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    object_type = Column(String)
    object_id = Column(Integer)
    description = Column(Text)
    creation_date = Column(Date, default=date.today)
    status = Column(Enum(TicketStatus))
    
    handlers = relationship("User", secondary=ticket_technicians)
    owner = relationship("User", back_populates="tickets")
    tasks = relationship("Task", back_populates="ticket", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="ticket", cascade="all, delete-orphan")
