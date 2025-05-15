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
import api from "../axios_conf";
import { useMutation } from "@tanstack/react-query";

// Asset creation request
const createAssetRequest = async (data: any) => {
  const res = await api.post("/assets/create", data);
  return res.data;
};

// User creation request
const createUserRequest = async (credentials: {
  username: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/users", credentials);
  return res.data;
};

const ActionMenu: React.FC = () => {
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [createAssetOpen, setCreateAssetOpen] = useState(false); // ✅ New state

  const userMutation = useMutation({
    mutationFn: createUserRequest,
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });

  const assetMutation = useMutation({
    mutationFn: createAssetRequest,
    onError: (error) => {
      console.error("Failed to create asset:", error);
    },
  });

  const handleCreateUser = (
    username: string,
    password: string,
    role: string,
  ) => {
    userMutation.mutate({ username, password, role });
  };

  const handleCreateAsset = (assetData: any) => {
    assetMutation.mutate(assetData);
  };

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
        onSubmit={handleCreateUser}
      />

      {/* Create Ticket Dialog */}
      <CreateTicketForm
        open={createTicketOpen}
        onClose={() => setCreateTicketOpen(false)}
      />

      {/* Create Asset Dialog */}
      <CreateAssetForm
        open={createAssetOpen}
        onClose={() => setCreateAssetOpen(false)}
        onSubmit={handleCreateAsset}
      />
    </>
  );
};

export default ActionMenu;
