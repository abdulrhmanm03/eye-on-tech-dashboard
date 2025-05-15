from pydantic import BaseModel
from typing import Optional
from datetime import date
from enums.asset_status import AssetStatus

# Shared fields
class ComponentBase(BaseModel):
    type: str
    model: str
    serial_number: str
    production_year: int
    status: AssetStatus
    last_service: date
    next_service: date

# For creation
class ComponentCreate(ComponentBase):
    parent_asset_id: int

# For response
class ComponentRead(ComponentBase):
    id: int
    parent_asset_id: int

    class Config:
        from_attributes = True


