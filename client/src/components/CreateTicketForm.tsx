import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import api from "../axios_conf";
import TicketStatus from "../enums/TicketStatus";

export default function CreateTicketForm({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    object_type: "",
    object_id: "",
    description: "",
    creation_date: "",
    status: "open",
    handler_ids: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        object_id: Number(formData.object_id),
        handler_ids: formData.handler_ids
          .split(",")
          .map((id) => Number(id.trim())),
        creation_date: new Date(formData.creation_date)
          .toISOString()
          .split("T")[0], // Ensure it's just the date
      };
      await api.post("/tickets/create", payload);
      onClose();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Ticket</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Object Type"
          name="object_type"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Object ID"
          name="object_id"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          type="date"
          name="creation_date"
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          select
          label="Status"
          name="status"
          onChange={handleChange}
          margin="dense"
          fullWidth
          variant="standard"
        >
          {Object.values(TicketStatus).map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Handler IDs (comma-separated)"
          name="handler_ids"
          onChange={handleChange}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
