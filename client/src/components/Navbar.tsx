import { Paper, Typography } from "@mui/material";

type NavbarProps = {
  options: string[];
  view: string;
  setView: (view: string) => void;
};

export default function Navbar({ options, view, setView }: NavbarProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        p: 1,
        mb: 2,
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: "background.paper",
      }}
    >
      {options.map((label) => (
        <Typography
          key={label}
          variant="body2"
          onClick={() => setView(label)}
          sx={{
            cursor: "pointer",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.8rem",
            fontWeight: view === label ? "bold" : "normal",
            backgroundColor: view === label ? "primary.light" : "transparent",
            color: view === label ? "white" : "inherit",
            "&:hover": {
              backgroundColor: "primary.light",
              color: "white",
            },
          }}
        >
          {label}
        </Typography>
      ))}
    </Paper>
  );
}
