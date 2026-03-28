import { createBrowserRouter } from "react-router";
import Dashboard from "../Features/Home/pages/Dashboard";
import Chat from "../Features/Chat/pages/Chat";
import Leaderboard from "../Features/Leaderboard/pages/Leaderboard";
import Protected from "../Features/Auth/component/Protected";
import Login from "../Features/Auth/pages/Login";
import Register from "../Features/Auth/pages/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Protected><Dashboard /></Protected>
    },
    {
        path: "/chat",
        element: <Protected><Chat /></Protected>
    },
    {
        path: "/leaderboard",
        element: <Protected><Leaderboard /></Protected>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])
