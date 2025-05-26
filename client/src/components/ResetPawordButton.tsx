import { useState } from "react";
import { Button } from "@mui/material";
import Confirm from "./Confirm"; // Adjust path if needed
import api from "../axios_conf";

type ResetPasswordButtonProps = {
  userId: number;
};

export default function ResetPasswordButton({
  userId,
}: ResetPasswordButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await api.post(`/users/reset_password/${userId}`);
      alert("Password reset successfully.");
    } catch (error) {
      console.error("Failed to reset password:", error);
      alert("Failed to reset password.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="warning"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        Reset Password
      </Button>

      <Confirm
        open={open}
        message="Are you sure you want to reset this user's password?"
        onCancel={() => setOpen(false)}
        onConfirm={handleResetPassword}
      />
    </>
  );
}
