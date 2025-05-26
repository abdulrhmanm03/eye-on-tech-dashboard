import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Box,
  Autocomplete,
  IconButton,
  Button,
  Popover,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import {
  ArrowDownward,
  ArrowUpward,
  ViewColumn,
  Refresh,
} from "@mui/icons-material";
import api from "../axios_conf";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import UserDetails from "./UserDetails";
import TicketDetails from "./TicketDetails";
import AssetDetails from "./AssetDetails";

type Props = { view: string };

const fetchData = async (endpoint: string) =>
  (await api.get(`/${endpoint.toLowerCase()}/`)).data;

export default function DataTable({ view }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [searchCol, setSearchCol] = useState(""),
    [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState(""),
    [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});
  const [columnMenuAnchorEl, setColumnMenuAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [view.toLowerCase()],
    queryFn: () => fetchData(view),
  });

  const keys =
    Array.isArray(data) && data.length
      ? Object.keys(data[0]).filter((k) => k !== "handlers")
      : [];

  // Initialize column visibility when keys are available
  const initializedColumnVisibility = useMemo(() => {
    if (keys.length === 0) return {};

    const hasInitialized = keys.some((key) => key in columnVisibility);
    if (!hasInitialized) {
      const initialVisibility: Record<string, boolean> = {};
      keys.forEach((key) => {
        initialVisibility[key] = true;
      });
      return initialVisibility;
    }
    return columnVisibility;
  }, [keys, columnVisibility]);

  // Update column visibility state when it changes
  if (
    JSON.stringify(initializedColumnVisibility) !==
    JSON.stringify(columnVisibility)
  ) {
    setColumnVisibility(initializedColumnVisibility);
  }

  // Reset column visibility when view changes
  useEffect(() => {
    if (keys.length > 0) {
      const allVisible: Record<string, boolean> = {};
      keys.forEach((key) => {
        allVisible[key] = true;
      });
      setColumnVisibility(allVisible);
    }
  }, [view, keys.join(",")]);

  const visibleKeys = keys.filter((key) => columnVisibility[key] !== false);

  const suggestions = useMemo(() => {
    if (!searchCol || !Array.isArray(data)) return [];
    const freqMap: Record<string, number> = {};
    data.forEach((row: any) => {
      const val = String(row[searchCol]);
      freqMap[val] = (freqMap[val] || 0) + 1;
    });
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .map(([val]) => val);
  }, [searchCol, data]);

  const filtered = useMemo(() => {
    let rows = Array.isArray(data) ? [...data] : [];
    if (searchCol && query) {
      rows = rows.filter((row) =>
        String(row[searchCol]).toLowerCase().includes(query.toLowerCase()),
      );
    }
    if (sortBy) {
      rows.sort((a, b) => {
        const aVal = String(a[sortBy]);
        const bVal = String(b[sortBy]);
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal, undefined, { numeric: true })
          : bVal.localeCompare(aVal, undefined, { numeric: true });
      });
    }
    return rows;
  }, [data, searchCol, query, sortBy, sortOrder]);

  const handleClick = (row: any) => {
    setSelectedId(row.id);
    setSelectedRow(row);
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedRow(null);
  };

  const toggleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleColumnMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setColumnMenuAnchorEl(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchorEl(null);
  };

  const toggleColumnVisibility = (key: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetColumnVisibility = () => {
    const allVisible: Record<string, boolean> = {};
    keys.forEach((key) => {
      allVisible[key] = true;
    });
    setColumnVisibility(allVisible);
  };

  const columnMenuOpen = Boolean(columnMenuAnchorEl);

  return (
    <>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && (
        <Typography color="error">Failed to fetch {view}.</Typography>
      )}
      {!isLoading && data && (
        <>
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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  {visibleKeys.map((k) => (
                    <TableCell key={k} sx={{ fontWeight: 600 }}>
                      <Box display="flex" alignItems="center">
                        {k.toUpperCase()}
                        <IconButton size="small" onClick={() => toggleSort(k)}>
                          {sortBy === k ? (
                            sortOrder === "asc" ? (
                              <ArrowUpward fontSize="small" />
                            ) : (
                              <ArrowDownward fontSize="small" />
                            )
                          ) : (
                            <ArrowDownward
                              sx={{ opacity: 0.3 }}
                              fontSize="small"
                            />
                          )}
                        </IconButton>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row: any) => (
                  <TableRow
                    key={row.id}
                    hover
                    selected={selectedId === row.id}
                    onClick={() => handleClick(row)}
                    sx={{ cursor: "pointer" }}
                  >
                    {visibleKeys.map((k) => (
                      <TableCell key={k}>{String(row[k])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      {selectedRow && view.toLowerCase() === "users" && (
        <UserDetails
          open={detailsOpen}
          user={selectedRow}
          onClose={closeDetails}
        />
      )}
      {selectedRow && view.toLowerCase() === "tickets" && (
        <TicketDetails
          open={detailsOpen}
          ticket={selectedRow}
          onClose={closeDetails}
        />
      )}
      {selectedRow && view.toLowerCase() === "assets" && (
        <AssetDetails
          open={detailsOpen}
          asset={selectedRow}
          onClose={closeDetails}
        />
      )}
    </>
  );
}
