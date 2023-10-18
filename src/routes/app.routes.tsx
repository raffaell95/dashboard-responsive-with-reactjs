import { createBrowserRouter } from "react-router-dom";
import List from "../pages/List";
import Dashboard from "../pages/Dashboard";
import SignIn from "../pages/SignIn";
import Layout from "../components/Layout";
import Private from "./Private";


const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/dashboard",
                element: <Private><Dashboard /></Private>
            },
            {
                path: "/list/:moviment_type",
                element: <Private><List /></Private>
            },
        ]
    },
    {
        path: '/',
        element: <SignIn />
    },
])

export default router