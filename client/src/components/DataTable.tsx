import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../axios_conf";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Confirm from "./Confirm";
import EditUserForm from "./EditUserForm"; // ✅ Import edit form
import EditTicketForm from "./EditTicketForm";

type Props = {
  view: string;
};

const fetchData = async (endpoint: string) => {
  const res = await api.get(`/${endpoint.toLowerCase()}`);
  return res.data;
};

const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};

const deleteTicket = async (id: number) => {
  await api.delete(`/tickets/delete/${id}`);
};

const updateUser = async (user: any) => {
  const res = await api.put("/users", user);
  return res.data;
};

const updateTicket = async (id: number, ticket: any) => {
  const res = await api.put(`/tickets/${id}`, ticket);
  return res.data;
};

export default function DataTable({ view }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<any | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [view],
    queryFn: () => fetchData(view),
  });

  const handleSave = async (updatedItem: any, itemId?: number) => {
    try {
      if (view.toLowerCase() === "users") {
        await updateUser(updatedItem);
      } else if (view.toLowerCase() === "tickets" && itemId) {
        await updateTicket(itemId, updatedItem);
      }
      queryClient.invalidateQueries([view]);
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async () => {
    if (!rowToDelete?.id) return;

    try {
      if (view.toLowerCase() === "users") {
        await deleteUser(rowToDelete.id);
      } else if (view.toLowerCase() === "tickets") {
        await deleteTicket(rowToDelete.id);
      }

      queryClient.invalidateQueries([view]);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setConfirmOpen(false);
      setRowToDelete(null);
    }
  };

  const keys =
    Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && (
        <Typography color="error">
          Failed to fetch {view.toLowerCase()}.
        </Typography>
      )}
      {!isLoading && Array.isArray(data) && (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  // {/* <TableCell key={key}> */}
                  // {/*   {key.toUpperCase()} */}
                  // {/*                        */}
                  // {/*   sx={{color: 'red'}} */}
                  // {/* </TableCell> */}
                  <TableCell
                    key={key}
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {key.toUpperCase()}
                  </TableCell>
                ))}
                <TableCell
                  sx={{
                    fontWeight: 600,
                    position: "sticky",
                    right: 0,
                    backgroundColor: "background.paper",
                    zIndex: 1,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: any) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={selectedId === row.id}
                  onClick={() => setSelectedId(row.id)}
                  sx={{ cursor: "pointer" }}
                >
                  {keys.map((key) => (
                    <TableCell key={key}>
                      {key === "password"
                        ? `${row[key]?.slice(0, 10)}...`
                        : String(row[key])}
                    </TableCell>
                  ))}
                  <TableCell
                    sx={{
                      position: "sticky",
                      right: 0,
                      backgroundColor: "background.paper",
                      zIndex: 1,
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowToEdit(row);
                        setEditOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setRowToDelete(row);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Confirm Delete Dialog */}
      <Confirm
        open={confirmOpen}
        message={
          view.toLowerCase() === "users"
            ? `Are you sure you want to delete user "${rowToDelete?.username || "this user"}"?`
            : `Are you sure you want to delete ticket #${rowToDelete?.id}?`
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setRowToDelete(null);
        }}
      />

      {rowToEdit && view.toLowerCase() === "users" && (
        <EditUserForm
          open={editOpen}
          user={rowToEdit}
          onClose={() => {
            setEditOpen(false);
            setRowToEdit(null);
          }}
          onSave={handleSave}
        />
      )}

      {rowToEdit && view.toLowerCase() === "tickets" && (
        <EditTicketForm
          open={editOpen}
          ticket={rowToEdit}
          onClose={() => {
            setEditOpen(false);
            setRowToEdit(null);
          }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
