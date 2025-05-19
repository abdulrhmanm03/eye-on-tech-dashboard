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

type AssetStatus = "Working" | "Faulty" | "Partially Working" | "RMA";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (component: any) => void;
  parentAssetId: number;
};

const statusOptions: AssetStatus[] = [
  "Working",
  "Faulty",
  "Partially Working",
  "RMA",
];

export default function AddComponentForm({
  open,
  onClose,
  onSave,
  parentAssetId,
}: Props) {
  const [formData, setFormData] = useState({
    type: "",
    model: "",
    serial_number: "",
    production_year: new Date().getFullYear(),
    status: "Active" as AssetStatus,
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

  const handleSubmit = () => {
    const payload = {
      ...formData,
      parent_asset_id: parentAssetId,
    };
    onSave(payload);
    onClose();
    setFormData({
      type: "",
      model: "",
      serial_number: "",
      production_year: new Date().getFullYear(),
      status: "Active",
      last_service: new Date().toISOString().split("T")[0],
      next_service: new Date().toISOString().split("T")[0],
    });
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
