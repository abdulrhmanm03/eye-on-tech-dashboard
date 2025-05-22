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
import dayjs from "dayjs";
import api from "../axios_conf";

type AssetStatus = "Working" | "Faulty" | "Partially Working" | "RMA";

type Props = {
  open: boolean;
  onClose: () => void;
  component: any;
  onSuccess: () => void; // replaces onSave
};

const statusOptions: AssetStatus[] = [
  "Working",
  "Faulty",
  "Partially Working",
  "RMA",
];

export default function EditComponentForm({
  open,
  onClose,
  component,
  onSuccess,
}: Props) {
  const [formData, setFormData] = useState({
    id: component.id,
    parent_asset_id: component.parent_asset_id,
    type: component.type || "",
    model: component.model || "",
    serial_number: component.serial_number || "",
    production_year: component.production_year || new Date().getFullYear(),
    status: component.status || "Working",
    last_service: dayjs(component.last_service),
    next_service: dayjs(component.next_service),
  });

  useEffect(() => {
    if (component) {
      setFormData({
        id: component.id,
        parent_asset_id: component.parent_asset_id,
        type: component.type,
        model: component.model,
        serial_number: component.serial_number,
        production_year: component.production_year,
        status: component.status,
        last_service: dayjs(component.last_service),
        next_service: dayjs(component.next_service),
      });
    }
  }, [component]);

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
      last_service: formData.last_service.format("YYYY-MM-DD"),
      next_service: formData.next_service.format("YYYY-MM-DD"),
    };

    try {
      await api.put(`/components/${formData.id}`, payload);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update component", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Component</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        <TextField
          name="type"
          label="Type"
          value={formData.type}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="model"
          label="Model"
          value={formData.model}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="serial_number"
          label="Serial Number"
          value={formData.serial_number}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="production_year"
          label="Production Year"
          type="number"
          value={formData.production_year}
          onChange={handleChange}
          fullWidth
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
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="last_service"
          label="Last Service"
          type="date"
          value={formData.last_service.format("YYYY-MM-DD")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              last_service: dayjs(e.target.value),
            }))
          }
          fullWidth
          InputLabelProps={{ shrink: true }}
          variant="standard"
        />
        <TextField
          name="next_service"
          label="Next Service"
          type="date"
          value={formData.next_service.format("YYYY-MM-DD")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              next_service: dayjs(e.target.value),
            }))
          }
          fullWidth
          InputLabelProps={{ shrink: true }}
          variant="standard"
        />
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
