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

const roles = ["Client", "Supervisor", "Administrator"];

export default function EditUserForm({ open, onClose, user, onSave }: any) {
  const [formData, setFormData] = useState({
    id: user.id,
    username: user.username,
    password: "1234",
    role: "Client",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username || "",
        password: user.password || "",
        role: user.role || "Client",
      });
    }
  }, [user]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...formData });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // Make it same size as CreateUserForm
    >
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 2, p: 3 }}
      >
        <TextField
          name="username"
          label="Username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          variant="standard"
        />
        <TextField
          name="role"
          label="Role"
          select
          value={formData.role}
          onChange={handleChange}
          fullWidth
          variant="standard"
        >
          {roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))}
        </TextField>
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
