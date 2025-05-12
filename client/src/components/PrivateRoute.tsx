import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
    children: React.JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
    const { isAuthenticated } = useAuth();

    // If not logged in, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If logged in, render the page
    return children;
}
