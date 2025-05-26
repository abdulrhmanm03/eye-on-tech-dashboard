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
import TicketStatus from "../enums/TicketStatus";
import api from "../axios_conf";

export default function EditTicketForm({ open, onClose, ticket }: any) {
  const [formData, setFormData] = useState({
    object_type: "",
    object_id: 0,
    description: "",
    creation_date: "",
    status: "Open",
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        object_type: ticket.object_type || "",
        object_id: ticket.object_id || 0,
        description: ticket.description || "",
        creation_date: ticket.creation_date?.split("T")[0] || "",
        status: ticket.status || "Open",
      });
    }
  }, [ticket]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "object_id" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.put(`/tickets/${ticket.id}`, formData);
      onClose(res.data); // Return updated ticket
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} fullWidth maxWidth="sm">
      <DialogTitle>Edit Ticket</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 2, p: 3 }}
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
          variant="standard"
        />
        <TextField
          name="creation_date"
          label="Creation Date"
          type="date"
          value={formData.creation_date}
          onChange={handleChange}
          fullWidth
          variant="standard"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => onClose(null)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
