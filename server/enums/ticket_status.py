import enum

class TicketStatus(str, enum.Enum):
    open = "Open"
    closed = "Closed"

