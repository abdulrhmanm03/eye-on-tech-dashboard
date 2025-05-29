import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Tabs,
  Tab,
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
import { useEffect, useState } from "react";
import api from "../axios_conf";
import Confirm from "./Confirm";
import EditAssetForm from "./EditAssetForm";
import AddComponentForm from "./AddComponentForm";
import EditComponentForm from "./EditComponentForm";
import EditTicketForm from "./EditTicketForm";

type Props = {
  open: boolean;
  asset: any;
  onClose: () => void;
};

export default function AssetDetails({ open, asset, onClose }: Props) {
  const [components, setComponents] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [confirmComponentDeleteOpen, setConfirmComponentDeleteOpen] =
    useState(false);
  const [confirmTicketDeleteOpen, setConfirmTicketDeleteOpen] = useState(false);
  const [editComponentOpen, setEditComponentOpen] = useState(false);
  const [addComponentOpen, setAddComponentOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const fetchComponents = async () => {
    try {
      const res = await api.get(`/assets/components/${asset.id}`);
      setComponents(res.data);
    } catch (err) {
      console.error("Failed to fetch components", err);
    }
  };

  const fetchTickets = async () => {
    try {
      const res = await api.get(`/assets/tickets/${asset.id}`);
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    }
  };

  useEffect(() => {
    if (asset?.id) {
      fetchComponents();
      fetchTickets();
    }
  }, [asset]);

  const handleDelete = async () => {
    try {
      await api.delete(`/assets/delete/${asset.id}`);
      setConfirmDeleteOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete asset", err);
    }
  };

  const handleDeleteComponent = async () => {
    if (!selectedComponent?.id) return;
    try {
      await api.delete(`/components/delete/${selectedComponent.id}`);
      await fetchComponents();
    } catch (err) {
      console.error("Failed to delete component", err);
    } finally {
      setConfirmComponentDeleteOpen(false);
      setSelectedComponent(null);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket?.id) return;
    try {
      await api.delete(`/tickets/delete/${selectedTicket.id}`);
      await fetchTickets();
    } catch (err) {
      console.error("Failed to delete ticket", err);
    } finally {
      setConfirmTicketDeleteOpen(false);
      setSelectedTicket(null);
    }
  };

  const renderDynamicTable = (
    data: any[],
    onEdit?: (row: any) => void,
    onDelete?: (row: any) => void,
  ) => {
    if (!data || data.length === 0) {
      return <Typography sx={{ mt: 1 }}>No data found.</Typography>;
    }
    // Exclude specific keys like "id" and "handlers"
    const keys = Object.keys(data[0]).filter(
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
              {(onEdit || onDelete) && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
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
                {(onEdit || onDelete) && (
                  <TableCell align="center">
                    {onEdit && (
                      <IconButton size="small" onClick={() => onEdit(row)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton size="small" onClick={() => onDelete(row)}>
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
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Asset Details
          <IconButton
            sx={{ float: "right", ml: 1 }}
            onClick={() => setConfirmDeleteOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton sx={{ float: "right" }} onClick={() => setEditOpen(true)}>
            <EditIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {Object.entries(asset).map(([key, value]) => {
            if (
              value === null ||
              value === undefined ||
              (typeof value === "string" && value.trim() === "") ||
              (Array.isArray(value) && value.length === 0)
            ) {
              return null; // Skip empty values
            }
            return (
              <Typography
                key={key}
                variant={key === "tag" ? "subtitle1" : "body1"}
              >
                {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`}
              </Typography>
            );
          })}
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            centered
            sx={{ mt: 2 }}
          >
            <Tab label="Components" />
            <Tab label="Tickets" />
          </Tabs>
          {tabIndex === 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Components
              </Typography>
              {renderDynamicTable(
                components,
                (component) => {
                  setSelectedComponent(component);
                  setEditComponentOpen(true);
                },
                (component) => {
                  setSelectedComponent(component);
                  setConfirmComponentDeleteOpen(true);
                },
              )}
            </>
          )}
          {tabIndex === 1 && (
            <>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Tickets
              </Typography>
              {renderDynamicTable(
                tickets,
                (ticket) => {
                  setSelectedTicket(ticket);
                  setEditTicketOpen(true);
                },
                (ticket) => {
                  setSelectedTicket(ticket);
                  setConfirmTicketDeleteOpen(true);
                },
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddComponentOpen(true)} variant="contained">
            Add Component
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Confirm
        open={confirmDeleteOpen}
        message={`Are you sure you want to delete asset "${asset.tag}"?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
      <Confirm
        open={confirmComponentDeleteOpen}
        message={`Delete component "${selectedComponent?.type}"?`}
        onConfirm={handleDeleteComponent}
        onCancel={() => {
          setConfirmComponentDeleteOpen(false);
          setSelectedComponent(null);
        }}
      />
      <Confirm
        open={confirmTicketDeleteOpen}
        message={`Are you sure you want to delete ticket "${selectedTicket?.title}"?`}
        onConfirm={handleDeleteTicket}
        onCancel={() => {
          setConfirmTicketDeleteOpen(false);
          setSelectedTicket(null);
        }}
      />

      {editOpen && (
        <EditAssetForm
          open={editOpen}
          asset={asset}
          onClose={() => {
            setEditOpen(false);
            fetchComponents();
            fetchTickets();
          }}
        />
      )}

      {editComponentOpen && selectedComponent && (
        <EditComponentForm
          open={editComponentOpen}
          component={selectedComponent}
          onClose={() => {
            setEditComponentOpen(false);
            setSelectedComponent(null);
          }}
          onSuccess={fetchComponents}
        />
      )}

      {editTicketOpen && selectedTicket && (
        <EditTicketForm
          open={editTicketOpen}
          ticket={selectedTicket}
          onClose={(updatedTicket: any) => {
            setEditTicketOpen(false);
            setSelectedTicket(null);
            if (updatedTicket) {
              fetchTickets(); // Refresh tickets if updated
            }
          }}
        />
      )}

      {addComponentOpen && (
        <AddComponentForm
          open={addComponentOpen}
          onClose={() => setAddComponentOpen(false)}
          onSave={fetchComponents}
          parentAssetId={asset.id}
        />
      )}
    </>
  );
}
