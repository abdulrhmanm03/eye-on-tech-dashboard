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
import AssetStatus from "../enums/AssetStatus";
import api from "../axios_conf"; // Make sure to import this

export default function AddComponentForm({
  open,
  onClose,
  onSave,
  parentAssetId,
}: any) {
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    serial_number: "",
    production_year: new Date().getFullYear(),
    status: "Working" as AssetStatus,
    last_service: new Date().toISOString().split("T")[0],
    next_service: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "production_year" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      parent_asset_id: parentAssetId,
    };
    try {
      await api.post(`/components/create`, payload);
      onSave(); // Inform parent to refresh
      onClose(); // Close dialog
      // Reset form
      setFormData({
        type: "",
        model: "",
        serial_number: "",
        production_year: new Date().getFullYear(),
        status: AssetStatus.working,
        last_service: new Date().toISOString().split("T")[0],
        next_service: new Date().toISOString().split("T")[0],
      });
    } catch (err) {
      console.error("Failed to add component", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Component</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            name="type"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={handleChange}
          />
          <TextField
            name="model"
            label="Model"
            fullWidth
            value={formData.model}
            onChange={handleChange}
          />
          <TextField
            name="serial_number"
            label="Serial Number"
            fullWidth
            value={formData.serial_number}
            onChange={handleChange}
          />
          <TextField
            name="production_year"
            label="Production Year"
            type="number"
            fullWidth
            value={formData.production_year}
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
            {Object.values(AssetStatus).map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="last_service"
            label="Last Service"
            type="date"
            fullWidth
            value={formData.last_service}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="next_service"
            label="Next Service"
            type="date"
            fullWidth
            value={formData.next_service}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
