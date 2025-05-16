import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (poc: any) => void;
  userId: number;
};

export default function AddPocForm({ open, onClose, onSave, userId }: Props) {
  const [formData, setFormData] = useState({
    organization: "",
    full_name: "",
    phone_number: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const pocPayload = {
      ...formData,
      user_id: userId,
    };
    onSave(pocPayload);
    onClose();
    setFormData({
      organization: "",
      full_name: "",
      phone_number: "",
      email: "",
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Point of Contact</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            name="organization"
            label="Organization"
            fullWidth
            value={formData.organization}
            onChange={handleChange}
          />
          <TextField
            name="full_name"
            label="Full Name"
            fullWidth
            value={formData.full_name}
            onChange={handleChange}
          />
          <TextField
            name="phone_number"
            label="Phone Number"
            fullWidth
            value={formData.phone_number}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
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
