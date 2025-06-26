import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  Autocomplete,
  Chip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import AssetStatus from "../enums/AssetStatus";
import api from "../axios_conf";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export interface AssetFormData {
  type: string;
  tag: string;
  model: string;
  serial_number: string;
  production_year: number;
  chassis_number?: string;
  plate_number?: string;
  location: string;
  geolocation: string;
  note?: string;
  status: AssetStatus;
  warranty_expiry: string;
  maintenance_expiry: string;
  last_service: string;
  next_service: string;
  owner_id: number;
}

interface CreateAssetFormProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

interface AssetTypeOption {
  type: string;
  count: number;
  isCustom?: boolean;
}

const CreateAssetForm: React.FC<CreateAssetFormProps> = ({
  open,
  onClose,
  onCreated,
}) => {
  const currentUserId = useAuth().id;

  const today = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(today.getMonth() + 3);

  const [form, setForm] = useState<AssetFormData>({
    type: "",
    tag: "",
    model: "",
    serial_number: "",
    production_year: today.getFullYear(),
    chassis_number: "",
    plate_number: "",
    location: "",
    geolocation: "",
    note: "",
    status: AssetStatus.working,
    warranty_expiry: "",
    maintenance_expiry: "",
    last_service: today.toISOString().split("T")[0],
    next_service: threeMonthsLater.toISOString().split("T")[0],
    owner_id: currentUserId, // Set owner_id to the current user's ID
  });

  const [typeOptions, setTypeOptions] = useState<AssetTypeOption[]>([]);
  const [typeInputValue, setTypeInputValue] = useState("");

  // Update owner_id when currentUserId prop changes
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      owner_id: currentUserId,
    }));
  }, [currentUserId]);

  // Check if current type is vehicle
  const isVehicleType = form.type.toLowerCase() === "vehicle";

  // Fetch existing assets to get type statistics
  const { data: assetsData } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/assets");
      return res.data;
    },
    enabled: open, // Only fetch when dialog is open
  });

  // Process assets data to get type frequency
  useEffect(() => {
    if (assetsData) {
      const typeCount: Record<string, number> = {};
      // Count occurrences of each type
      assetsData.forEach((asset: any) => {
        if (asset.type) {
          typeCount[asset.type] = (typeCount[asset.type] || 0) + 1;
        }
      });

      // Convert to options array and sort by count (descending)
      const options: AssetTypeOption[] = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      // Always ensure "Vehicle" is included in options
      const hasVehicle = options.some(
        (option) => option.type.toLowerCase() === "vehicle",
      );
      if (!hasVehicle) {
        options.unshift({ type: "Vehicle", count: 0 });
      }

      setTypeOptions(options);
    } else {
      // If no assets data, still show Vehicle as an option
      setTypeOptions([{ type: "Vehicle", count: 0 }]);
    }
  }, [assetsData]);

  // Get filtered options based on input
  const getFilteredTypeOptions = (): AssetTypeOption[] => {
    const filtered = typeOptions.filter((option) =>
      option.type.toLowerCase().includes(typeInputValue.toLowerCase()),
    );

    // Always ensure Vehicle is shown if it matches the filter
    const vehicleOption = typeOptions.find(
      (opt) => opt.type.toLowerCase() === "vehicle",
    );
    if (
      vehicleOption &&
      !filtered.includes(vehicleOption) &&
      "vehicle".includes(typeInputValue.toLowerCase())
    ) {
      filtered.unshift(vehicleOption);
    }

    // If user typed something that doesn't exist, add "Add new type" option
    if (
      typeInputValue &&
      !typeOptions.some(
        (option) => option.type.toLowerCase() === typeInputValue.toLowerCase(),
      )
    ) {
      filtered.push({
        type: typeInputValue,
        count: 0,
        isCustom: true,
      });
    }

    return filtered;
  };

  const createAssetRequest = async (data: AssetFormData) => {
    // Filter out empty string values and undefined/null values
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      // Keep the value if it's not empty string, null, or undefined
      // For numbers, keep 0 as it's a valid value
      if (value !== "" && value !== null && value !== undefined) {
        acc[key as keyof AssetFormData] = value;
      }
      return acc;
    }, {} as Partial<AssetFormData>);

    const res = await api.post("/assets/create", filteredData);
    return res.data;
  };

  const { mutate: createAsset, isError } = useMutation({
    mutationFn: createAssetRequest,
    onSuccess: () => {
      onClose();
      onCreated?.();
    },
    onError: (err) => {
      console.error("Failed to create asset:", err);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTypeChange = (event: any, newValue: AssetTypeOption | null) => {
    if (newValue) {
      setForm({ ...form, type: newValue.type });
    } else {
      setForm({ ...form, type: "" });
    }
  };

  // Updated form validation - only type, model, and serial_number are required
  const isFormValid =
    form.type.trim() !== "" &&
    form.model.trim() !== "" &&
    form.serial_number.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    createAsset(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create New Asset</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        {isError && (
          <Alert severity="error">Failed to create asset. Try again.</Alert>
        )}

        <Autocomplete
          options={getFilteredTypeOptions()}
          getOptionLabel={(option) => option.type}
          value={typeOptions.find((opt) => opt.type === form.type) || null}
          onChange={handleTypeChange}
          inputValue={typeInputValue}
          onInputChange={(event, newInputValue) => {
            setTypeInputValue(newInputValue);
          }}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              required
              label="Asset Type"
              placeholder="Search or add new type..."
              helperText="Start typing to search existing types or add a new one"
            />
          )}
          renderOption={(props, option) => (
            <li {...props}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                }}
              >
                {option.isCustom ? (
                  <>
                    <AddIcon fontSize="small" color="primary" />
                    <span>Add "{option.type}" as new type</span>
                  </>
                ) : (
                  <>
                    <span style={{ flexGrow: 1 }}>{option.type}</span>
                    <Chip
                      label={`${option.count} asset${option.count !== 1 ? "s" : ""}`}
                      size="small"
                      variant="outlined"
                    />
                  </>
                )}
              </div>
            </li>
          )}
          filterOptions={(options) => options} // We handle filtering manually
        />

        {/* Show tag field only for vehicles */}
        {isVehicleType && (
          <TextField
            label="Tag"
            name="tag"
            value={form.tag}
            onChange={handleChange}
          />
        )}

        <TextField
          required
          label="Model"
          name="model"
          value={form.model}
          onChange={handleChange}
        />

        <TextField
          required
          label="Serial Number"
          name="serial_number"
          value={form.serial_number}
          onChange={handleChange}
        />

        <TextField
          label="Production Year"
          name="production_year"
          type="number"
          value={form.production_year}
          onChange={handleChange}
        />

        {/* Show chassis number field only for vehicles */}
        {isVehicleType && (
          <TextField
            label="Chassis Number"
            name="chassis_number"
            value={form.chassis_number}
            onChange={handleChange}
          />
        )}

        {/* Show plate number field only for vehicles */}
        {isVehicleType && (
          <TextField
            label="Plate Number"
            name="plate_number"
            value={form.plate_number}
            onChange={handleChange}
          />
        )}

        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />

        <TextField
          label="Geolocation"
          name="geolocation"
          value={form.geolocation}
          onChange={handleChange}
        />

        <TextField
          label="Note"
          name="note"
          value={form.note}
          onChange={handleChange}
        />

        <TextField
          select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          {Object.values(AssetStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Warranty Expiry"
          name="warranty_expiry"
          type="date"
          value={form.warranty_expiry}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Maintenance Expiry"
          name="maintenance_expiry"
          type="date"
          value={form.maintenance_expiry}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Last Service"
          name="last_service"
          type="date"
          value={form.last_service}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Next Service"
          name="next_service"
          type="date"
          value={form.next_service}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        {/* Owner ID field is removed - it's now handled automatically */}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
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
};

export default CreateAssetForm;
