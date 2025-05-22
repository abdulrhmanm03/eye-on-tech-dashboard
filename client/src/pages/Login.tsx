import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import api from "../axios_conf";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const loginRequest = async (credentials: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", credentials);
  return res.data;
};

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginRequest,
    // components/LoginForm.tsx (your LoginForm)
    onSuccess: (data) => {
      login({
        token: data.access_token,
        username: data.username,
        role: data.role,
        id: data.id,
      });
      navigate("/home");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Username"
            type="text"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Loading..." : "Login"}
          </Button>
          {mutation.isError && (
            <Typography color="error" sx={{ mt: 2 }}>
              Login failed: {(mutation.error as any)?.message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
