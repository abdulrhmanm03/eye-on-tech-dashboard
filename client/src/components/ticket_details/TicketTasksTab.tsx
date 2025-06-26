import { useState } from "react";
import {
  Typography,
  Box,
  Divider,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskDetails from "../TaskDetails";

type Props = {
  tasks: any[];
  canManageTasks: boolean;
  canDelete: boolean;
  onEditTask: (task: any) => void;
  onDeleteTask: (task: any) => void;
};

export default function TicketTasksTab({
  tasks,
  canManageTasks,
  canDelete,
  onEditTask,
  onDeleteTask,
}: Props) {
  const [statusFilter, setStatusFilter] = useState<string | null>("all");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);

  const handleFilterChange = (
    _: React.MouseEvent<HTMLElement>,
    newFilter: string | null,
  ) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setTaskDetailsOpen(true);
  };

  const handleTaskDetailsClose = () => {
    setTaskDetailsOpen(false);
    setSelectedTask(null);
  };

  const getBorderColor = (status: string) => {
    if (status.toLowerCase() === "completed") return "green";
    if (status.toLowerCase() === "in progress") return "red";
    return "#1976d2"; // default blue
  };

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter(
          (task) => task.status?.toLowerCase() === statusFilter.toLowerCase(),
        );

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Tasks
      </Typography>
      <ToggleButtonGroup
        value={statusFilter}
        exclusive
        onChange={handleFilterChange}
        sx={{ mt: 1 }}
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="completed">Completed</ToggleButton>
        <ToggleButton value="in progress">In Progress</ToggleButton>
      </ToggleButtonGroup>
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task, index) => (
          <Box
            key={task.id}
            sx={{
              mt: 2,
              mb: 2,
              pl: 2,
              borderLeft: `4px solid ${getBorderColor(task.status)}`,
              position: "relative",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
            onClick={() => handleTaskClick(task)}
          >
            <Typography variant="subtitle2">Task {index + 1}</Typography>
            {Object.entries(task).map(([key, value]) => (
              <Typography key={key} variant="body2">
                •{" "}
                <strong>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/_/g, " ")}
                </strong>
                :{" "}
                {value instanceof Date
                  ? value.toLocaleDateString()
                  : value?.toString() || "N/A"}
              </Typography>
            ))}
            {canManageTasks && (
              <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTask(task);
                  }}
                >
                  <EditIcon />
                </IconButton>
                {canDelete && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            )}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      ) : (
        <Typography sx={{ mt: 2 }}>No tasks found.</Typography>
      )}

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDetails
          open={taskDetailsOpen}
          task={selectedTask}
          onClose={handleTaskDetailsClose}
        />
      )}
    </>
  );
}
