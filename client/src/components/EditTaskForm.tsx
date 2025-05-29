import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import api from "../axios_conf";
import TaskStatus from "../enums/TaskStatus";

type Props = {
  open: boolean;
  onClose: () => void;
  task: any;
  onSuccess?: () => void; // optional refetch callback
};

export default function EditTaskForm({
  open,
  onClose,
  task,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    description: "",
    creation_date: dayjs(),
    status: TaskStatus.in_progress as TaskStatus,
    ticket_id: 0,
    id: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description || "",
        creation_date: dayjs(task.creation_date),
        status: task.status || TaskStatus.in_progress,
        ticket_id: task.ticket_id || 0,
        id: task.id,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation function to check if form is complete
  const isFormValid = () => {
    return (
      formData.description.trim() !== "" &&
      formData.creation_date.isValid() &&
      formData.status &&
      formData.id !== null
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return; // Don't submit if form is invalid
    }

    setLoading(true);
    const payload = {
      description: formData.description.trim(),
      creation_date: formData.creation_date.format("YYYY-MM-DD"),
      status: formData.status,
      ticket_id: formData.ticket_id,
    };

    try {
      await api.put(`/tasks/${formData.id}`, payload);
      onSuccess?.(); // trigger refetch if needed
      onClose();
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          variant="standard"
          required
          error={formData.description.trim() === ""}
          helperText={
            formData.description.trim() === "" ? "Description is required" : ""
          }
        />
        <TextField
          name="creation_date"
          label="Creation Date"
          type="date"
          value={formData.creation_date.format("YYYY-MM-DD")}
          onChange={(e) =>
            setFormData({ ...formData, creation_date: dayjs(e.target.value) })
          }
          fullWidth
          InputLabelProps={{ shrink: true }}
          variant="standard"
          required
        />
        <TextField
          name="status"
          label="Status"
          select
          value={formData.status}
          onChange={handleChange}
          fullWidth
          variant="standard"
          required
        >
          {Object.values(TaskStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="ticket_id"
          label="Ticket ID"
          type="number"
          value={formData.ticket_id}
          onChange={handleChange}
          fullWidth
          variant="standard"
          disabled
          helperText="Ticket ID cannot be changed"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !isFormValid()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
