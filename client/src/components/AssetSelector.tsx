import React, { useState, useEffect } from "react";
import { Autocomplete, TextField, Box, Typography, Chip } from "@mui/material";
import api from "../axios_conf";

interface Asset {
  id: number;
  type?: string;
  serial_number?: string;
  chassis_number?: string; // Added chassis_number
  model: string;
  tag?: string;
  // Add other asset properties as needed
}

interface AssetSelectorProps {
  value: Asset | null;
  onChange: (asset: Asset | null) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
}

const AssetSelector: React.FC<AssetSelectorProps> = ({
  value,
  onChange,
  label = "Select Asset",
  required = false,
  error = false,
  helperText,
}) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Fetch assets from API
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await api.get("/assets");
      setAssets(response.data);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Filter assets by multiple fields
  const filterAssets = (assets: Asset[], inputValue: string) => {
    if (!inputValue) return assets;

    const searchTerm = inputValue.toLowerCase();

    return assets.filter((asset) => {
      const idMatch = asset.id.toString().includes(searchTerm);
      const typeMatch = asset.type?.toLowerCase().includes(searchTerm) || false;
      const modelMatch =
        asset.model?.toLowerCase().includes(searchTerm) || false;
      const tagMatch = asset.tag?.toLowerCase().includes(searchTerm) || false;

      // Use chassis_number for Vehicles, else serial_number
      const isVehicle = asset.type?.toLowerCase() === "vehicle";
      const identifier = isVehicle ? asset.chassis_number : asset.serial_number;
      const identifierMatch =
        identifier?.toLowerCase().includes(searchTerm) || false;

      return idMatch || typeMatch || modelMatch || tagMatch || identifierMatch;
    });
  };

  // Label for each option in dropdown
  const getOptionLabel = (option: Asset) => {
    const parts = [`ID: ${option.id}`];
    if (option.type) parts.push(option.type);

    const isVehicle = option.type?.toLowerCase() === "vehicle";
    const identifier = isVehicle ? option.chassis_number : option.serial_number;
    if (identifier) parts.push(`ID#: ${identifier}`);

    return parts.join(" - ");
  };

  // Compare options with selected value
  const isOptionEqualToValue = (option: Asset, value: Asset) => {
    return option.id === value.id;
  };

  return (
    <Autocomplete
      options={assets}
      value={value}
      onChange={(event, newValue) => onChange(newValue)}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      filterOptions={(options, { inputValue }) =>
        filterAssets(options, inputValue)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={
            helperText ||
            "Search by ID, type, serial number, chassis number, model, or tag"
          }
          placeholder="Type to search assets..."
        />
      )}
      renderOption={(props, option) => {
        const isVehicle = option.type?.toLowerCase() === "vehicle";
        const identifier = isVehicle
          ? option.chassis_number
          : option.serial_number;

        return (
          <li {...props}>
            <Box
              sx={{ display: "flex", flexDirection: "column", width: "100%" }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
              >
                <Chip
                  label={`ID: ${option.id}`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                {option.type && (
                  <Chip
                    label={option.type}
                    size="small"
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
                <Typography variant="body2" fontWeight="medium">
                  {option.model}
                  {option.tag && ` (${option.tag})`}
                </Typography>
                {identifier && (
                  <Typography variant="caption" color="text.secondary">
                    {isVehicle ? "Chassis" : "Serial"}: {identifier}
                  </Typography>
                )}
              </Box>
            </Box>
          </li>
        );
      }}
      noOptionsText="No assets found"
      sx={{ minWidth: 300 }}
    />
  );
};

export default AssetSelector;
