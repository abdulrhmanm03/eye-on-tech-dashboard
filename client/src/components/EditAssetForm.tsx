import React, { useEffect, useState } from "react";
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

interface EditAssetFormProps {
  open: boolean;
  onClose: () => void;
  asset: any;
  onUpdated?: () => void;
}

interface AssetTypeOption {
  type: string;
  count: number;
  isCustom?: boolean;
}

const EditAssetForm: React.FC<EditAssetFormProps> = ({
  open,
  onClose,
  asset,
  onUpdated,
}) => {
  const [form, setForm] = useState({ ...asset });

  const [typeOptions, setTypeOptions] = useState<AssetTypeOption[]>([]);
  const [typeInputValue, setTypeInputValue] = useState("");

  // Refill form when asset changes
  useEffect(() => {
    setForm({ ...asset });
  }, [asset]);

  const isVehicleType = form.type?.toLowerCase() === "vehicle";

  const { data: assetsData } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/assets");
      return res.data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (assetsData) {
      const typeCount: Record<string, number> = {};
      assetsData.forEach((a: any) => {
        if (a.type) {
          typeCount[a.type] = (typeCount[a.type] || 0) + 1;
        }
      });

      const options: AssetTypeOption[] = Object.entries(typeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count);

      if (!options.some((opt) => opt.type.toLowerCase() === "vehicle")) {
        options.unshift({ type: "Vehicle", count: 0 });
      }

      setTypeOptions(options);
    } else {
      setTypeOptions([{ type: "Vehicle", count: 0 }]);
    }
  }, [assetsData]);

  const getFilteredTypeOptions = (): AssetTypeOption[] => {
    const filtered = typeOptions.filter((option) =>
      option.type.toLowerCase().includes(typeInputValue.toLowerCase()),
    );

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

  const updateAssetRequest = async (data: any) => {
    const filteredData = Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Partial<typeof asset>,
    );

    const res = await api.put(`/assets/${asset.id}`, filteredData);
    return res.data;
  };

  const { mutate: updateAsset, isError } = useMutation({
    mutationFn: updateAssetRequest,
    onSuccess: () => {
      onClose();
      onUpdated?.();
    },
    onError: (err) => {
      console.error("Failed to update asset:", err);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTypeChange = (event: any, newValue: AssetTypeOption | null) => {
    setForm({ ...form, type: newValue?.type || "" });
  };

  const isFormValid =
    form.type?.trim() !== "" &&
    form.model?.trim() !== "" &&
    form.serial_number?.trim() !== "";

  const handleSubmit = () => {
    if (!isFormValid) return;
    updateAsset(form);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Asset</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, p: 3 }}
      >
        {isError && (
          <Alert severity="error">Failed to update asset. Try again.</Alert>
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
                      label={`${option.count} asset${
                        option.count !== 1 ? "s" : ""
                      }`}
                      size="small"
                      variant="outlined"
                    />
                  </>
                )}
              </div>
            </li>
          )}
          filterOptions={(options) => options}
        />

        {isVehicleType && (
          <TextField
            label="Tag"
            name="tag"
            value={form.tag || ""}
            onChange={handleChange}
          />
        )}

        <TextField
          required
          label="Model"
          name="model"
          value={form.model || ""}
          onChange={handleChange}
        />

        <TextField
          required
          label="Serial Number"
          name="serial_number"
          value={form.serial_number || ""}
          onChange={handleChange}
        />

        <TextField
          label="Production Year"
          name="production_year"
          type="number"
          value={form.production_year || ""}
          onChange={handleChange}
        />

        {isVehicleType && (
          <>
            <TextField
              label="Chassis Number"
              name="chassis_number"
              value={form.chassis_number || ""}
              onChange={handleChange}
            />
            <TextField
              label="Plate Number"
              name="plate_number"
              value={form.plate_number || ""}
              onChange={handleChange}
            />
          </>
        )}

        <TextField
          label="Location"
          name="location"
          value={form.location || ""}
          onChange={handleChange}
        />

        <TextField
          label="Geolocation"
          name="geolocation"
          value={form.geolocation || ""}
          onChange={handleChange}
        />

        <TextField
          label="Note"
          name="note"
          value={form.note || ""}
          onChange={handleChange}
        />

        <TextField
          select
          label="Status"
          name="status"
          value={form.status || ""}
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
          value={form.warranty_expiry || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Maintenance Expiry"
          name="maintenance_expiry"
          type="date"
          value={form.maintenance_expiry || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Last Service"
          name="last_service"
          type="date"
          value={form.last_service || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Next Service"
          name="next_service"
          type="date"
          value={form.next_service || ""}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAssetForm;
