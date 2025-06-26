import { Typography, Box, Divider, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import UserDetails from "../UserDetails";

type Props = {
  handlers: any[];
  canManageTech: boolean;
  onDeleteTech: (tech: any) => void;
};

export default function TicketTechsTab({
  handlers,
  canManageTech,
  onDeleteTech,
}: Props) {
  const [selectedTech, setSelectedTech] = useState<any | null>(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);

  const handleTechClick = (tech: any) => {
    setSelectedTech(tech);
    setUserDetailsOpen(true);
  };

  const handleUserDetailsClose = () => {
    setUserDetailsOpen(false);
    setSelectedTech(null);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Technicians
      </Typography>
      {handlers && handlers.length > 0 ? (
        handlers.map((tech: any, index: number) => (
          <Box
            key={tech.id}
            sx={{
              mt: 2,
              mb: 2,
              pl: 2,
              borderLeft: "4px solid #1976d2",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            position="relative"
            onClick={() => handleTechClick(tech)}
          >
            <Typography variant="subtitle2">Technician {index + 1}</Typography>
            <Typography variant="body2">• ID: {tech.id}</Typography>
            <Typography variant="body2">• Username: {tech.username}</Typography>
            <Box sx={{ position: "absolute", top: 0, right: 0 }}>
              {canManageTech && (
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the tech click handler
                    onDeleteTech(tech);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      ) : (
        <Typography sx={{ mt: 1 }}>No technicians assigned.</Typography>
      )}

      {/* User Details Dialog */}
      {selectedTech && (
        <UserDetails
          open={userDetailsOpen}
          user={selectedTech}
          onClose={handleUserDetailsClose}
        />
      )}
    </>
  );
}
