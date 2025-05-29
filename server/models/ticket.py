from sqlalchemy import Column, Integer, Text, Date, Enum, ForeignKey, Table
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
    asset_id = Column(Integer, ForeignKey('assets.id', ondelete="CASCADE"), nullable=True)
    description = Column(Text, nullable=True)
    creation_date = Column(Date)
    status = Column(Enum(TicketStatus))
    
    owner = relationship("User", back_populates="tickets")
    asset = relationship("Asset", back_populates="tickets")
    handlers = relationship("User", secondary=ticket_technicians)
    tasks = relationship("Task", back_populates="ticket", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="ticket", cascade="all, delete-orphan")
