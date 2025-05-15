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

const statuses = ["Open", "InProgress", "Closed"];

export default function EditTicketForm({ open, onClose, ticket, onSave }: any) {
  const [formData, setFormData] = useState({
    object_type: "",
    object_id: 0,
    description: "",
    creation_date: "",
    status: "Open",
    owner_id: 0,
    handler_ids: [],
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        object_type: ticket.object_type || "",
        object_id: ticket.object_id || 0,
        description: ticket.description || "",
        creation_date: ticket.creation_date?.split("T")[0] || "",
        status: ticket.status || "Open",
        owner_id: ticket.owner_id || 0,
        handler_ids: ticket.handler_ids || [],
      });
    }
  }, [ticket]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "object_id" || name === "owner_id" ? parseInt(value) : value,
    });
  };

  const handleSubmit = () => {
    onSave(formData, ticket.id); // include ticket ID for the PUT request
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        <TextField
          name="owner_id"
          label="Owner ID"
          type="number"
          value={formData.owner_id}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        {/* Add support for handler_ids as needed - e.g. multi-select */}
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
