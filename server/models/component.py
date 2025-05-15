from sqlalchemy import Column, Integer, String, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship
from models.user import Base
from enums.asset_status import AssetStatus

class Component(Base):
    __tablename__ = 'components'
    id = Column(Integer, primary_key=True)
    parent_asset_id = Column(Integer, ForeignKey('assets.id', ondelete="CASCADE"))
    type = Column(String)
    model = Column(String)
    serial_number = Column(String)
    production_year = Column(Integer)
    status = Column(Enum(AssetStatus))
    last_service = Column(Date)
    next_service = Column(Date)
    asset = relationship("Asset", back_populates="components")
