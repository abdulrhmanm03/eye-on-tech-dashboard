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
import api from "../axios_conf";

type Props = {
  open: boolean;
  onClose: () => void;
  onReportCreated?: () => void;
  ticketId: number;
};

export default function AddReportForm({
  open,
  onClose,
  onReportCreated,
  ticketId,
}: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post(`/reports/create/${ticketId}`, {
        content,
      });
      onReportCreated?.();
      handleClose();
    } catch (err) {
      console.error("Failed to create report", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setContent("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Report</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Report Content"
            multiline
            minRows={6}
            fullWidth
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Save
        </Button>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
