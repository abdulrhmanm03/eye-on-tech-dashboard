import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../axios_conf";
import AddPocForm from "./AddPocForm";
import EditPocForm from "./EditPocForm";
import Confirm from "./Confirm";
import EditUserForm from "./EditUserForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQueryClient } from "@tanstack/react-query";
import ResetPasswordButton from "./ResetPawordButton";
import UserRole from "../enums/UserRoles";
import { useAuth } from "../context/AuthContext";

type Props = {
  open: boolean;
  user: any;
  onClose: () => void;
};

export default function UserDetails({ open, user, onClose }: Props) {
  const [pocs, setPocs] = useState<any[]>([]);
  const [addPocOpen, setAddPocOpen] = useState(false);
  const [editPocOpen, setEditPocOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [selectedPoc, setSelectedPoc] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [confirmUserDeleteOpen, setConfirmUserDeleteOpen] = useState(false);
  const [confirmPocDeleteOpen, setConfirmPocDeleteOpen] = useState(false);
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState(user);
  const { role } = useAuth();

  // Access control permissions
  const canDeleteUser =
    role === UserRole.supervisor && user.role !== UserRole.supervisor;

  const canEditUser =
    (role === UserRole.supervisor && user.role !== UserRole.supervisor) ||
    (role === UserRole.administrator &&
      user.role !== UserRole.administrator &&
      user.role !== UserRole.supervisor);

  // New access control for POCs and password reset
  const canManagePocs =
    (role === UserRole.supervisor && user.role !== UserRole.supervisor) ||
    (role === UserRole.administrator &&
      user.role !== UserRole.administrator &&
      user.role !== UserRole.supervisor);

  const canResetPassword =
    (role === UserRole.supervisor && user.role !== UserRole.supervisor) ||
    (role === UserRole.administrator &&
      user.role !== UserRole.administrator &&
      user.role !== UserRole.supervisor);

  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/${user.id}`);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch user", err);
      return user;
    }
  };

  const fetchPocs = async () => {
    try {
      const res = await api.get(`/pocs/user/${user.id}`);
      setPocs(res.data);
    } catch (err) {
      console.error("Failed to fetch PoCs", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchPocs();
    }
  }, [user]);

  const handleAddPoc = async () => {
    await fetchPocs();
  };

  const handleDeletePoc = async () => {
    if (!selectedPoc?.id) return;
    try {
      await api.delete(`/pocs/${selectedPoc.id}`);
      await fetchPocs();
    } catch (err) {
      console.error("Failed to delete PoC", err);
    } finally {
      setConfirmPocDeleteOpen(false);
      setSelectedPoc(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await api.delete(`/users/${user.id}`);
      queryClient.invalidateQueries(["users"]);
      setConfirmUserDeleteOpen(false);
      onClose();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          User Details
          {canDeleteUser && (
            <IconButton
              sx={{ float: "right", ml: 1 }}
              onClick={() => setConfirmUserDeleteOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {canEditUser && (
            <IconButton
              sx={{ float: "right" }}
              onClick={() => {
                setSelectedUser(user);
                setEditUserOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          {Object.entries(user).map(([key, value]) => {
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
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>:{" "}
                {value}
              </Typography>
            );
          })}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Points of Contact
          </Typography>
          {pocs.length > 0 ? (
            pocs.map((poc, index) => (
              <Box
                key={poc.id}
                sx={{
                  mt: 2,
                  mb: 2,
                  pl: 2,
                  borderLeft: "4px solid #1976d2",
                  position: "relative",
                }}
              >
                <Typography variant="subtitle2">
                  Point of Contact {index + 1}
                </Typography>
                <Typography variant="body2">
                  • {poc.type}: {poc.value}
                </Typography>
                {canManagePocs && (
                  <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                    <IconButton
                      onClick={() => {
                        setSelectedPoc(poc);
                        setEditPocOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setSelectedPoc(poc);
                        setConfirmPocDeleteOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 1 }}>No points of contact found.</Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box>
            {canManagePocs && (
              <Button
                onClick={() => setAddPocOpen(true)}
                variant="contained"
                sx={{ mr: 2 }}
              >
                Add Point of Contact
              </Button>
            )}
            {canResetPassword && <ResetPasswordButton userId={userData.id} />}
          </Box>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add PoC */}
      {canManagePocs && (
        <AddPocForm
          open={addPocOpen}
          onClose={() => setAddPocOpen(false)}
          onSave={handleAddPoc}
          targetType="user"
          targetId={user.id}
          username={user.username}
        />
      )}

      {/* Edit PoC */}
      {selectedPoc && canManagePocs && (
        <EditPocForm
          open={editPocOpen}
          poc={selectedPoc}
          onClose={() => {
            setEditPocOpen(false);
            setSelectedPoc(null);
          }}
          onSuccess={async () => {
            await fetchPocs();
          }}
        />
      )}

      {/* Confirm Delete PoC */}
      {canManagePocs && (
        <Confirm
          open={confirmPocDeleteOpen}
          message={`Are you sure you want to delete PoC "${selectedPoc?.full_name || "this PoC"}"?`}
          onConfirm={handleDeletePoc}
          onCancel={() => {
            setConfirmPocDeleteOpen(false);
            setSelectedPoc(null);
          }}
        />
      )}

      {/* Edit User */}
      {selectedUser && (
        <EditUserForm
          open={editUserOpen}
          user={selectedUser}
          onClose={async () => {
            const updated = await fetchUser();
            setUserData(updated);
            setEditUserOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Confirm Delete User */}
      <Confirm
        open={confirmUserDeleteOpen}
        message={`Are you sure you want to delete user "${user.username}"?`}
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmUserDeleteOpen(false)}
      />
    </>
  );
}
