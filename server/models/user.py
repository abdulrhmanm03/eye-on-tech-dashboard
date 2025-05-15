from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from db import Base
from enums.user_role import UserRole

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(Enum(UserRole), nullable=False)

    contacts = relationship("PointOfContact", back_populates="user", cascade="all, delete-orphan")
    assets = relationship("Asset", back_populates="owner", cascade="all, delete-orphan")
    tickets = relationship("Ticket", back_populates="owner", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
