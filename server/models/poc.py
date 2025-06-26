from sqlalchemy import Column, Integer, String, ForeignKey, Enum
from sqlalchemy.orm import relationship
from models.user import Base
from enums.poc_types import ContactType

class PointOfContact(Base):
    __tablename__ = 'point_of_contacts'

    id = Column(Integer, primary_key=True)
    username = Column(String)
    type = Column(Enum(ContactType), nullable=False)
    value = Column(String, nullable=False)

    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    asset_id = Column(Integer, ForeignKey('assets.id', ondelete="CASCADE"), nullable=True)  # 👈 New FK to Asset

    user = relationship("User", back_populates="contacts")
    asset = relationship("Asset", back_populates="contacts")  # 👈 New relationship to Asset
