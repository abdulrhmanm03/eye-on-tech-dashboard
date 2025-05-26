import React, { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import CreateUserForm from "./CreateUserForm";
import CreateTicketForm from "./CreateTicketForm";
import CreateAssetForm from "./CreateAssetForm"; // ✅ Import form and type
import { useQueryClient } from "@tanstack/react-query";

const ActionMenu: React.FC = () => {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [createAssetOpen, setCreateAssetOpen] = useState(false); // ✅ New state

  const queryClient = useQueryClient();

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
      onClick: () => setCreateAssetOpen(true), // ✅ Hook into state
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
          setCreateAssetOpen(false);
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      />

      {/* Create Ticket Dialog */}
      <CreateTicketForm
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
        onCreated={() => {
          setCreateAssetOpen(false);
          queryClient.invalidateQueries({ queryKey: ["tickets"] });
        }}
      />

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
