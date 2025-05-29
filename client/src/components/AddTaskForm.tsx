import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import api from "../axios_conf";
import TaskStatus from "../enums/TaskStatus";

type Props = {
  open: boolean;
  onClose: () => void;
  onTaskCreated?: () => void; // callback to refresh task list
  ticketId: number;
};

export default function AddTaskForm({
  open,
  onClose,
  onTaskCreated,
  ticketId,
}: Props) {
  const [formData, setFormData] = useState({
    description: "",
    creation_date: new Date().toISOString().split("T")[0],
    status: TaskStatus.in_progress as TaskStatus,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation function to check if form is complete
  const isFormValid = () => {
    return (
      formData.description.trim() !== "" &&
      formData.creation_date !== "" &&
      formData.status
    );
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      return; // Don't submit if form is invalid
    }

    setLoading(true);
    const taskPayload = {
      ticket_id: ticketId,
      description: formData.description.trim(),
      creation_date: formData.creation_date,
      status: formData.status,
    };

    try {
      await api.post("/tasks/create", taskPayload); // Removed trailing slash to match your router
      onTaskCreated?.(); // trigger callback to refetch tasks
      handleClose(); // close and reset
    } catch (err) {
      console.error("Failed to add task", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      description: "",
      creation_date: new Date().toISOString().split("T")[0],
      status: TaskStatus.in_progress,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            minRows={2}
            value={formData.description}
            onChange={handleChange}
            required
            error={formData.description.trim() === ""}
            helperText={
              formData.description.trim() === ""
                ? "Description is required"
                : ""
            }
          />
          <TextField
            name="creation_date"
            label="Creation Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.creation_date}
            onChange={handleChange}
            required
          />
          <TextField
            name="status"
            label="Status"
            select
            fullWidth
            value={formData.status}
            onChange={handleChange}
            required
          >
            {Object.values(TaskStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !isFormValid()}
        >
          Save
        </Button>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
