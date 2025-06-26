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
import { useState, useEffect } from "react";
import TicketDetails from "../ticket_details/TicketDetails";
import api from "../../axios_conf"; // Adjust import path as needed

type Props = {
  tickets: any[];
  canEditTicket: boolean;
  canDeleteTicket: boolean;
  onEdit: (ticket: any) => void;
  onDelete: (ticket: any) => void;
  onAdd: () => void;
};

export default function AssetTicketsTab({
  tickets,
  canEditTicket,
  canDeleteTicket,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [owners, setOwners] = useState<Record<number, string>>({});

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

  useEffect(() => {
    if (!Array.isArray(tickets)) return;

    const ownerIds = new Set<number>();
    tickets.forEach((ticket: any) => {
      if (ticket.owner_id && !owners[ticket.owner_id]) {
        ownerIds.add(ticket.owner_id);
      }
    });

    ownerIds.forEach((id) => fetchOwners(id));
  }, [tickets]);

  const handleRowClick = (ticket: any) => {
    setSelectedTicket(ticket);
    setDetailsOpen(true);
  };

  const renderTable = () => {
    if (!tickets || tickets.length === 0) {
      return <Typography sx={{ mt: 1 }}>No tickets found.</Typography>;
    }

    const keys = Object.keys(tickets[0]).filter(
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
              {(canEditTicket || canDeleteTicket) && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleRowClick(row)}
              >
                {keys.map((key) => (
                  <TableCell key={key}>
                    {key === "owner_id"
                      ? owners[row[key]] || row[key]
                      : row[key] == null
                        ? ""
                        : typeof row[key] === "string" && row[key].length > 50
                          ? `${row[key].slice(0, 50)}...`
                          : String(row[key])}
                  </TableCell>
                ))}
                {(canEditTicket || canDeleteTicket) && (
                  <TableCell
                    align="center"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                  >
                    {canEditTicket && (
                      <IconButton
                        size="small"
                        onClick={() => onEdit(row)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                    )}
                    {canDeleteTicket && (
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
        Tickets
      </Typography>
      {renderTable()}
      <Button variant="contained" sx={{ mt: 2 }} onClick={onAdd}>
        Create Ticket
      </Button>
      {selectedTicket && (
        <TicketDetails
          open={detailsOpen}
          ticket={selectedTicket}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedTicket(null);
          }}
        />
      )}
    </>
  );
}
