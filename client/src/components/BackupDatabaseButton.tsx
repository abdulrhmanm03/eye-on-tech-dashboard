import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import api from "../axios_conf";

export default function BackupDatabaseButton() {
  const handleBackup = async () => {
    try {
      const response = await api.get("/db/backup", {
        responseType: "blob", // Important: ensures response is handled as a file
      });

      const disposition = response.headers["content-disposition"];
      const filename =
        disposition?.split("filename=")[1]?.replace(/"/g, "") || "backup.db";

      saveAs(response.data, filename);
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Database backup failed.");
    }
  };

  return (
    <Button variant="outlined" fullWidth onClick={handleBackup} sx={{ mt: 1 }}>
      Backup Database
    </Button>
  );
}
