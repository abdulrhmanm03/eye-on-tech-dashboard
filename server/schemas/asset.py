from pydantic import BaseModel
from typing import Optional
from datetime import date
from enums.asset_status import AssetStatus

# Shared properties
class AssetBase(BaseModel):
    type: str
    tag: str
    model: str
    serial_number: str
    production_year: int
    chassis_number: Optional[str] = None
    plate_number: Optional[str] = None
    location: str
    geolocation: str
    note: Optional[str] = None
    status: AssetStatus
    warranty_expiry: date
    maintenance_expiry: date
    last_service: date
    next_service: date

# Properties required for asset creation
class AssetCreate(AssetBase):
    owner_id: int  # Required to link asset to a user

# Properties returned to client
class AssetRead(AssetBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

