import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

import EventsPage from "./pages/EventsPage";
import { Login } from "./pages/LoginPage";
import MyEventsPage from "./pages/MyEventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import DetailPage from "./pages/DetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SettingsPage } from "./pages/SettingsPage";

import Header from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Layout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Navigate to="/events" replace />} />

      <Route path="events" element={<EventsPage />} />
      <Route path="events/:id" element={<DetailPage />} />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<RegisterPage />} />

      <Route
        path="create-event"
        element={
          <ProtectedRoute>
            <CreateEventPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-events"
        element={
          <ProtectedRoute>
            <MyEventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

export default function App() {
  return <RouterProvider router={router} />;
}
