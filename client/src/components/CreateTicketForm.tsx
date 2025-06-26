import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import api from "../axios_conf";
import TicketStatus from "../enums/TicketStatus";
import AssetSelector from "./AssetSelector"; // Adjust the import path as needed

interface Asset {
  id: number;
  type?: string;
  serial_number?: string;
  model: string;
  tag?: string;
  // Add other asset properties as needed
}

export default function CreateTicketForm({
  open,
  onClose,
  onCreated,
  assetId,
}: {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
  assetId?: number;
}) {
  const [formData, setFormData] = useState({
    description: "",
    creation_date: new Date().toISOString().split("T")[0],
    status: TicketStatus.open,
    asset_id: "",
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetsLoading, setAssetsLoading] = useState(false);

  // Fetch assets when dialog opens (for preselection purposes)
  useEffect(() => {
    if (open && assetId) {
      fetchAssets();
    }
  }, [open, assetId]);

  // Handle preselected asset when assetId prop is provided
  useEffect(() => {
    if (open && assetId && assets.length > 0) {
      const asset = assets.find((a) => a.id === assetId);
      if (asset) {
        setSelectedAsset(asset);
        setFormData((prev) => ({
          ...prev,
          asset_id: asset.id.toString(),
        }));
      }
    }
  }, [open, assetId, assets]);

  const fetchAssets = async () => {
    setAssetsLoading(true);
    try {
      const response = await api.get("/assets/");
      setAssets(response.data);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setAssetsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssetChange = (newAsset: Asset | null) => {
    setSelectedAsset(newAsset);
    setFormData((prev) => ({
      ...prev,
      asset_id: newAsset ? newAsset.id.toString() : "",
    }));
  };

  const isFormValid =
    formData.description.trim() !== "" &&
    formData.creation_date.trim() !== "" &&
    formData.status.trim() !== "" &&
    formData.asset_id.trim() !== "";

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      const payload = {
        ...formData,
        asset_id: Number(formData.asset_id),
        creation_date: new Date(formData.creation_date)
          .toISOString()
          .split("T")[0],
      };

      await api.post("/tickets/create", payload);

      // Reset form
      setFormData({
        description: "",
        creation_date: new Date().toISOString().split("T")[0],
        status: TicketStatus.open,
        asset_id: "",
      });
      setSelectedAsset(null);
      onClose();
      onCreated?.();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  // Reset form when dialog closes
  const handleClose = () => {
    // Only reset if not preselected
    if (!assetId) {
      setFormData({
        description: "",
        creation_date: new Date().toISOString().split("T")[0],
        status: TicketStatus.open,
        asset_id: "",
      });
      setSelectedAsset(null);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Ticket</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <AssetSelector
          value={selectedAsset}
          onChange={handleAssetChange}
          label="Asset"
          required
          helperText={
            assetId
              ? "Asset is preselected and locked"
              : "Search by ID, type, serial number, model, or tag"
          }
          // If assetId is provided, we could make it read-only
          // but AssetSelector doesn't have a disabled prop yet
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="dense"
          required
          multiline
          rows={3}
          sx={{ mt: 2 }}
        />

        <TextField
          fullWidth
          type="date"
          label="Creation Date"
          name="creation_date"
          value={formData.creation_date}
          onChange={handleChange}
          margin="dense"
          required
          InputLabelProps={{
            shrink: true,
          }}
        />

        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          margin="dense"
          fullWidth
          required
        >
          {Object.values(TicketStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
