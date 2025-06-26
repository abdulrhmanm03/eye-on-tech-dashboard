import { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPocForm from "../AddPocForm";
import api from "../../axios_conf";

type PointOfContact = {
  id: number;
  username: string;
  value: string;
  type: string;
};

type Props = {
  canManageContacts: boolean;
  onEdit: (contact: any) => void;
  onDelete: (contact: any) => void;
  onAdd: () => void;
  assetId: number;
};

export default function AssetContactsTab({
  canManageContacts,
  onEdit,
  onDelete,
  onAdd,
  assetId,
}: Props) {
  const [contacts, setContacts] = useState<PointOfContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`pocs/asset/${assetId}`);
      setContacts(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (assetId) {
      fetchContacts();
    }
  }, [assetId]);

  const handleAddClick = () => {
    setIsAddFormOpen(true);
    onAdd();
  };

  const handleFormClose = () => {
    setIsAddFormOpen(false);
  };

  const handleFormSave = (newPoc: PointOfContact) => {
    // Add the new contact to the list
    setContacts((prev) => [...prev, newPoc]);
    setIsAddFormOpen(false);
  };

  const handleEdit = (contact: PointOfContact) => {
    onEdit(contact);
  };

  const handleDelete = (contact: PointOfContact) => {
    onDelete(contact);
    // Remove the contact from the list after deletion
    setContacts((prev) => prev.filter((c) => c.id !== contact.id));
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress />
        </div>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Button
            variant="outlined"
            size="small"
            onClick={fetchContacts}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      );
    }

    if (!contacts || contacts.length === 0) {
      return <Typography sx={{ mt: 1 }}>No contacts found.</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              {canManageContacts && (
                <TableCell align="center">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id} hover>
                <TableCell>{contact.username}</TableCell>
                <TableCell>{contact.type}</TableCell>
                <TableCell>{contact.value}</TableCell>
                {canManageContacts && (
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(contact)}
                      aria-label="edit contact"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(contact)}
                      aria-label="delete contact"
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
        Asset Contacts
      </Typography>
      {renderTable()}
      {canManageContacts && (
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddClick}>
          Add Contact
        </Button>
      )}
      <AddPocForm
        open={isAddFormOpen}
        onClose={handleFormClose}
        onSave={handleFormSave}
        targetType="asset"
        targetId={assetId}
      />
    </>
  );
}
