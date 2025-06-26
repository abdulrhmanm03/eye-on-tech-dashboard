import React, { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import Fab from "@mui/material/Fab";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CreateUserForm from "./CreateUserForm";
import CreateTicketForm from "./CreateTicketForm";
import CreateAssetForm from "./CreateAssetForm";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import UserRole from "../enums/UserRoles";

const ActionMenu: React.FC = () => {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [createAssetOpen, setCreateAssetOpen] = useState(false);
  const queryClient = useQueryClient();
  const { role } = useAuth();

  const isAdminOrSupervisor =
    role === UserRole.supervisor || role === UserRole.administrator;

  // If not admin or supervisor, show only create ticket button
  if (!isAdminOrSupervisor) {
    return (
      <>
        <Fab
          color="primary"
          aria-label="Create Ticket"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          onClick={() => setCreateTicketOpen(true)}
        >
          <ConfirmationNumberIcon />
        </Fab>

        {/* Create Ticket Dialog */}
        <CreateTicketForm
          open={createTicketOpen}
          onClose={() => setCreateTicketOpen(false)}
          onCreated={() => {
            setCreateTicketOpen(false);
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
          }}
        />
      </>
    );
  }

  // Admin/Supervisor: Show full SpeedDial menu
  const actions = [
    {
      icon: <PersonAddIcon />,
      name: "Add User",
      onClick: () => setCreateUserOpen(true),
    },
    {
      icon: <ConfirmationNumberIcon />,
      name: "Create Ticket",
      onClick: () => setCreateTicketOpen(true),
    },
    {
      icon: <AddBoxIcon />,
      name: "Add Asset",
      onClick: () => setCreateAssetOpen(true),
    },
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="User Actions"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            slotProps={{ tooltip: { title: action.name } }}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>

      {/* Create User Dialog */}
      <CreateUserForm
        open={createUserOpen}
        onClose={() => setCreateUserOpen(false)}
        onCreated={() => {
          setCreateUserOpen(false);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      />

      {/* Create Ticket Dialog */}
      <CreateTicketForm
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        onCreated={() => {
          setCreateTicketOpen(false);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }}
      />

      {/* Create Asset Dialog */}
      <CreateAssetForm
        open={createAssetOpen}
        onClose={() => setCreateAssetOpen(false)}
        onCreated={() => {
          setCreateAssetOpen(false);
          queryClient.invalidateQueries({ queryKey: ["assets"] });
        }}
      />
    </>
  );
};

export default ActionMenu;
