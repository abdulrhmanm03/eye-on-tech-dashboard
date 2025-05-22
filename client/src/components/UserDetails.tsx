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
          <IconButton
            sx={{ float: "right", ml: 1 }}
            onClick={() => setConfirmUserDeleteOpen(true)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            sx={{ float: "right" }}
            onClick={() => {
              setSelectedUser(user);
              setEditUserOpen(true);
            }}
          >
            <EditIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="subtitle1">
            Username: {userData.username}
          </Typography>

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
                  • Organization: {poc.organization}
                </Typography>
                <Typography variant="body2">• Name: {poc.full_name}</Typography>
                <Typography variant="body2">
                  • Phone: {poc.phone_number}
                </Typography>
                <Typography variant="body2">• Email: {poc.email}</Typography>

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
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 1 }}>No points of contact found.</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Box>
            <Button
              onClick={() => setAddPocOpen(true)}
              variant="contained"
              sx={{ mr: 2 }}
            >
              Add Point of Contact
            </Button>
            <ResetPasswordButton userId={userData.id} />
          </Box>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add PoC */}
      <AddPocForm
        open={addPocOpen}
        onClose={() => setAddPocOpen(false)}
        onSave={handleAddPoc}
        userId={userData.id}
      />

      {selectedPoc && (
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
      <Confirm
        open={confirmPocDeleteOpen}
        message={`Are you sure you want to delete PoC "${selectedPoc?.full_name || "this PoC"}"?`}
        onConfirm={handleDeletePoc}
        onCancel={() => {
          setConfirmPocDeleteOpen(false);
          setSelectedPoc(null);
        }}
      />

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
