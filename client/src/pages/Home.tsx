import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../axios_conf";
import ActionMenu from "../components/ActionMenu";

const fetchUsers = async () => {
  const res = await api.get("/users");
  console.log(res.data);
  return res.data;
};

export default function MainPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Users List
      </Typography>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && <Typography color="error">Failed to fetch users.</Typography>}
      {!isLoading && data && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>username</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>password</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.password}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <ActionMenu />
    </Container>
  );
}
