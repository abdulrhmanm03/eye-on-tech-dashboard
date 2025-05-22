import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import AssetStatus from "../enums/AssetStatus";
import api from "../axios_conf";
import { useMutation } from "@tanstack/react-query";

export interface AssetFormData {
  type: string;
  tag: string;
  model: string;
  serial_number: string;
  production_year: number;
  chassis_number?: string;
  plate_number?: string;
  location: string;
  geolocation: string;
  note?: string;
  status: AssetStatus;
  warranty_expiry: string;
  maintenance_expiry: string;
  last_service: string;
  next_service: string;
  owner_id: number;
}

interface CreateAssetFormProps {
  open: boolean;
  onClose: () => void;
}

const CreateAssetForm: React.FC<CreateAssetFormProps> = ({ open, onClose }) => {
  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  const [form, setForm] = useState<AssetFormData>({
    type: "",
    tag: "",
    model: "",
    serial_number: "",
    production_year: today.getFullYear(),
    chassis_number: "",
    plate_number: "",
    location: "",
    geolocation: "",
    note: "",
    status: AssetStatus.working,
    warranty_expiry: "",
    maintenance_expiry: "",
    last_service: today.toISOString().split("T")[0], // ✅ today's date
    next_service: threeMonthsLater.toISOString().split("T")[0], // ✅ +3 months
    owner_id: 1,
  });

  const createAssetRequest = async (data: AssetFormData) => {
    const res = await api.post("/assets/create", data);
    return res.data;
  };

  const { mutate: createAsset, isError } = useMutation({
    mutationFn: createAssetRequest,
    onSuccess: () => {
      onClose(); // Close dialog on success
    },
    onError: (err) => {
      console.error("Failed to create asset:", err);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    createAsset(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create New Asset</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        {isError && (
          <Alert severity="error">Failed to create asset. Try again.</Alert>
        )}
        <TextField
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
        />
        <TextField
          label="Tag"
          name="tag"
          value={form.tag}
          onChange={handleChange}
        />
        <TextField
          label="Model"
          name="model"
          value={form.model}
          onChange={handleChange}
        />
        <TextField
          label="Serial Number"
          name="serial_number"
          value={form.serial_number}
          onChange={handleChange}
        />
        <TextField
          label="Production Year"
          name="production_year"
          type="number"
          value={form.production_year}
          onChange={handleChange}
        />
        <TextField
          label="Chassis Number"
          name="chassis_number"
          value={form.chassis_number}
          onChange={handleChange}
        />
        <TextField
          label="Plate Number"
          name="plate_number"
          value={form.plate_number}
          onChange={handleChange}
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <TextField
          label="Geolocation"
          name="geolocation"
          value={form.geolocation}
          onChange={handleChange}
        />
        <TextField
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
        />
        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          {Object.values(AssetStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Warranty Expiry"
          name="warranty_expiry"
          type="date"
          value={form.warranty_expiry}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Maintenance Expiry"
          name="maintenance_expiry"
          type="date"
          value={form.maintenance_expiry}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Last Service"
          name="last_service"
          type="date"
          value={form.last_service}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Next Service"
          name="next_service"
          type="date"
          value={form.next_service}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Owner ID"
          name="owner_id"
          type="number"
          value={form.owner_id}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          <CircularProgress size={24} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAssetForm;
