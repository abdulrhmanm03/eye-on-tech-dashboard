import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../axios_conf";
import UserRole from "../enums/UserRoles";

type User = {
  id: number;
  username: string;
  email?: string;
  full_name?: string;
  role?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  assetId: number;
  onSuccess?: () => void;
};

export default function AddUserToAssetForm({
  open,
  onClose,
  assetId,
  onSuccess,
}: Props) {
  const [options, setOptions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get<User[]>("/users");
      const filtered = res.data.filter(
        (user) =>
          user.role !== UserRole.administrator &&
          user.role !== UserRole.supervisor,
      );
      setOptions(filtered);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchAllUsers();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!selectedUser) return;
    try {
      await api.post(`/assets/${assetId}/grant-access`, {
        user_id: selectedUser.id,
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error("Failed to grant access to user", err);
    }
  };

  const handleClose = () => {
    setSelectedUser(null);
    onClose();
  };

  const getOptionLabel = (option: User) => {
    const parts = [];
    parts.push(option.username);
    parts.push(`- ${option.role}`);
    return parts.join(" ");
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Add User to Asset</DialogTitle>
      <DialogContent>
        <Autocomplete
          fullWidth
          options={options}
          getOptionLabel={getOptionLabel}
          loading={loading}
          value={selectedUser}
          onChange={(_, value) => setSelectedUser(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select User"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          noOptionsText={loading ? "Loading users..." : "No users available"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedUser}
          variant="contained"
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
