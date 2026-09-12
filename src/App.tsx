import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate, Outlet,  } from 'react-router-dom';
        
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import MyEventsPage from "./pages/MyEventsPage";
import CreateEventPage from "./pages/CreateEventPage";
import DetailPage from "./pages/DetailPage";
import NotFoundPage from "./pages/NotFoundPage";

import Header from "./components/Header"

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
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegistrationPage />} />
      <Route path="my-events" element={<MyEventsPage />} />
      <Route path="create-event" element={<CreateEventPage />} />
      <Route path="events/:id" element={<DetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
)

export default function App() {
  return <RouterProvider router={router} />;
}
