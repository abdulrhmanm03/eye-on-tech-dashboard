import React, { useState } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import api from "../axios_conf";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const loginRequest = async (credentials: {
    username: string;
    password: string;
    role: string;
}) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
};

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const mutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: () => {
            login();
            navigate("/home");
        },
        onError: (error) => {
            console.error("Login failed:", error);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ username, password, role });
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
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                            labelId="role-label"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            label="Role"
                        >
                            <MenuItem value="Supervisor">Supervisor</MenuItem>
                            <MenuItem value="Administrator">
                                Administrator
                            </MenuItem>
                            <MenuItem value="Engineer">Engineer</MenuItem>
                            <MenuItem value="Technician">Technician</MenuItem>
                            <MenuItem value="Client">Client</MenuItem>
                        </Select>
                    </FormControl>
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
