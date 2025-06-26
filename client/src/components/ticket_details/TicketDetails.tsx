import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../axios_conf";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Confirm from "../Confirm";
import EditTicketForm from "../EditTicketForm";
import EditTaskForm from "../EditTaskForm";
import { useQueryClient } from "@tanstack/react-query";
import AddTaskForm from "../AddTaskForm";
import AddReportForm from "../AddReportForm";
import AddTechForm from "../AddTechForm";
import { Tabs, Tab } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import UserRole from "../../enums/UserRoles";
import TicketData from "./TicketData";
import TicketTasksTab from "./TicketTasksTab";
import TicketReportsTab from "./TicketReportsTab";
import TicketTechsTab from "./TicketTechsTab";

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
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const [addReportOpen, setAddReportOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [addTechOpen, setAddTechOpen] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState<any | null>(null);
  const [confirmTechDeleteOpen, setConfirmTechDeleteOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [confirmReportDeleteOpen, setConfirmReportDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const user_id = useAuth().id;
  const canDelete = role === UserRole.supervisor;
  const canManageTech =
    canDelete || role === UserRole.administrator || role === UserRole.engineer;
  const canManageTasks =
    role === UserRole.administrator ||
    role === UserRole.supervisor ||
    role === UserRole.engineer ||
    (role === UserRole.technician &&
      (currentTicket?.owner_id === user_id ||
        currentTicket?.handlers?.some((tech: any) => tech.id === user_id)));

  useEffect(() => {
    setCurrentTicket(ticket);
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
      const res = await api.post(`/reports/ticket/${ticket.id}`);
      setReports(res.data);
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
      fetchReports();
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
      await fetchReports();
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

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setEditTaskOpen(true);
  };

  const handleDeleteTaskConfirm = (task: any) => {
    setSelectedTask(task);
    setConfirmTaskDeleteOpen(true);
  };

  const handleDeleteReportConfirm = (report: any) => {
    setSelectedReport(report);
    setConfirmReportDeleteOpen(true);
  };

  const handleDeleteTechConfirm = (tech: any) => {
    setSelectedTech(tech);
    setConfirmTechDeleteOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Ticket Details
          {canDelete && (
            <IconButton
              sx={{ float: "right", ml: 1 }}
              onClick={() => setConfirmTicketDeleteOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <IconButton
            sx={{ float: "right" }}
            onClick={() => setEditTicketOpen(true)}
          >
            <EditIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TicketData ticket={ticket} />
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
            <TicketTasksTab
              tasks={tasks}
              canManageTasks={canManageTasks}
              canDelete={canDelete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTaskConfirm}
            />
          )}
          {tabIndex === 1 && (
            <TicketReportsTab
              reports={reports}
              canDelete={canDelete}
              onDeleteReport={handleDeleteReportConfirm}
            />
          )}
          {tabIndex === 2 && (
            <TicketTechsTab
              handlers={currentTicket.handlers}
              canManageTech={canManageTech}
              onDeleteTech={handleDeleteTechConfirm}
            />
          )}
        </DialogContent>
        <DialogActions>
          {tabIndex === 0 && canManageTasks && (
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
            <>
              {canManageTech && (
                <Button
                  onClick={() => setAddTechOpen(true)}
                  variant="contained"
                >
                  Add Tech
                </Button>
              )}
            </>
          )}
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Delete Ticket - Only render for authorized users */}
      {canDelete && (
        <Confirm
          open={confirmTicketDeleteOpen}
          message={`Are you sure you want to delete ticket "${ticket.title}"?`}
          onConfirm={handleDeleteTicket}
          onCancel={() => setConfirmTicketDeleteOpen(false)}
        />
      )}
      {addTaskOpen && (
        <AddTaskForm
          open={addTaskOpen}
          onClose={() => setAddTaskOpen(false)}
          onTaskCreated={fetchTasks}
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
              setCurrentTicket(updatedTicket);
              queryClient.invalidateQueries(["tickets"]);
              fetchTasks();
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
          onSuccess={fetchTasks}
        />
      )}
      {addReportOpen && (
        <AddReportForm
          open={addReportOpen}
          onClose={() => setAddReportOpen(false)}
          ticketId={ticket.id}
          onReportCreated={() => {
            fetchReports();
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
      {/* Confirm Delete Task - Only render for authorized users */}
      {canDelete && (
        <Confirm
          open={confirmTaskDeleteOpen}
          message={`Are you sure you want to delete task "${selectedTask?.title || "this task"}"?`}
          onConfirm={handleDeleteTask}
          onCancel={() => {
            setConfirmTaskDeleteOpen(false);
            setSelectedTask(null);
          }}
        />
      )}
      {/* Confirm Delete Tech - Only render for authorized users */}
      {canDelete && (
        <Confirm
          open={confirmTechDeleteOpen}
          message={`Are you sure you want to remove technician "${selectedTech?.username || "this technician"}" from the ticket?`}
          onConfirm={handleDeleteTech}
          onCancel={() => {
            setConfirmTechDeleteOpen(false);
            setSelectedTech(null);
          }}
        />
      )}
      {/* Confirm Delete Report - Only render for authorized users */}
      {canDelete && (
        <Confirm
          open={confirmReportDeleteOpen}
          message={`Are you sure you want to delete report ID "${selectedReport?.id}"?`}
          onConfirm={handleDeleteReport}
          onCancel={() => {
            setConfirmReportDeleteOpen(false);
            setSelectedReport(null);
          }}
        />
      )}
    </>
  );
}
