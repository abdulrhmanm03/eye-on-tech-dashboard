from sqlalchemy import Column, Integer, String, Text, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from models.user import Base
from enums.task_status import TaskStatus

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    object_type = Column(String)
    object_id = Column(Integer)
    description = Column(Text)
    creation_date = Column(Date)
    status = Column(Enum(TaskStatus))
    owner = relationship("User", back_populates="tasks")
