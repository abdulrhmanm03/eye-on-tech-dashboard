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
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}) {
  const [formData, setFormData] = useState({
    description: "",
    creation_date: new Date().toISOString().split("T")[0],
    status: "open",
    asset_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    formData.description.trim() !== "" &&
    formData.creation_date.trim() !== "" &&
    formData.status.trim() !== "" &&
    formData.asset_id.trim() !== "";

  const handleSubmit = async () => {
    if (!isFormValid) return;
    try {
      const payload = {
        ...formData,
        asset_id: Number(formData.asset_id),
        creation_date: new Date(formData.creation_date)
          .toISOString()
          .split("T")[0],
      };
      await api.post("/tickets/create", payload);
      onClose();
      onCreated?.();
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
          label="Asset ID"
          name="asset_id"
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          onChange={handleChange}
          margin="dense"
          required
        />
        <TextField
          fullWidth
          type="date"
          name="creation_date"
          value={formData.creation_date}
          onChange={handleChange}
          margin="dense"
          required
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
          required
        >
          {Object.values(TicketStatus).map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
