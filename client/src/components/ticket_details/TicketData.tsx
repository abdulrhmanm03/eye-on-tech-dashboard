import { Typography, Link, Box } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../axios_conf";
import UserDetails from "../UserDetails";
import AssetDetails from "../asset_details/AssetDetails";

type Props = {
  ticket: any;
};

const preferredOrder = [
  "id",
  "owner_id",
  "asset_id",
  "status",
  "creation_date",
  "description",
];

// Keys to exclude from display
const excludedKeys = ["handlers"];

export default function TicketData({ ticket }: Props) {
  const [owners, setOwners] = useState<Record<number, string>>({});
  const [ownerData, setOwnerData] = useState<Record<number, any>>({});
  const [assets, setAssets] = useState<Record<number, any>>({});
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [assetDetailsOpen, setAssetDetailsOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const keys = Object.keys(ticket);

  // Filter out excluded keys
  const filteredKeys = keys.filter((key) => !excludedKeys.includes(key));

  const sortedKeys = [
    ...preferredOrder.filter((key) => filteredKeys.includes(key)),
    ...filteredKeys.filter((k) => !preferredOrder.includes(k)).sort(),
  ];

  useEffect(() => {
    const fetchOwner = async (id: number) => {
      if (owners[id]) return;
      try {
        const res = await api.get(`/users/${id}`);
        setOwners((prev) => ({ ...prev, [id]: res.data.username }));
        setOwnerData((prev) => ({ ...prev, [id]: res.data }));
      } catch {
        setOwners((prev) => ({ ...prev, [id]: `User ${id}` }));
      }
    };

    const fetchAsset = async (id: number) => {
      if (assets[id]) return;
      try {
        const res = await api.get(`/assets/${id}`);
        setAssets((prev) => ({ ...prev, [id]: res.data }));
      } catch {
        setAssets((prev) => ({
          ...prev,
          [id]: { type: null, model: `Asset ${id}` },
        }));
      }
    };

    if (ticket.owner_id) fetchOwner(ticket.owner_id);
    if (ticket.asset_id) fetchAsset(ticket.asset_id);
  }, [ticket.owner_id, ticket.asset_id]);

  const handleOwnerClick = (id: number) => {
    const user = ownerData[id];
    if (user) {
      setSelectedUser(user);
      setUserDetailsOpen(true);
    }
  };

  const handleUserDetailsClose = () => {
    setSelectedUser(null);
    setUserDetailsOpen(false);
  };

  const handleAssetClick = (id: number) => {
    const asset = assets[id];
    if (asset) {
      setSelectedAsset(asset);
      setAssetDetailsOpen(true);
    }
  };

  const handleAssetDetailsClose = () => {
    setSelectedAsset(null);
    setAssetDetailsOpen(false);
  };

  const renderValue = (key: string) => {
    const value = ticket[key];
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return null;
    }

    if (key === "owner_id") {
      const name = owners[value] || value;
      return ownerData[value] ? (
        <Link
          component="button"
          onClick={() => handleOwnerClick(value)}
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "primary.main",
            "&:hover": {
              color: "primary.dark",
            },
          }}
        >
          {name}
        </Link>
      ) : (
        name
      );
    }

    if (key === "asset_id") {
      const asset = assets[value];
      const label = asset?.type || asset?.model || `Asset ${value}`;
      return asset ? (
        <Link
          component="button"
          onClick={() => handleAssetClick(value)}
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            color: "primary.main",
            "&:hover": {
              color: "primary.dark",
            },
          }}
        >
          {label}
        </Link>
      ) : (
        label
      );
    }

    return String(value);
  };

  const formatLabel = (key: string) => {
    if (key === "owner_id") return "Owner";
    if (key === "asset_id") return "Asset";
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <>
      <Box>
        {sortedKeys.map((key) => {
          const value = renderValue(key);
          if (!value) return null;
          return (
            <Typography key={key} variant="body1" sx={{ mb: 1 }}>
              <strong>{formatLabel(key)}:</strong> {value}
            </Typography>
          );
        })}
      </Box>
      {selectedUser && (
        <UserDetails
          open={userDetailsOpen}
          user={selectedUser}
          onClose={handleUserDetailsClose}
        />
      )}
      {selectedAsset && (
        <AssetDetails
          open={assetDetailsOpen}
          asset={selectedAsset}
          onClose={handleAssetDetailsClose}
        />
      )}
    </>
  );
}
