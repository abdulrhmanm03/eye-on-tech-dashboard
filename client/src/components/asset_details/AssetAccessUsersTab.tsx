import { useState } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import UserDetails from "../UserDetails";

type Props = {
  users: any[];
  canManageUsers: boolean;
  onRevoke: (user: any) => void;
  onAdd: () => void;
};

export default function AssetAccessUsersTab({
  users,
  canManageUsers,
  onRevoke,
  onAdd,
}: Props) {
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRowClick = (user: any) => {
    setSelectedUser(user);
    setDetailsOpen(true);
  };

  const handleClose = () => {
    setDetailsOpen(false);
    setSelectedUser(null);
  };

  const renderTable = () => {
    if (!users || users.length === 0) {
      return <Typography sx={{ mt: 1 }}>No users found.</Typography>;
    }

    const keys = Object.keys(users[0]).filter(
      (key) =>
        key !== "parent_asset_id" && key !== "handlers" && key !== "assetid",
    );

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {keys.map((key) => (
                <TableCell key={key}>{key.replace(/_/g, " ")}</TableCell>
              ))}
              {canManageUsers && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => handleRowClick(row)}
                sx={{ cursor: "pointer" }}
              >
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
                {canManageUsers && (
                  <TableCell
                    align="center"
                    onClick={(e) => e.stopPropagation()} // stop propagation to avoid opening details
                  >
                    <IconButton
                      size="small"
                      onClick={() => onRevoke(row)}
                      aria-label="revoke access"
                    >
                      <DeleteIcon />
                    </IconButton>
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
        Accessible Users
      </Typography>
      {renderTable()}
      {canManageUsers && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={onAdd}>
          Add User
        </Button>
      )}
      {selectedUser && (
        <UserDetails
          open={detailsOpen}
          user={selectedUser}
          onClose={handleClose}
        />
      )}
    </>
  );
}
