import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../modules/posts/pages/Home";
import PostDetails from "../modules/posts/pages/PostDetails";
import AddPost from "../modules/posts/pages/AddPost";
import EditPost from "../modules/posts/pages/EditPost";
import MyPosts from "../modules/posts/pages/MyPosts";
import Login from "../modules/auth/pages/Login";
import Signup from "../modules/auth/pages/Signup";
import ProtectedRoute from "../components/common/ProtectedRoute";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "",
          element: <Home />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "my-post/:userId",
          element: (
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          ),
        },
        {
          path: "add-post",
          element: (
            <ProtectedRoute>
              <AddPost />
            </ProtectedRoute>
          ),
        },
        {
          path: "edit-post/:id",
          element: (
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          ),
        },
        {
          path: ":id",
          element: <PostDetails />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
