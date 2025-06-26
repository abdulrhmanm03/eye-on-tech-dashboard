import {
  Box,
  TextField,
  MenuItem,
  Autocomplete,
  Button,
  Popover,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { ViewColumn, Refresh } from "@mui/icons-material";

type Props = {
  keys: string[];
  searchCol: string;
  setSearchCol: (col: string) => void;
  query: string;
  setQuery: (val: string) => void;
  suggestions: string[];
  columnVisibility: Record<string, boolean>;
  toggleColumnVisibility: (key: string) => void;
  resetColumnVisibility: () => void;
  columnMenuAnchorEl: HTMLButtonElement | null;
  handleColumnMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleColumnMenuClose: () => void;
};

export default function ToolBar({
  keys,
  searchCol,
  setSearchCol,
  query,
  setQuery,
  suggestions,
  columnVisibility,
  toggleColumnVisibility,
  resetColumnVisibility,
  columnMenuAnchorEl,
  handleColumnMenuOpen,
  handleColumnMenuClose,
}: Props) {
  const columnMenuOpen = Boolean(columnMenuAnchorEl);

  return (
    <Box display="flex" gap={2} mb={2} px={2} alignItems="center">
      <TextField
        select
        label="Column"
        size="small"
        value={searchCol}
        onChange={(e) => {
          setSearchCol(e.target.value);
          setQuery("");
        }}
        sx={{ minWidth: 150 }}
      >
        {keys.map((k) => (
          <MenuItem key={k} value={k}>
            {k.toUpperCase()}
          </MenuItem>
        ))}
      </TextField>
      <Autocomplete
        freeSolo
        options={suggestions}
        inputValue={query}
        onInputChange={(_, value) => setQuery(value)}
        disabled={!searchCol}
        size="small"
        sx={{ minWidth: 200 }}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      <Button
        variant="outlined"
        size="small"
        startIcon={<ViewColumn />}
        onClick={handleColumnMenuOpen}
      >
        Columns
      </Button>
      <Popover
        open={columnMenuOpen}
        anchorEl={columnMenuAnchorEl}
        onClose={handleColumnMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Show/Hide Columns
          </Typography>
          <FormGroup>
            {keys.map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={columnVisibility[key] !== false}
                    onChange={() => toggleColumnVisibility(key)}
                    size="small"
                  />
                }
                label={key.toUpperCase()}
              />
            ))}
          </FormGroup>
          <Divider sx={{ my: 1 }} />
          <Button
            fullWidth
            size="small"
            variant="text"
            startIcon={<Refresh />}
            onClick={resetColumnVisibility}
          >
            Reset All
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}
