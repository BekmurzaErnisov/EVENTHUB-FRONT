import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import Header from "./components/Header";
import { ProtectedRoute } from "./components/ProtectedRoute";

const EventsPage = lazy(() => import("./pages/EventsPage"));
const MyEventsPage = lazy(() => import("./pages/MyEventsPage"));
const CreateEventPage = lazy(() => import("./pages/CreateEventPage"));
const DetailPage = lazy(() => import("./pages/DetailPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const EditEventPage = lazy(() => import("./pages/EditEventPage"));
const Login = lazy(() =>
  import("./pages/LoginPage").then(({ Login }) => ({ default: Login })),
);
const RegisterPage = lazy(() =>
  import("./pages/RegisterPage").then(({ RegisterPage }) => ({ default: RegisterPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/SettingsPage").then(({ SettingsPage }) => ({ default: SettingsPage })),
);

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
      <Route index element={<EventsPage />} />

      <Route path="events" element={<EventsPage />} />
      <Route path="events/:id" element={<DetailPage />} />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<RegisterPage />} />

      <Route
        path="events/:id/edit"
        element={
          <ProtectedRoute>
            <EditEventPage />
          </ProtectedRoute>
        }
      />

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
  return (
    <Suspense fallback={<div style={{ padding: "24px" }}>Загрузка страницы...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
