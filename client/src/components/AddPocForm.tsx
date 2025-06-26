import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  MenuItem,
} from "@mui/material";
import { useState } from "react";
import api from "../axios_conf";
import ContactType from "../enums/PocType"; // Adjust path as needed

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (poc: any) => void;
  targetType: "user" | "asset";
  targetId: number;
  username?: string; // Only used when targetType is "user"
};

export default function AddPocForm({
  open,
  onClose,
  onSave,
  targetType,
  targetId,
  username = "",
}: Props) {
  const [formData, setFormData] = useState({
    type: "",
    value: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    type: false,
    value: false,
    username: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: !value }));
  };

  const handleSubmit = async () => {
    const isAsset = targetType === "asset";
    const hasErrors =
      !formData.type || !formData.value || (isAsset && !formData.username);

    setErrors({
      type: !formData.type,
      value: !formData.value,
      username: isAsset && !formData.username,
    });

    if (hasErrors) return;

    const pocPayload: any = {
      type: formData.type,
      value: formData.value,
      username: isAsset ? formData.username : username,
    };

    if (isAsset) {
      pocPayload.asset_id = targetId;
    } else {
      pocPayload.user_id = targetId;
    }

    const endpoint = isAsset ? "/pocs/asset/create/" : "/pocs/user/create/";

    try {
      const response = await api.post(endpoint, pocPayload);
      onSave(response.data);
    } catch (err) {
      console.error("Failed to add PoC", err);
      return;
    } finally {
      // Clean up regardless of success or failure
      setFormData({ type: "", value: "", username: "" });
      setErrors({ type: false, value: false, username: false });
      onClose(); // Make sure the dialog closes no matter what
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Point of Contact</DialogTitle>
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

          {targetType === "asset" && (
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              helperText={errors.username ? "Username is required" : ""}
            />
          )}
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
