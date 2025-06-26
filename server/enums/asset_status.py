import enum

class AssetStatus(str, enum.Enum):
    Working = "Working"
    Faulty = "Faulty"
    Partially_working = "Partially Working"
    RMA = "RMA"
    Unknown = "Unknown"
