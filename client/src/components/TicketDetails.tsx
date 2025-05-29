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
import AddTechForm from "./AddTechForm";
import { Tabs, Tab } from "@mui/material";

type Props = {
  open: boolean;
  ticket: any;
  onClose: () => void;
};

export default function TicketDetails({ open, ticket, onClose }: Props) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [confirmTicketDeleteOpen, setConfirmTicketDeleteOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [confirmTaskDeleteOpen, setConfirmTaskDeleteOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(ticket); // local editable ticket state
  const [addReportOpen, setAddReportOpen] = useState(false);

  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addTechOpen, setAddTechOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const [selectedTech, setSelectedTech] = useState<any | null>(null);
  const [confirmTechDeleteOpen, setConfirmTechDeleteOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [confirmReportDeleteOpen, setConfirmReportDeleteOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    setCurrentTicket(ticket); // update local state when prop changes
  }, [ticket]);

  const fetchTicket = async () => {
    try {
      const res = await api.get(`/tickets/${ticket.id}`);
      setCurrentTicket(res.data);
      queryClient.invalidateQueries(["tickets"]);
    } catch (err) {
      console.error("Failed to fetch ticket", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.post(`/reports/${ticket.id}`);
      setReports(res.data); // if it returns a list, use res.data directly
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

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
      fetchReports(); // <-- add this
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

  const handleDeleteReport = async () => {
    if (!selectedReport?.id) return;
    try {
      await api.delete(`/reports/${selectedReport.id}`);
      await fetchReports(); // refresh report list
    } catch (err) {
      console.error("Failed to delete report", err);
    } finally {
      setConfirmReportDeleteOpen(false);
      setSelectedReport(null);
    }
  };

  const handleDeleteTech = async () => {
    if (!selectedTech?.id) return;
    try {
      await api.delete(`/tickets/${ticket.id}/tech/${selectedTech.id}`);
      await fetchTicket();
      const updatedHandlers = currentTicket.handlers.filter(
        (tech: any) => tech.id !== selectedTech.id,
      );
      setCurrentTicket({ ...currentTicket, handlers: updatedHandlers });
    } catch (err) {
      console.error("Failed to delete technician", err);
    } finally {
      setConfirmTechDeleteOpen(false);
      setSelectedTech(null);
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
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            centered
          >
            <Tab label="Tasks" />
            <Tab label="Reports" />
            <Tab label="Technicians" />
          </Tabs>

          {tabIndex === 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
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
                    <Typography variant="subtitle2">
                      Task {index + 1}
                    </Typography>
                    {Object.entries(task).map(([key, value]) => (
                      <Typography key={key} variant="body2">
                        •{" "}
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/_/g, " ")}
                        :{" "}
                        {value instanceof Date
                          ? value.toLocaleDateString()
                          : value?.toString() || "N/A"}
                      </Typography>
                    ))}
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
            </>
          )}

          {tabIndex === 1 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Reports
              </Typography>
              {reports.length > 0 ? (
                reports.map((report, index) => (
                  <Box
                    key={report.id}
                    sx={{
                      mt: 2,
                      mb: 2,
                      pl: 2,
                      borderLeft: "4px solid #1976d2",
                      position: "relative", // Needed for positioning icons
                    }}
                  >
                    <Typography variant="subtitle2">
                      Report {index + 1}
                    </Typography>
                    <Typography variant="body2">
                      • Created At:{" "}
                      {new Date(report.created_at).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                    <Typography variant="body2">
                      • Content: {report.content}
                    </Typography>

                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                      <IconButton
                        onClick={() => {
                          setSelectedReport(report);
                          setConfirmReportDeleteOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography sx={{ mt: 1 }}>No reports found.</Typography>
              )}
            </>
          )}

          {tabIndex === 2 && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Technicians
              </Typography>
              {currentTicket.handlers && currentTicket.handlers.length > 0 ? (
                currentTicket.handlers.map((tech: any, index: number) => (
                  <Box
                    key={tech.id}
                    sx={{
                      mt: 2,
                      mb: 2,
                      pl: 2,
                      borderLeft: "4px solid #1976d2",
                    }}
                    position="relative"
                  >
                    <Typography variant="subtitle2">
                      Technician {index + 1}
                    </Typography>
                    <Typography variant="body2">• ID: {tech.id}</Typography>
                    <Typography variant="body2">
                      • Username: {tech.username}
                    </Typography>
                    <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                      <IconButton
                        onClick={() => {
                          setSelectedTech(tech);
                          setConfirmTechDeleteOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography sx={{ mt: 1 }}>No technicians assigned.</Typography>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions>
          {tabIndex === 0 && (
            <Button onClick={() => setAddTaskOpen(true)} variant="contained">
              Add Task
            </Button>
          )}
          {tabIndex === 1 && (
            <Button onClick={() => setAddReportOpen(true)} variant="contained">
              Add Report
            </Button>
          )}
          {tabIndex === 2 && (
            <Button onClick={() => setAddTechOpen(true)} variant="contained">
              Add Tech
            </Button>
          )}
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
            fetchReports(); // Refresh reports
            setAddReportOpen(false);
          }}
        />
      )}
      {addTechOpen && (
        <AddTechForm
          open={addTechOpen}
          onClose={() => setAddTechOpen(false)}
          ticketId={ticket.id}
          onSuccess={() => {
            fetchTicket();
            setAddTechOpen(false);
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
      <Confirm
        open={confirmTechDeleteOpen}
        message={`Are you sure you want to remove technician "${selectedTech?.username || "this technician"}" from the ticket?`}
        onConfirm={handleDeleteTech}
        onCancel={() => {
          setConfirmTechDeleteOpen(false);
          setSelectedTech(null);
        }}
      />
      <Confirm
        open={confirmReportDeleteOpen}
        message={`Are you sure you want to delete report ID "${selectedReport?.id}"?`}
        onConfirm={handleDeleteReport}
        onCancel={() => {
          setConfirmReportDeleteOpen(false);
          setSelectedReport(null);
        }}
      />
    </>
  );
}
