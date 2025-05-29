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
import api from "../axios_conf";
import ContactType from "../enums/PocType"; // Adjust path as needed

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (poc: any) => void;
  userId: number;
};

export default function AddPocForm({ open, onClose, onSave, userId }: Props) {
  const [formData, setFormData] = useState({
    type: "",
    value: "",
  });

  const [errors, setErrors] = useState({
    type: false,
    value: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const handleSubmit = async () => {
    const hasErrors = !formData.type || !formData.value;
    setErrors({
      type: !formData.type,
      value: !formData.value,
    });

    if (hasErrors) return;

    const pocPayload = {
      ...formData,
      user_id: userId,
    };

    try {
      const response = await api.post("/pocs/create/", pocPayload);
      onSave(response.data);
      onClose();
      setFormData({ type: "", value: "" });
    } catch (err) {
      console.error("Failed to add PoC", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Point of Contact</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            select
            name="type"
            label="Type"
            fullWidth
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
            helperText={errors.type ? "Type is required" : ""}
          >
            {Object.entries(ContactType).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name="value"
            label="Value"
            fullWidth
            value={formData.value}
            onChange={handleChange}
            error={errors.value}
            helperText={errors.value ? "Value is required" : ""}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
