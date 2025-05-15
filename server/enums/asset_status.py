import enum

class AssetStatus(str, enum.Enum):
    working = "Working"
    faulty = "Faulty"
    partially_working = "Partially Working"
    rma = "RMA"
