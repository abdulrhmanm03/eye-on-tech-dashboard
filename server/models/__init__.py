from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here to ensure they are registered with the Base
from .user import User
from .contact import PointOfContact
from .asset import Asset
from .ticket import Ticket
from .task import Task
from .component import Component
