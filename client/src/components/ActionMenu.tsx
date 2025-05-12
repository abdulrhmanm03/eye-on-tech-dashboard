import React, { useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CreateUserForm from "./CreateUserForm";
import api from "../axios_conf";
import { useMutation } from "@tanstack/react-query";

interface Action {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

const createUserRequest = async (credentials: {
  username: string;
  password: string;
  role: string;
}) => {
  const res = await api.post("/users", credentials);
  return res.data;
};

const ActionMenu: React.FC = () => {
  const actions: Action[] = [
    {
      icon: <PersonAddIcon />,
      name: "Create User",
      onClick: () => setCreateOpen(true),
    },
    {
      icon: <EditIcon />,
      name: "Edit User",
      onClick: () => alert("Edit User"),
    },
    {
      icon: <DeleteIcon />,
      name: "Delete User",
      onClick: () => alert("Delete User"),
    },
  ];

  const [createOpen, setCreateOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: createUserRequest,
    onError: (error) => {
      console.error("Failed to create user:", error);
    },
  });

  const handleCreateUser = (
    username: string,
    password: string,
    role: string,
  ) => {
    mutation.mutate({ username, password, role });
  };
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
      <CreateUserForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateUser}
      />
    </>
  );
};

export default ActionMenu;
