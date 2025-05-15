from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from models.user import Base

class PointOfContact(Base):
    __tablename__ = 'point_of_contacts'
    id = Column(Integer, primary_key=True)
    organization = Column(String)
    full_name = Column(String)
    phone_number = Column(String)
    email = Column(String)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    user = relationship("User", back_populates="contacts")

