import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/Home";
import Register from "../pages/Resgister";
import Login from "../pages/Login";
import StudentProfile from "../pages/Profile/StudentProfile";
import InstructorProfile from "../pages/Profile/InstructorProfile";
import PrivateRoute from "../context/PrivateRoute";
import AddCourses from "../pages/AddCourses";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => fetch("http://localhost:3000/users"),
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
      {
        path: "/studentProfile",
        element: (
          <PrivateRoute>
            <StudentProfile></StudentProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/instructorProfile",
        element: (
          <PrivateRoute>
            <InstructorProfile></InstructorProfile>
          </PrivateRoute>
        ),
      },
      {
        path: "/addCourse",
        element: (
          <PrivateRoute>
            <AddCourses></AddCourses>
          </PrivateRoute>
        )
      },
    ],
  },
]);

export default router;
