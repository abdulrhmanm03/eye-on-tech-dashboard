import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import api from "../axios_conf";
import { debounce } from "lodash";

type Tech = {
  id: number;
  username: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  ticketId: number;
  onSuccess?: () => void;
};

export default function AddTechForm({
  open,
  onClose,
  ticketId,
  onSuccess,
}: Props) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Tech[]>([]);
  const [selectedTech, setSelectedTech] = useState<Tech | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTechs = async (q: string) => {
    setLoading(true);
    try {
      const res = await api.get("/tickets/search-techs", {
        params: { query: q },
      });
      setOptions(res.data);
    } catch (err) {
      console.error("Failed to fetch techs", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchTechs, 300), []);

  useEffect(() => {
    if (query) {
      debouncedFetch(query);
    } else {
      setOptions([]);
    }
  }, [query]);

  const handleSubmit = async () => {
    if (!selectedTech) return;
    try {
      await api.post("/tickets/add-tech", null, {
        params: {
          ticket_id: ticketId,
          tech_id: selectedTech.id,
        },
      });
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error("Failed to add tech to ticket", err);
    }
  };

  const handleClose = () => {
    setQuery("");
    setOptions([]);
    setSelectedTech(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Technician</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Autocomplete
            options={options}
            getOptionLabel={(option) => `${option.username} (ID: ${option.id})`}
            loading={loading}
            value={selectedTech}
            onChange={(_, value) => setSelectedTech(value)}
            onInputChange={(_, value) => setQuery(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Technician"
                fullWidth
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
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!selectedTech}
        >
          Assign
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
