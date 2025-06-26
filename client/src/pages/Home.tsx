import { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import ActionMenu from "../components/ActionMenu";
import Navbar from "../components/Navbar";
import DataTable from "../components/main_data_table/DataTable";
import ProfileMenu from "../components/ProfileMenu";
import { useAuth } from "../context/AuthContext";
import UserRole from "../enums/UserRoles";

export default function MainPage() {
  const { username, role, id } = useAuth();

  // Define available options based on role
  const getAvailableOptions = () => {
    if (role === UserRole.supervisor || role === UserRole.administrator) {
      return ["Users", "Tickets", "Assets", "Tasks"];
    }
    return ["Tickets", "Assets", "Tasks"];
  };

  const availableOptions = getAvailableOptions();
  const [view, setView] = useState(availableOptions[0]);

  // Update view if current view is not available for the user's role
  useEffect(() => {
    if (!availableOptions.includes(view)) {
      setView(availableOptions[0]);
    }
  }, [role, view, availableOptions]);

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
        {availableOptions.length > 1 && (
          <Navbar options={availableOptions} view={view} setView={setView} />
        )}
        <DataTable view={view} />
      </Container>

      {/* Fixed Bottom-Right Action Menu */}
      <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1100 }}>
        <ActionMenu />
      </Box>
    </Box>
  );
}
