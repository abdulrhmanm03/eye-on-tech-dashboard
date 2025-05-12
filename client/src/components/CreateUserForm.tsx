import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (username: string, password: string, role: string) => void;
}

const roles = ["Administrator", "Editor", "Viewer"];

const CreateUserForm: React.FC<CreateUserDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = () => {
    if (username && password && role) {
      onSubmit(username, password, role);
      setUsername("");
      setPassword("");
      setRole("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm" // options: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false
    >
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 5, mt: 2, p: 3 }}
      >
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
        >
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserForm;
