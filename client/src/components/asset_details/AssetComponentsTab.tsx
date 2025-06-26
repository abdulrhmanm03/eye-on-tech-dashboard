import {
  Typography,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  components: any[];
  canEditComponent: boolean;
  canDeleteComponent: boolean;
  onEdit: (component: any) => void;
  onDelete: (component: any) => void;
  onAdd: () => void;
};

export default function AssetComponentsTab({
  components,
  canEditComponent,
  canDeleteComponent,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  const renderTable = () => {
    if (!components || components.length === 0) {
      return <Typography sx={{ mt: 1 }}>No components found.</Typography>;
    }

    const keys = Object.keys(components[0]).filter(
      (key) =>
        key !== "parent_asset_id" && key !== "handlers" && key !== "asset_id",
    );

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {keys.map((key) => (
                <TableCell key={key}>{key.replace(/_/g, " ")}</TableCell>
              ))}
              {(canEditComponent || canDeleteComponent) && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {components.map((row) => (
              <TableRow key={row.id}>
                {keys.map((key) => (
                  <TableCell key={key}>
                    {key.includes("date") || key.includes("at")
                      ? new Date(row[key]).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : row[key]}
                  </TableCell>
                ))}
                {(canEditComponent || canDeleteComponent) && (
                  <TableCell align="center">
                    {canEditComponent && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(row)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {canDeleteComponent && (
                      <IconButton
                        size="small"
                        onClick={() => onDelete(row)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
        Components
      </Typography>
      {renderTable()}
      {canEditComponent && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={onAdd}>
          Add Component
        </Button>
      )}
    </>
  );
}
