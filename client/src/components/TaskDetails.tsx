import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  IconButton,
  Link,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../axios_conf";
import EditTaskForm from "./EditTaskForm";
import AddReportForm from "./AddReportForm";
import Confirm from "./Confirm";
import UserDetails from "./UserDetails";
import TicketDetails from "./ticket_details/TicketDetails";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQueryClient } from "@tanstack/react-query";
import UserRole from "../enums/UserRoles";
import { useAuth } from "../context/AuthContext";

type Props = {
  open: boolean;
  task: any;
  onClose: () => void;
};

export default function TaskDetails({ open, task, onClose }: Props) {
  const [reports, setReports] = useState<any[]>([]);
  const [owners, setOwners] = useState<Record<number, string>>({});
  const [ownerData, setOwnerData] = useState<Record<number, any>>({});
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [addReportOpen, setAddReportOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [confirmTaskDeleteOpen, setConfirmTaskDeleteOpen] = useState(false);
  const [confirmReportDeleteOpen, setConfirmReportDeleteOpen] = useState(false);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [ticketDetailsOpen, setTicketDetailsOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const queryClient = useQueryClient();
  const [taskData, setTaskData] = useState(task);
  const { role } = useAuth();

  // Access control permissions
  const canDeleteTask =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canEditTask =
    role === UserRole.supervisor || role === UserRole.administrator;
  // Access control for reports
  const canManageReports =
    role === UserRole.supervisor || role === UserRole.administrator;

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${task.id}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch task", err);
      return task;
    }
  };

  const fetchTicket = async (ticketId: number) => {
    setLoadingTicket(true);
    try {
      const res = await api.get(`/tickets/${ticketId}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch ticket", err);
      throw err;
    } finally {
      setLoadingTicket(false);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.post(`/reports/task/${task.id}`);
      setReports(res.data);
      // Fetch user data for all unique created_by IDs
      const userIds = [
        ...new Set(res.data.map((report: any) => report.created_by)),
      ];
      userIds.forEach((id: number) => {
        if (id) fetchOwner(id);
      });
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  const fetchOwner = async (id: number) => {
    if (owners[id]) return;
    try {
      const res = await api.get(`/users/${id}`);
      setOwners((prev) => ({ ...prev, [id]: res.data.username }));
      setOwnerData((prev) => ({ ...prev, [id]: res.data }));
    } catch {
      setOwners((prev) => ({ ...prev, [id]: `User ${id}` }));
    }
  };

  useEffect(() => {
    if (task?.id) {
      fetchReports();
    }
  }, [task]);

  const handleOwnerClick = (id: number) => {
    const user = ownerData[id];
    if (user) {
      setSelectedUser(user);
      setUserDetailsOpen(true);
    }
  };

  const handleTicketClick = async (ticketId: number) => {
    try {
      const ticketData = await fetchTicket(ticketId);
      setSelectedTicket(ticketData);
      setTicketDetailsOpen(true);
    } catch (err) {
      console.error("Failed to open ticket details", err);
      // You might want to show a toast/snackbar error message here
    }
  };

  const handleUserDetailsClose = () => {
    setSelectedUser(null);
    setUserDetailsOpen(false);
  };

  const handleTicketDetailsClose = () => {
    setSelectedTicket(null);
    setTicketDetailsOpen(false);
  };

  const renderCreatedBy = (createdById: number) => {
    const name = owners[createdById] || createdById;
    return ownerData[createdById] ? (
      <Link
        component="button"
        onClick={() => handleOwnerClick(createdById)}
        sx={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "primary.main",
          "&:hover": {
            color: "primary.dark",
          },
        }}
      >
        {name}
      </Link>
    ) : (
      name
    );
  };

  const renderTaskValue = (key: string, value: any) => {
    // Handle ticket_id specially - make it clickable
    if (key === "ticket_id" && value) {
      return (
        <Link
          component="button"
          onClick={() => handleTicketClick(value)}
          disabled={loadingTicket}
          sx={{
            cursor: loadingTicket ? "wait" : "pointer",
            textDecoration: "underline",
            color: "primary.main",
            "&:hover": {
              color: "primary.dark",
            },
            "&:disabled": {
              color: "text.disabled",
              cursor: "wait",
            },
          }}
        >
          {loadingTicket ? "Loading..." : value}
        </Link>
      );
    }
    return value;
  };

  const handleDeleteReport = async () => {
    if (!selectedReport?.id) return;
    try {
      await api.delete(`/reports/${selectedReport.id}`);
      await fetchReports();
    } catch (err) {
      console.error("Failed to delete report", err);
    } finally {
      setConfirmReportDeleteOpen(false);
      setSelectedReport(null);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      queryClient.invalidateQueries(["tasks"]);
      setConfirmTaskDeleteOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleReportCreated = () => {
    // Refresh reports after creating a new one
    fetchReports();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Task Details
          {canDeleteTask && (
            <IconButton
              sx={{ float: "right", ml: 1 }}
              onClick={() => setConfirmTaskDeleteOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {canEditTask && (
            <IconButton
              sx={{ float: "right" }}
              onClick={() => {
                setSelectedTask(task);
                setEditTaskOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {Object.entries(task).map(([key, value]) => {
            if (
              value === null ||
              value === undefined ||
              (typeof value === "string" && value.trim() === "") ||
              (Array.isArray(value) && value.length === 0)
            ) {
              return null; // Skip empty values
            }
            return (
              <Typography
                key={key}
                variant={key === "tag" ? "subtitle1" : "body1"}
              >
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>:{" "}
                {renderTaskValue(key, value)}
              </Typography>
            );
          })}
          <Typography variant="h6" sx={{ mt: 3 }}>
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
                  position: "relative",
                }}
              >
                <Typography variant="subtitle2">Report {index + 1}</Typography>
                <Typography variant="body2">
                  • Created By: {renderCreatedBy(report.created_by)}
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
                {canManageReports && (
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
                )}
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 1 }}>No reports found.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setAddReportOpen(true)}>
            Create Report
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add Report Form */}
      <AddReportForm
        open={addReportOpen}
        onClose={() => setAddReportOpen(false)}
        onReportCreated={handleReportCreated}
        ticketId={task.ticket_id}
        taskId={task.id}
      />

      {/* Edit Task */}
      {selectedTask && (
        <EditTaskForm
          open={editTaskOpen}
          task={selectedTask}
          onClose={async () => {
            const updated = await fetchTask();
            setTaskData(updated);
            setEditTaskOpen(false);
            setSelectedTask(null);
          }}
        />
      )}

      {/* Confirm Delete Report */}
      {canManageReports && (
        <Confirm
          open={confirmReportDeleteOpen}
          message={`Are you sure you want to delete report "${selectedReport?.title || selectedReport?.name || "this report"}"?`}
          onConfirm={handleDeleteReport}
          onCancel={() => {
            setConfirmReportDeleteOpen(false);
            setSelectedReport(null);
          }}
        />
      )}

      {/* Confirm Delete Task */}
      <Confirm
        open={confirmTaskDeleteOpen}
        message={`Are you sure you want to delete task "${task.title || task.name || "this task"}"?`}
        onConfirm={handleDeleteTask}
        onCancel={() => setConfirmTaskDeleteOpen(false)}
      />

      {/* User Details Dialog */}
      {selectedUser && (
        <UserDetails
          open={userDetailsOpen}
          user={selectedUser}
          onClose={handleUserDetailsClose}
        />
      )}

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <TicketDetails
          open={ticketDetailsOpen}
          ticket={selectedTicket}
          onClose={handleTicketDetailsClose}
        />
      )}
    </>
  );
}
