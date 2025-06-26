import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import api from "../../axios_conf";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo, useEffect } from "react";
import ToolBar from "./ToolBar";
import TableHeader from "./TableHeader";
import DetailsDialog from "./DetailsDialog";

type Props = { view: string };

const fetchData = async (endpoint: string) =>
  (await api.get(`/${endpoint.toLowerCase()}/`)).data;

export default function DataTable({ view }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [owners, setOwners] = useState<Record<number, string>>({});
  const [assets, setAssets] = useState<
    Record<number, { type?: string; model?: string }>
  >({});
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

  const fetchOwners = async (userId: number) => {
    if (owners[userId]) return owners[userId]; // already cached

    try {
      const response = await api.get(`/users/${userId}`);
      const username = response.data.username;
      setOwners((prev) => ({ ...prev, [userId]: username }));
      return username;
    } catch (error) {
      console.error("Failed to fetch user", userId);
      return `User ${userId}`;
    }
  };

  const fetchAsset = async (assetId: number) => {
    if (assets[assetId]) return assets[assetId]; // already cached

    try {
      const response = await api.get(`/assets/${assetId}`);
      const { type, model } = response.data;
      const assetData = { type, model };
      setAssets((prev) => ({ ...prev, [assetId]: assetData }));
      return assetData;
    } catch (error) {
      console.error("Failed to fetch asset", assetId);
      return null;
    }
  };

  useEffect(() => {
    if (!Array.isArray(data)) return;

    const ownerIds = new Set<number>();
    const assetIds = new Set<number>();

    data.forEach((row: any) => {
      if (row.owner_id && !owners[row.owner_id]) {
        ownerIds.add(row.owner_id);
      }
      if (row.asset_id && !assets[row.asset_id]) {
        assetIds.add(row.asset_id);
      }
    });

    ownerIds.forEach((id) => fetchOwners(id));
    assetIds.forEach((id) => fetchAsset(id));
  }, [data]);

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

  return (
    <>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && (
        <Typography color="error">Failed to fetch {view}.</Typography>
      )}
      {!isLoading && data && (
        <>
          <ToolBar
            keys={keys}
            searchCol={searchCol}
            setSearchCol={setSearchCol}
            query={query}
            setQuery={setQuery}
            suggestions={suggestions}
            columnVisibility={columnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            resetColumnVisibility={resetColumnVisibility}
            columnMenuAnchorEl={columnMenuAnchorEl}
            handleColumnMenuOpen={handleColumnMenuOpen}
            handleColumnMenuClose={handleColumnMenuClose}
          />
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 600, // Set height as needed
            }}
          >
            <Table stickyHeader sx={{ minWidth: 700 }}>
              <TableHeader
                visibleKeys={visibleKeys}
                sortBy={sortBy}
                sortOrder={sortOrder}
                toggleSort={toggleSort}
              />
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
                      <TableCell key={k}>
                        {k === "owner_id"
                          ? owners[row[k]] || row[k]
                          : k === "asset_id"
                            ? assets[row[k]]?.type ||
                              assets[row[k]]?.model ||
                              row[k]
                            : row[k] == null
                              ? ""
                              : typeof row[k] === "string" && row[k].length > 50
                                ? `${row[k].slice(0, 50)}...`
                                : String(row[k])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
      <DetailsDialog
        open={detailsOpen}
        view={view}
        row={selectedRow}
        onClose={closeDetails}
      />
    </>
  );
}
