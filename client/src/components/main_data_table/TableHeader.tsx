import { TableHead, TableRow, TableCell, IconButton, Box } from "@mui/material";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";

type TableHeaderProps = {
  visibleKeys: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  toggleSort: (key: string) => void;
};

export default function TableHeader({
  visibleKeys,
  sortBy,
  sortOrder,
  toggleSort,
}: TableHeaderProps) {
  const COLUMN_LABELS: Record<string, string> = {
    owner_id: "Owner",
    asset_id: "Asset",
  };

  return (
    <TableHead>
      <TableRow>
        {visibleKeys.map((key) => (
          <TableCell key={key} sx={{ fontWeight: 600 }}>
            <Box display="flex" alignItems="center">
              {COLUMN_LABELS[key] || key.toUpperCase()}
              <IconButton size="small" onClick={() => toggleSort(key)}>
                {sortBy === key ? (
                  sortOrder === "asc" ? (
                    <ArrowUpward fontSize="small" />
                  ) : (
                    <ArrowDownward fontSize="small" />
                  )
                ) : (
                  <ArrowDownward sx={{ opacity: 0.3 }} fontSize="small" />
                )}
              </IconButton>
            </Box>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
