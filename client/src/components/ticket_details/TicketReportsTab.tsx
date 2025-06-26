import { Typography, Box, Divider, IconButton, Link } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../../axios_conf";
import UserDetails from "../UserDetails";

type Props = {
  reports: any[];
  canDelete: boolean;
  onDeleteReport: (report: any) => void;
};

export default function TicketReportsTab({
  reports,
  canDelete,
  onDeleteReport,
}: Props) {
  const [owners, setOwners] = useState<Record<number, string>>({});
  const [ownerData, setOwnerData] = useState<Record<number, any>>({});
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

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

    // Fetch user data for all unique created_by IDs
    const userIds = [...new Set(reports.map((report) => report.created_by))];
    userIds.forEach((id) => {
      if (id) fetchOwner(id);
    });
  }, [reports]);

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

  const renderCreatedBy = (createdById: number) => {
    const name = owners[createdById] || createdById;
    return ownerData[createdById] ? (
      <Link
        component="button"
        onClick={() => handleOwnerClick(createdById)}
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
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Reports
      </Typography>
      {reports.length > 0 ? (
        reports.map((report, index) => (
          <Box
            key={report.id}
            sx={{
              mt: 2,
              mb: 2,
              pl: 2,
              borderLeft: "4px solid #1976d2",
              position: "relative",
            }}
          >
            <Typography variant="subtitle2">Report {index + 1}</Typography>
            <Typography variant="body2">
              • Created By: {renderCreatedBy(report.created_by)}
            </Typography>
            <Typography variant="body2">
              • Created At:{" "}
              {new Date(report.created_at).toLocaleDateString("en-US", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body2">• Content: {report.content}</Typography>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
              {canDelete && (
                <IconButton onClick={() => onDeleteReport(report)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      ) : (
        <Typography sx={{ mt: 1 }}>No reports found.</Typography>
      )}

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
