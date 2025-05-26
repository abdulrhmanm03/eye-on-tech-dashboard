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
  onCreated?: () => void;
}

const createUserRequest = async (credentials: {
  username: string;
  role: string;
}) => {
  const res = await api.post("/users", credentials);
  return res.data;
};

const CreateUserForm: React.FC<CreateUserDialogProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");

  const Mutation = useMutation({
    mutationFn: createUserRequest,
    onSuccess: () => {
      onCreated?.();
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });

  const handleCreateUser = () => {
    Mutation.mutate({ username, role });
    setUsername("");
    setRole("");
    onClose();
  };

  const isFormValid = username.trim() !== "" && role !== "";

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
          required
        />
        <TextField
          select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          variant="standard"
          required
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
        <Button
          onClick={handleCreateUser}
          variant="contained"
          disabled={!isFormValid}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserForm;
