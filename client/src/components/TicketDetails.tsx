import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../axios_conf";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Confirm from "./Confirm";
import EditTicketForm from "./EditTicketForm";
import EditTaskForm from "./EditTaskForm"; // Assuming this is similar to EditPocForm
import { useQueryClient } from "@tanstack/react-query";
import AddTaskForm from "./AddTaskForm";
import AddReportForm from "./AddReportForm";

type Props = {
  open: boolean;
  ticket: any;
  onClose: () => void;
};

export default function TicketDetails({ open, ticket, onClose }: Props) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [confirmTicketDeleteOpen, setConfirmTicketDeleteOpen] = useState(false);

  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [confirmTaskDeleteOpen, setConfirmTaskDeleteOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(ticket); // local editable ticket state
  const [addReportOpen, setAddReportOpen] = useState(false);

  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentTicket(ticket); // update local state when prop changes
  }, [ticket]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tickets/tasks/${ticket.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  useEffect(() => {
    if (ticket?.id) {
      fetchTasks();
    }
  }, [ticket]);

  const handleDeleteTicket = async () => {
    try {
      await api.delete(`/tickets/delete/${ticket.id}`);
      queryClient.invalidateQueries(["tickets"]);
      setConfirmTicketDeleteOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete ticket", err);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask?.id) return;
    try {
      await api.delete(`/tasks/delete/${selectedTask.id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setConfirmTaskDeleteOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ticket Details
          <IconButton
            sx={{ float: "right", ml: 1 }}
            onClick={() => setConfirmTicketDeleteOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            sx={{ float: "right" }}
            onClick={() => setEditTicketOpen(true)}
          >
            <EditIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="subtitle1">Id: {currentTicket.id}</Typography>
          <Typography variant="body2">
            Description: {currentTicket.description}
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Tasks
          </Typography>

          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <Box
                key={task.id}
                sx={{
                  mt: 2,
                  mb: 2,
                  pl: 2,
                  borderLeft: "4px solid #1976d2",
                  position: "relative",
                }}
              >
                <Typography variant="subtitle2">Task {index + 1}</Typography>
                <Typography variant="body2">• Id: {task.id}</Typography>
                <Typography variant="body2">• Status: {task.status}</Typography>

                <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                  <IconButton
                    onClick={() => {
                      setSelectedTask(task);
                      setEditTaskOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedTask(task);
                      setConfirmTaskDeleteOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 1 }}>No tasks found.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setAddReportOpen(true)} variant="outlined">
            Add Report
          </Button>
          <Button onClick={() => setAddTaskOpen(true)} variant="contained">
            Add Task
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Ticket */}
      <Confirm
        open={confirmTicketDeleteOpen}
        message={`Are you sure you want to delete ticket "${ticket.title}"?`}
        onConfirm={handleDeleteTicket}
        onCancel={() => setConfirmTicketDeleteOpen(false)}
      />
      {addTaskOpen && (
        <AddTaskForm
          open={addTaskOpen}
          onClose={() => setAddTaskOpen(false)}
          onTaskCreated={fetchTasks} // refetch tasks after add
          ticketId={ticket.id}
        />
      )}

      {editTicketOpen && (
        <EditTicketForm
          open={editTicketOpen}
          ticket={currentTicket}
          onClose={(updatedTicket: any) => {
            setEditTicketOpen(false);
            if (updatedTicket) {
              setCurrentTicket(updatedTicket); // update local ticket
              queryClient.invalidateQueries(["tickets"]); // optional, if you use cached queries
              fetchTasks(); // in case description changes warrant task refresh
            }
          }}
        />
      )}

      {selectedTask && (
        <EditTaskForm
          open={editTaskOpen}
          task={selectedTask}
          onClose={() => {
            setEditTaskOpen(false);
            setSelectedTask(null);
          }}
          onSuccess={fetchTasks} // refetch after edit
        />
      )}

      {addReportOpen && (
        <AddReportForm
          open={addReportOpen}
          onClose={() => setAddReportOpen(false)}
          ticketId={ticket.id}
          onReportCreated={() => {
            // Optional: you can implement report fetching here if you decide to show reports
            setAddReportOpen(false);
          }}
        />
      )}
      {/* Confirm Delete Task */}
      <Confirm
        open={confirmTaskDeleteOpen}
        message={`Are you sure you want to delete task "${selectedTask?.title || "this task"}"?`}
        onConfirm={handleDeleteTask}
        onCancel={() => {
          setConfirmTaskDeleteOpen(false);
          setSelectedTask(null);
        }}
      />
    </>
  );
}
