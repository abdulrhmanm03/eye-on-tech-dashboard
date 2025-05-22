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
import AssetStatus from "../enums/AssetStatus";
import api from "../axios_conf";
import { useQueryClient } from "@tanstack/react-query";

export default function EditAssetForm({ open, onClose, asset }: any) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    type: "",
    tag: "",
    model: "",
    serial_number: "",
    production_year: new Date().getFullYear(),
    chassis_number: "",
    plate_number: "",
    location: "",
    geolocation: "",
    note: "",
    status: "Operational",
    warranty_expiry: "",
    maintenance_expiry: "",
    last_service: "",
    next_service: "",
    owner_id: 0,
  });

  useEffect(() => {
    if (asset) {
      const today = new Date();
      const defaultLastService = asset.last_service
        ? new Date(asset.last_service)
        : today;

      const defaultNextService = asset.next_service
        ? new Date(asset.next_service)
        : new Date(defaultLastService.getTime());

      if (!asset.next_service) {
        defaultNextService.setMonth(defaultNextService.getMonth() + 3);
      }

      setFormData({
        type: asset.type || "",
        tag: asset.tag || "",
        model: asset.model || "",
        serial_number: asset.serial_number || "",
        production_year: asset.production_year || today.getFullYear(),
        chassis_number: asset.chassis_number || "",
        plate_number: asset.plate_number || "",
        location: asset.location || "",
        geolocation: asset.geolocation || "",
        note: asset.note || "",
        status: asset.status || "Operational",
        warranty_expiry: asset.warranty_expiry?.split("T")[0] || "",
        maintenance_expiry: asset.maintenance_expiry?.split("T")[0] || "",
        last_service: defaultLastService.toISOString().split("T")[0],
        next_service: defaultNextService.toISOString().split("T")[0],
        owner_id: asset.owner_id || 0,
      });
    }
  }, [asset]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "production_year" || name === "owner_id"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/assets/${asset.id}`, formData);
      queryClient.invalidateQueries(["assets"]);
      onClose();
    } catch (error) {
      console.error("Failed to update asset", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Asset</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        {Object.entries(formData).map(([key, value]) => {
          if (key === "status") {
            return (
              <TextField
                key={key}
                select
                name={key}
                label="Status"
                value={value}
                onChange={handleChange}
                fullWidth
                variant="standard"
              >
                {Object.values(AssetStatus).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            );
          }

          const isDate = [
            "warranty_expiry",
            "maintenance_expiry",
            "last_service",
            "next_service",
          ].includes(key);

          return (
            <TextField
              key={key}
              name={key}
              label={key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())}
              type={
                isDate ? "date" : typeof value === "number" ? "number" : "text"
              }
              value={value}
              onChange={handleChange}
              fullWidth
              variant="standard"
              InputLabelProps={isDate ? { shrink: true } : undefined}
            />
          );
        })}
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
