import { Button } from "@mui/material";
import api from "../axios_conf";

export default function RestoreDatabaseButton() {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploaded_db", file);

    try {
      await api.post("/db/restore", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Database restored successfully.");
    } catch (error) {
      console.error("Restore failed:", error);
      alert("Database restore failed.");
    }
  };

  const handleClick = () => {
    document.getElementById("restore-db-input")?.click();
  };

  return (
    <>
      <input
        id="restore-db-input"
        type="file"
        accept=".db"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button variant="outlined" fullWidth onClick={handleClick} sx={{ mt: 1 }}>
        Restore Database
      </Button>
    </>
  );
}
