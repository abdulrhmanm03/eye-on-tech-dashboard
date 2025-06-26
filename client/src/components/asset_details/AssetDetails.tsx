import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../../axios_conf";
import Confirm from "../Confirm";
import EditAssetForm from "../EditAssetForm";
import AddComponentForm from "../AddComponentForm";
import EditComponentForm from "../EditComponentForm";
import EditTicketForm from "../EditTicketForm";
import CreateTicketForm from "../CreateTicketForm";
import AddUserToAssetForm from "../AddUserToAssetForm";
import UserRole from "../../enums/UserRoles";
import { useAuth } from "../../context/AuthContext";
import AssetComponentsTab from "./AssetComponentsTab";
import AssetTicketsTab from "./AssetTicketsTab";
import AssetAccessUsersTab from "./AssetAccessUsersTab";
import AssetContactsTab from "./AssetContactsTab";
import AssetData from "./AssetDate";

type Props = {
  open: boolean;
  asset: any;
  onClose: () => void;
};

export default function AssetDetails({ open, asset, onClose }: Props) {
  const [components, setComponents] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [confirmComponentDeleteOpen, setConfirmComponentDeleteOpen] =
    useState(false);
  const [confirmTicketDeleteOpen, setConfirmTicketDeleteOpen] = useState(false);
  const [confirmContactDeleteOpen, setConfirmContactDeleteOpen] =
    useState(false);
  const [editComponentOpen, setEditComponentOpen] = useState(false);
  const [addComponentOpen, setAddComponentOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTicketOpen, setEditTicketOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [editContactOpen, setEditContactOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [confirmRevokeAccessOpen, setConfirmRevokeAccessOpen] = useState(false);
  const { role } = useAuth();

  // Access control permissions
  const canDeleteAsset = role === UserRole.supervisor;
  const canEditAsset =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canManageUsers =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canManageContacts =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canAddComponent =
    role === UserRole.engineer ||
    role === UserRole.supervisor ||
    role === UserRole.administrator;
  const canEditComponent =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canDeleteComponent =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canEditTicket =
    role === UserRole.supervisor || role === UserRole.administrator;
  const canDeleteTicket =
    role === UserRole.supervisor || role === UserRole.administrator;

  const fetchComponents = async () => {
    try {
      const res = await api.get(`/assets/components/${asset.id}`);
      setComponents(res.data);
    } catch (err) {
      console.error("Failed to fetch components", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/assets/users/${asset.id}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
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
      if (canManageUsers) {
        fetchUsers();
      }
    }
  }, [asset, canManageUsers]);

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

  const handleRevokeAccess = async () => {
    if (!selectedUser?.id) return;
    try {
      await api.delete(`/assets/${asset.id}/revoke-access`, {
        data: { user_id: selectedUser.id },
      });
      await fetchUsers(); // Refresh the users list
    } catch (err) {
      console.error("Failed to revoke access", err);
    } finally {
      setConfirmRevokeAccessOpen(false);
      setSelectedUser(null);
    }
  };

  const handleUserAddSuccess = () => {
    fetchUsers(); // Refresh the users list
    setAddUserOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          Asset Details
          {canDeleteAsset && (
            <IconButton
              sx={{ float: "right", ml: 1 }}
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {canEditAsset && (
            <IconButton
              sx={{ float: "right" }}
              onClick={() => setEditOpen(true)}
            >
              <EditIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <AssetData asset={asset} />
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            centered
            sx={{ mt: 2 }}
          >
            <Tab label="Components" />
            <Tab label="Tickets" />
            {canManageUsers && <Tab label="Users with access" />}
            <Tab label="Contacts" />
          </Tabs>
          {tabIndex === 0 && (
            <AssetComponentsTab
              components={components}
              canEditComponent={canEditComponent}
              canDeleteComponent={canDeleteComponent}
              onEdit={(component) => {
                setSelectedComponent(component);
                setEditComponentOpen(true);
              }}
              onDelete={(component) => {
                setSelectedComponent(component);
                setConfirmComponentDeleteOpen(true);
              }}
              onAdd={() => setAddComponentOpen(true)}
            />
          )}
          {tabIndex === 1 && (
            <AssetTicketsTab
              tickets={tickets}
              canEditTicket={canEditTicket}
              canDeleteTicket={canDeleteTicket}
              onEdit={(ticket) => {
                setSelectedTicket(ticket);
                setEditTicketOpen(true);
              }}
              onDelete={(ticket) => {
                setSelectedTicket(ticket);
                setConfirmTicketDeleteOpen(true);
              }}
              onAdd={() => setCreateTicketOpen(true)}
            />
          )}
          {tabIndex === 2 && canManageUsers && (
            <AssetAccessUsersTab
              users={users}
              canManageUsers={canManageUsers}
              onRevoke={(user) => {
                setSelectedUser(user);
                setConfirmRevokeAccessOpen(true);
              }}
              onAdd={() => setAddUserOpen(true)}
            />
          )}
          {tabIndex === 3 && (
            <AssetContactsTab
              canManageContacts={canManageContacts}
              onEdit={(contact) => {
                setSelectedContact(contact);
                setEditContactOpen(true);
              }}
              onDelete={(contact) => {
                setSelectedContact(contact);
                setConfirmContactDeleteOpen(true);
              }}
              onAdd={() => setAddContactOpen(true)}
              assetId={asset.id}
            />
          )}
        </DialogContent>
        <DialogActions>
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
      <Confirm
        open={confirmContactDeleteOpen}
        message={`Are you sure you want to delete contact "${selectedContact?.name}"?`}
        onConfirm={() => {}}
        onCancel={() => {
          setConfirmContactDeleteOpen(false);
          setSelectedContact(null);
        }}
      />
      <Confirm
        open={confirmRevokeAccessOpen}
        message={`Revoke access for user "${selectedUser?.name || selectedUser?.username || selectedUser?.email}"?`}
        onConfirm={handleRevokeAccess}
        onCancel={() => {
          setConfirmRevokeAccessOpen(false);
          setSelectedUser(null);
        }}
      />

      {createTicketOpen && (
        <CreateTicketForm
          open={createTicketOpen}
          onClose={() => setCreateTicketOpen(false)}
          onCreated={() => {
            setCreateTicketOpen(false);
            fetchTickets(); // Refresh tickets list
          }}
          assetId={asset.id}
        />
      )}
      {editOpen && canEditAsset && (
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
      {editComponentOpen && selectedComponent && canEditComponent && (
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
      {editTicketOpen && selectedTicket && canEditTicket && (
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
      {addComponentOpen && canAddComponent && (
        <AddComponentForm
          open={addComponentOpen}
          onClose={() => setAddComponentOpen(false)}
          onSave={fetchComponents}
          parentAssetId={asset.id}
        />
      )}
      {addUserOpen && canManageUsers && (
        <AddUserToAssetForm
          open={addUserOpen}
          onClose={() => setAddUserOpen(false)}
          assetId={asset.id}
          onSuccess={handleUserAddSuccess}
        />
      )}

      {/* TODO: Replace these placeholder components with actual forms when ready */}
      {addContactOpen && canManageContacts && (
        <div>
          {/* Placeholder for AddContactForm - implement when needed */}
          <Button onClick={() => setAddContactOpen(false)}>
            Close Add Contact
          </Button>
        </div>
      )}
      {editContactOpen && selectedContact && canManageContacts && (
        <div>
          {/* Placeholder for EditContactForm - implement when needed */}
          <Button
            onClick={() => {
              setEditContactOpen(false);
              setSelectedContact(null);
            }}
          >
            Close Edit Contact
          </Button>
        </div>
      )}
    </>
  );
}
