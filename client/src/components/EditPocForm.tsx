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

type Props = {
  open: boolean;
  poc: any;
  onClose: () => void;
  onSave: (updatedPoc: any) => void;
};

export default function EditPocForm({ open, poc, onClose, onSave }: Props) {
  const [form, setForm] = useState(poc);

  useEffect(() => {
    setForm(poc);
  }, [poc]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
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
        <Button onClick={handleSubmit} variant="contained">
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
