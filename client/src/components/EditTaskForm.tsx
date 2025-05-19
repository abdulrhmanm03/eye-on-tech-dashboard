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
import dayjs, { Dayjs } from "dayjs";

// Status options (match your TaskStatus enum)
const statuses = ["Pending", "In Progress", "Completed"];

type Props = {
  open: boolean;
  onClose: () => void;
  task: any;
  onSave: (updatedTask: any) => void;
};

export default function EditTaskForm({ open, onClose, task, onSave }: Props) {
  const [formData, setFormData] = useState({
    object_type: task.object_type || "",
    object_id: task.object_id || 0,
    description: task.description || "",
    creation_date: dayjs(task.creation_date),
    status: task.status || "Pending",
    owner_id: task.owner_id,
    id: task.id,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        object_type: task.object_type || "",
        object_id: task.object_id || 0,
        description: task.description || "",
        creation_date: dayjs(task.creation_date),
        status: task.status || "Pending",
        owner_id: task.owner_id,
        id: task.id,
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setFormData({ ...formData, creation_date: newDate });
    }
  };

  const handleSubmit = () => {
    // Format data to match backend schema (ISO string date)
    const payload = {
      object_type: formData.object_type,
      object_id: Number(formData.object_id),
      description: formData.description,
      creation_date: formData.creation_date.format("YYYY-MM-DD"),
      status: formData.status,
      owner_id: formData.owner_id,
      id: formData.id,
    };
    onSave(payload);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        <TextField
          name="object_type"
          label="Object Type"
          value={formData.object_type}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="object_id"
          label="Object ID"
          type="number"
          value={formData.object_id}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          multiline
          minRows={2}
          variant="standard"
        />
        <TextField
          name="creation_date"
          label="Creation Date"
          type="date"
          value={formData.creation_date}
          onChange={handleChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
        />
        <TextField
          name="status"
          label="Status"
          select
          value={formData.status}
          onChange={handleChange}
          fullWidth
          variant="standard"
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
