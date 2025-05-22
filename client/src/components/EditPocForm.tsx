import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../axios_conf";

type Props = {
  open: boolean;
  poc: any;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditPocForm({ open, poc, onClose, onSuccess }: Props) {
  const [form, setForm] = useState(poc);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(poc);
  }, [poc]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await api.put(`/pocs/${form.id}`, form);
      onSuccess(); // notify parent to refresh data
      onClose(); // close dialog
    } catch (err) {
      console.error("Failed to update PoC", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Point of Contact</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            name="organization"
            label="Organization"
            value={form.organization || ""}
            onChange={handleChange}
          />
          <TextField
            name="full_name"
            label="Full Name"
            value={form.full_name || ""}
            onChange={handleChange}
          />
          <TextField
            name="phone_number"
            label="Phone Number"
            value={form.phone_number || ""}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            value={form.email || ""}
            onChange={handleChange}
          />
        </Box>
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
