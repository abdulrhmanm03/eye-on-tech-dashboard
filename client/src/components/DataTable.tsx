import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import api from "../axios_conf";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UserDetails from "./UserDetails";
import TicketDetails from "./TicketDetails";
import AssetDetails from "./AssetDetails";

type Props = {
  view: string;
};

const fetchData = async (endpoint: string) => {
  const res = await api.get(`/${endpoint.toLowerCase()}/`);
  return res.data;
};

export default function DataTable({ view }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: [view],
    queryFn: () => fetchData(view),
  });

  const keys =
    Array.isArray(data) && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <>
      {isLoading && <Typography>Loading...</Typography>}
      {isError && (
        <Typography color="error">
          Failed to fetch {view.toLowerCase()}.
        </Typography>
      )}
      {!isLoading && Array.isArray(data) && (
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                {keys.map((key) => (
                  <TableCell
                    key={key}
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {key.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: any) => (
                <TableRow
                  key={row.id}
                  hover
                  selected={selectedId === row.id}
                  onClick={() => {
                    setSelectedId(row.id);
                    const v = view.toLowerCase();
                    if (v === "users") {
                      setSelectedUser(row);
                      setDetailsOpen(true);
                    } else if (v === "tickets") {
                      setSelectedTicket(row);
                      setDetailsOpen(true);
                    } else if (v === "assets") {
                      setSelectedAsset(row);
                      setDetailsOpen(true);
                    }
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {keys.map((key) => (
                    <TableCell key={key}>
                      {key === "password"
                        ? `${row[key]?.slice(0, 10)}...`
                        : String(row[key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedUser && (
        <UserDetails
          open={detailsOpen}
          user={selectedUser}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
      {selectedUser && view.toLowerCase() === "users" && (
        <UserDetails
          open={detailsOpen}
          user={selectedUser}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {selectedTicket && view.toLowerCase() === "tickets" && (
        <TicketDetails
          open={detailsOpen}
          ticket={selectedTicket}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedTicket(null);
          }}
        />
      )}

      {selectedAsset && view.toLowerCase() === "assets" && (
        <AssetDetails
          open={detailsOpen}
          asset={selectedAsset}
          onClose={() => {
            setDetailsOpen(false);
            setSelectedAsset(null);
          }}
        />
      )}
    </>
  );
}
