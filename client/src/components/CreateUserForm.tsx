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
import UserRole from "../enums/UserRoles";
import api from "../axios_conf";
import { useMutation } from "@tanstack/react-query";

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
}

const createUserRequest = async (credentials: {
  username: string;
  role: string;
}) => {
  const res = await api.post("/users", credentials);
  return res.data;
};

const CreateUserForm: React.FC<CreateUserDialogProps> = ({ open, onClose }) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const Mutation = useMutation({
    mutationFn: createUserRequest,
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });

  const handleCreateUser = (username: string, role: string) => {
    Mutation.mutate({ username, role });
  };

  const handleSubmit = () => {
    if (username && role) {
      handleCreateUser(username, role);
      setUsername("");
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
          variant="standard"
        />
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          variant="standard"
        >
          {Object.values(UserRole).map((r) => (
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
