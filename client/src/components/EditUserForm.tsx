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
import { useQueryClient } from "@tanstack/react-query";
import api from "../axios_conf";
import UserRole from "../enums/UserRoles";

export default function EditUserForm({ open, onClose, user }: any) {
  const [formData, setFormData] = useState({
    id: user.id,
    username: user.username,
    role: "Client",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username || "",
        role: user.role || "Client",
      });
    }
  }, [user]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.put("/users", formData);
      queryClient.invalidateQueries(["users"]);
      onClose();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          name="role"
          label="Role"
          select
          value={formData.role}
          onChange={handleChange}
          fullWidth
          variant="standard"
        >
          {Object.values(UserRole).map((role) => (
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
