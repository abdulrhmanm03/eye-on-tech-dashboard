import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../axios_conf";
import ContactType from "../enums/PocType"; // Adjust the import path as needed

type Props = {
  open: boolean;
  poc: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditPocForm({ open, poc, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({ type: "", value: "" });
  const [errors, setErrors] = useState({ type: false, value: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (poc) {
      setFormData({ type: poc.type || "", value: poc.value || "" });
    }
  }, [poc]);

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

    setSaving(true);
    try {
      await api.put(`/pocs/${poc.id}`, {
        ...formData,
        user_id: poc.user_id,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to update PoC", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Point of Contact</DialogTitle>
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
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
