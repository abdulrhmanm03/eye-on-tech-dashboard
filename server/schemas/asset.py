from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from enums.asset_status import AssetStatus
from models.user import User

# Shared properties
class AssetBase(BaseModel):
    type: Optional[str] = None
    tag: Optional[str] = None
    model: Optional[str] = None
    serial_number: Optional[str] = None
    production_year: Optional[int] = None
    chassis_number: Optional[str] = None
    plate_number: Optional[str] = None
    location: Optional[str] = None
    geolocation: Optional[str] = None
    note: Optional[str] = None
    status: Optional[AssetStatus] = None
    warranty_expiry: Optional[date] = None
    maintenance_expiry: Optional[date] = None
    last_service: Optional[date] = None
    next_service: Optional[date] = None

class GrantAccessRequest(BaseModel):
    user_id: int
# Properties required for asset creation
class AssetCreate(AssetBase):
    owner_id: int  # Required to link asset to a user

# Properties returned to client
class AssetRead(AssetBase):
    id: int
    owner_id: Optional[int] = None

    class Config:
        from_attributes = True

