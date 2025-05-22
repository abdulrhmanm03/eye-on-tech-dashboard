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
    object_type: "",
    object_id: 0,
    description: "",
    creation_date: new Date().toISOString().split("T")[0],
    status: "In Progress" as TaskStatus,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "object_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const taskPayload = {
      ticket_id: ticketId,
      ...formData,
    };

    try {
      await api.post("/tasks/create/", taskPayload);
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
      object_type: "",
      object_id: 0,
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
            name="object_type"
            label="Object Type"
            fullWidth
            value={formData.object_type}
            onChange={handleChange}
          />
          <TextField
            name="object_id"
            label="Object ID"
            type="number"
            fullWidth
            value={formData.object_id}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            multiline
            minRows={2}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            name="creation_date"
            label="Creation Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.creation_date}
            onChange={handleChange}
          />
          <TextField
            name="status"
            label="Status"
            select
            fullWidth
            value={formData.status}
            onChange={handleChange}
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
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Save
        </Button>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
