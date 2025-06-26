import UserDetails from "../UserDetails";
import TicketDetails from "../ticket_details/TicketDetails";
import AssetDetails from "../asset_details/AssetDetails";
import TaskDetails from "../TaskDetails";

type Props = {
  open: boolean;
  view: string;
  row: any;
  onClose: () => void;
};

export default function DetailsDialog({ open, view, row, onClose }: Props) {
  if (!row) return null;

  switch (view.toLowerCase()) {
    case "users":
      return <UserDetails open={open} user={row} onClose={onClose} />;
    case "tickets":
      return <TicketDetails open={open} ticket={row} onClose={onClose} />;
    case "assets":
      return <AssetDetails open={open} asset={row} onClose={onClose} />;
    case "tasks":
      return <TaskDetails open={open} task={row} onClose={onClose} />;
    default:
      return null;
  }
}
