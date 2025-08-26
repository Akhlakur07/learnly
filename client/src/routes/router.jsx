import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import Home from "../pages/General/Home";
import Register from "../pages/Authentication/Resgister";
import Login from "../pages/Authentication/Login";
import StudentProfile from "../pages/Profile/StudentProfile";
import InstructorProfile from "../pages/Profile/InstructorProfile";
import PrivateRoute from "../context/PrivateRoute";
import AddCourses from "../pages/Instructor/AddCourses";
import AllCourses from "../pages/General/AllCourses";
import CourseDetails from "../pages/Student/CourseDetails";
import ContinueCourse from "../pages/Student/ContinueCourse";
import CreatedCourses from "../pages/Instructor/CreatedCourses";
import InstructorCourseDetails from "../pages/Instructor/InstructorCourseDetails";
import Reviews from "../pages/Instructor/Reviews";

const router = createBrowserRouter([
  {
    path: "/",
    loader: () => fetch("https://server-blush-two-79.vercel.app/users"),
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
        ),
      },
      {
        path: "/courses",
        Component: AllCourses,
      },
      {
        path: "/courses/:id",
        element: (
          <PrivateRoute>
            <CourseDetails></CourseDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/continue/:id",
        element: (
          <PrivateRoute>
            <ContinueCourse></ContinueCourse>
          </PrivateRoute>
        ),
      },
      {
        path: "/my-courses",
        element: (
          <PrivateRoute>
            <CreatedCourses></CreatedCourses>
          </PrivateRoute>
        ),
      },
      {
        path: "/instructor/courses/:id",
        element: (
          <PrivateRoute>
            <InstructorCourseDetails></InstructorCourseDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/courses/reviews/:id",
        element: (
          <PrivateRoute>
            <Reviews></Reviews>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
