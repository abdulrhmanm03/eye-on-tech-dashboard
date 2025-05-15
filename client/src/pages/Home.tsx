import { useState } from "react";
import { Container, Typography } from "@mui/material";
import ActionMenu from "../components/ActionMenu";
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";

export default function MainPage() {
  const [view, setView] = useState("Users");

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        {view} List
      </Typography>
      <Navbar
        options={["Users", "Tickets", "Assets"]}
        view={view}
        setView={setView}
      />
      <DataTable view={view} />
      <ActionMenu />
    </Container>
  );
}
