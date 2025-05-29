from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, Text
from sqlalchemy.orm import relationship
from models.user import Base
from enums.asset_status import AssetStatus

class Asset(Base):
    __tablename__ = 'assets'
    id = Column(Integer, primary_key=True)
    type = Column(String)
    tag = Column(String)
    model = Column(String)
    serial_number = Column(String)
    production_year = Column(Integer)
    chassis_number = Column(String, nullable=True)
    plate_number = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    location = Column(String)
    geolocation = Column(String)
    note = Column(Text, nullable=True)
    status = Column(Enum(AssetStatus))
    warranty_expiry = Column(Date)
    maintenance_expiry = Column(Date)
    last_service = Column(Date)
    next_service = Column(Date)
    owner = relationship("User", back_populates="assets")
    tickets = relationship("Ticket", back_populates="asset", cascade="all, delete-orphan")
    components = relationship("Component", back_populates="asset", cascade="all, delete-orphan")
