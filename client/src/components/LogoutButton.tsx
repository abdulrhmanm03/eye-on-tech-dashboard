import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Confirm from "./Confirm"; // Adjust path as needed

export default function LogoutButton() {
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        color="error"
        onClick={() => setOpenConfirm(true)}
        sx={{ mt: 1 }}
      >
        Log Out
      </Button>

      <Confirm
        open={openConfirm}
        message="Are you sure you want to log out?"
        onConfirm={handleLogout}
        onCancel={() => setOpenConfirm(false)}
      />
    </>
  );
}
