import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../axios_conf";
import Confirm from "./Confirm";
import EditAssetForm from "./EditAssetForm";
import AddComponentForm from "./AddComponentForm"; // create this component if not yetassetdt
import EditComponentForm from "./EditComponentForm"; // create this component if not yet

type Props = {
  open: boolean;
  asset: any;
  onClose: () => void;
};

export default function AssetDetails({ open, asset, onClose }: Props) {
  const [components, setComponents] = useState<any[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<any | null>(null);
  const [confirmComponentDeleteOpen, setConfirmComponentDeleteOpen] =
    useState(false);
  const [editComponentOpen, setEditComponentOpen] = useState(false);
  const [addComponentOpen, setAddComponentOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const fetchComponents = async () => {
    try {
      const res = await api.get(`/assets/components/${asset.id}`);
      setComponents(res.data);
    } catch (err) {
      console.error("Failed to fetch components", err);
    }
  };

  useEffect(() => {
    if (asset?.id) {
      fetchComponents();
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

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          <Typography variant="subtitle1">Tag: {asset.tag}</Typography>
          <Typography>Model: {asset.model}</Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Components
          </Typography>

          {components.length > 0 ? (
            components.map((component, index) => (
              <Box
                key={component.id}
                sx={{
                  mt: 2,
                  pl: 2,
                  borderLeft: "4px solid #1976d2",
                  position: "relative",
                }}
              >
                <Typography variant="subtitle2">
                  Component {index + 1}
                </Typography>
                <Typography>• Type: {component.type}</Typography>
                <Typography>• Model: {component.model}</Typography>
                <Typography>• Serial: {component.serial_number}</Typography>
                <Typography>• Status: {component.status}</Typography>

                <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                  <IconButton
                    onClick={() => {
                      setSelectedComponent(component);
                      setEditComponentOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedComponent(component);
                      setConfirmComponentDeleteOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 1 }}>No components found.</Typography>
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

      {editOpen && (
        <EditAssetForm
          open={editOpen}
          asset={asset}
          onClose={() => {
            setEditOpen(false);
            fetchComponents();
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
          onSuccess={fetchComponents} // ✅ now only refreshes after successful save
        />
      )}

      {addComponentOpen && (
        <AddComponentForm
          open={addComponentOpen}
          onClose={() => setAddComponentOpen(false)}
          onSave={fetchComponents} // Only fetch components, not save
          parentAssetId={asset.id}
        />
      )}
    </>
  );
}
