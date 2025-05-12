import PrivateRoute from "./components/PrivateRoute";
import MainPage from "./pages/Home";
import LoginForm from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <MainPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
