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
import api from "../axios_conf";

interface AddComponentFormProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  parentAssetId: number;
}

export default function AddComponentForm({
  open,
  onClose,
  onSave,
  parentAssetId,
}: AddComponentFormProps) {
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    serial_number: "",
    production_year: new Date().getFullYear(),
    status: AssetStatus.working,
    last_service: new Date().toISOString().split("T")[0],
    next_service: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({
    type: false,
    model: false,
    serial_number: false,
    production_year: false,
    last_service: false,
    next_service: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "production_year" ? Number(value) : value,
    }));

    // Reset the error when user types
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const validateForm = () => {
    const newErrors = {
      type: formData.type.trim() === "",
      model: formData.model.trim() === "",
      serial_number: formData.serial_number.trim() === "",
      production_year: !formData.production_year,
      last_service: formData.last_service.trim() === "",
      next_service: formData.next_service.trim() === "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      ...formData,
      parent_asset_id: parentAssetId,
    };
    try {
      await api.post("/components/create", payload);
      onSave();
      onClose();
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
            required
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
            helperText={errors.type && "Type is required"}
          />
          <TextField
            name="model"
            label="Model"
            fullWidth
            required
            value={formData.model}
            onChange={handleChange}
            error={errors.model}
            helperText={errors.model && "Model is required"}
          />
          <TextField
            name="serial_number"
            label="Serial Number"
            fullWidth
            required
            value={formData.serial_number}
            onChange={handleChange}
            error={errors.serial_number}
            helperText={errors.serial_number && "Serial number is required"}
          />
          <TextField
            name="production_year"
            label="Production Year"
            type="number"
            fullWidth
            required
            value={formData.production_year}
            onChange={handleChange}
            error={errors.production_year}
            helperText={errors.production_year && "Production year is required"}
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
            required
            value={formData.last_service}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={errors.last_service}
            helperText={errors.last_service && "Last service date is required"}
          />
          <TextField
            name="next_service"
            label="Next Service"
            type="date"
            fullWidth
            required
            value={formData.next_service}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={errors.next_service}
            helperText={errors.next_service && "Next service date is required"}
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
