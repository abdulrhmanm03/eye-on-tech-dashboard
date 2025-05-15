import enum

class TaskStatus(str, enum.Enum):
    in_progress = "In Progress"
    completed = "Completed"
