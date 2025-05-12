import enum

class UserRole(str, enum.Enum):
    client = "Client"
    technician = "Technician"
    engineer = "Engineer"
    administrator = "Administrator"
    supervisor = "Supervisor"
