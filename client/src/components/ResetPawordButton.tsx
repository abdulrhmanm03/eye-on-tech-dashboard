import { useState } from "react";
import { Button } from "@mui/material";
import Confirm from "./Confirm"; // Adjust path if needed
import axios from "axios";

type ResetPasswordButtonProps = {
  userId: number;
  onSuccess?: () => void; // Optional callback after successful reset
};

export default function ResetPasswordButton({
  userId,
  onSuccess,
}: ResetPasswordButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/reset_password/${userId}`);
      if (onSuccess) onSuccess();
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
      <Button variant="outlined" color="warning" onClick={() => setOpen(true)}>
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
