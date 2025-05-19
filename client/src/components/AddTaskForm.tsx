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

type TaskStatus = "In Progress" | "Completed";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  ownerId: number;
};

export default function AddTaskForm({ open, onClose, onSave, ownerId }: Props) {
  const [formData, setFormData] = useState({
    object_type: "",
    object_id: 0,
    description: "",
    creation_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    status: "In Progress" as TaskStatus,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "object_id" ? Number(value) : value,
    }));
  };

  const handleSubmit = () => {
    const taskPayload = {
      owner_id: ownerId,
      ...formData,
    };
    console.log(taskPayload);
    onSave(taskPayload);
    onClose();
    setFormData({
      object_type: "",
      object_id: 0,
      description: "",
      creation_date: new Date().toISOString().split("T")[0],
      status: "In Progress",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
