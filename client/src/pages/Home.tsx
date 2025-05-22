import { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import ActionMenu from "../components/ActionMenu";
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
import ProfileMenu from "../components/ProfileMenu";
import { useAuth } from "../context/AuthContext";

export default function MainPage() {
  const [view, setView] = useState("Users");

  const { username, role, id } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Fixed Top-Right Profile Menu */}
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: 1100 }}>
        <ProfileMenu username={username} userId={id} role={role} />
      </Box>

      {/* Page Content */}
      <Container maxWidth="md" sx={{ pt: 10, pb: 10 }}>
        <Typography variant="h4" gutterBottom align="center">
          {view} List
        </Typography>
        <Navbar
          options={["Users", "Tickets", "Assets"]}
          view={view}
          setView={setView}
        />
        <DataTable view={view} />
      </Container>

      {/* Fixed Bottom-Right Action Menu */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1100 }}>
        <ActionMenu />
      </Box>
    </Box>
  );
}
