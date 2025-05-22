import { useState } from "react";
import { Avatar, Box, Popover, Typography, Button } from "@mui/material";
import ChangePasswordForm from "../components/ChangePasswordForm";
import BackupDatabaseButton from "./BackupDatabaseButton";
import UserRole from "../enums/UserRoles";
import RestoreDatabaseButton from "./RestoreDatabaseButton";
import LogoutButton from "./LogoutButton";

interface ProfileMenuProps {
  username: string;
  userId: string;
  role: string;
}

export default function ProfileMenu({
  username,
  userId,
  role,
}: ProfileMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDialogOpen = () => {
    setDialogOpen(true);
    handleClose();
  };

  const isPrivilegedUser =
    role == UserRole.supervisor || role == UserRole.administrator;

  const isSupervisor = role == UserRole.supervisor;

  return (
    <Box sx={{ position: "absolute", top: 16, right: 16 }}>
      <Avatar
        onClick={handleClick}
        sx={{ bgcolor: "#1976d2", cursor: "pointer" }}
      >
        {username.charAt(0).toUpperCase()}
      </Avatar>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle1" gutterBottom>
            {username}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            ID: {userId}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Role: {role}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleDialogOpen}
            sx={{ mt: 1 }}
          >
            Change Password
          </Button>
          {isPrivilegedUser && <BackupDatabaseButton />}
          {isSupervisor && <RestoreDatabaseButton />}
          <LogoutButton />
        </Box>
      </Popover>

      <ChangePasswordForm
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}
