import { Typography, Link, Box } from "@mui/material";
import { useState, useEffect } from "react";
import api from "../../axios_conf"; // Adjust the import path as needed
import UserDetails from "../UserDetails"; // Adjust the import path as needed
import AssetStatus from "../../enums/AssetStatus";

type Props = {
  asset: Record<string, any>;
};

export default function AssetData({ asset }: Props) {
  const [owners, setOwners] = useState<Record<number, string>>({});
  const [ownerData, setOwnerData] = useState<Record<number, any>>({});
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const fields = [
    "id",
    "owner_id",
    "type",
    "tag",
    "model",
    "serial_number",
    "production_year",
    "location",
    "warranty_expiry",
    "maintenance_expiry",
    "last_service",
    "next_service",
    "status",
  ];

  const fetchOwner = async (userId: number) => {
    if (owners[userId]) return owners[userId]; // already cached
    try {
      const response = await api.get(`/users/${userId}`);
      const username = response.data.username;
      const userData = response.data;

      // Cache both username and full user data
      setOwners((prev) => ({ ...prev, [userId]: username }));
      setOwnerData((prev) => ({ ...prev, [userId]: userData }));

      return username;
    } catch (error) {
      console.error("Failed to fetch user", userId);
      return `User ${userId}`;
    }
  };

  useEffect(() => {
    if (asset.owner_id && !owners[asset.owner_id]) {
      fetchOwner(asset.owner_id);
    }
  }, [asset.owner_id]);

  const formatKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const getFieldLabel = (key: string) => {
    // Change "Owner Id" to just "Owner" for better UX
    if (key === "owner_id") {
      return "Owner";
    }
    return formatKey(key);
  };

  const handleOwnerClick = (ownerId: number) => {
    const userData = ownerData[ownerId];
    if (userData) {
      setSelectedUser(userData);
      setUserDetailsOpen(true);
    }
  };

  const renderValue = (key: string) => {
    const value = asset[key];

    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return null;
    }

    // Handle owner_id specially - make it clickable
    if (key === "owner_id") {
      const ownerName = owners[value] || value;
      const hasOwnerData = ownerData[value];

      return hasOwnerData ? (
        <Link
          component="button"
          variant="body1"
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
          {ownerName}
        </Link>
      ) : (
        ownerName
      );
    }

    if (key === "location") {
      const location = value;
      const geo = asset["geolocation"];
      return geo ? (
        <Link
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            geo,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {location}
        </Link>
      ) : (
        location
      );
    }

    if (key === "status") {
      return (
        <Box
          component="span"
          sx={{
            color:
              {
                [AssetStatus.working]: "green",
                [AssetStatus.partially_working]: "orange",
                [AssetStatus.faulty]: "red",
                [AssetStatus.rma]: "gray",
              }[value as AssetStatus] || "inherit",
            fontWeight: 500,
          }}
        >
          {value}
        </Box>
      );
    }

    return value;
  };

  const handleUserDetailsClose = () => {
    setUserDetailsOpen(false);
    setSelectedUser(null);
  };

  return (
    <>
      <Box>
        {fields.map((key) => {
          const value = renderValue(key);
          if (!value) return null;
          return (
            <Typography variant="body1" key={key} sx={{ mb: 1 }}>
              <strong>{getFieldLabel(key)}:</strong> {value}
            </Typography>
          );
        })}
      </Box>

      {/* User Details Dialog */}
      {selectedUser && (
        <UserDetails
          open={userDetailsOpen}
          user={selectedUser}
          onClose={handleUserDetailsClose}
        />
      )}
    </>
  );
}
