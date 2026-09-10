import "./App.css"

import {Routes, Route} from "react-router-dom"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegistrationPage from "./pages/RegistrationPage"
import MyEventsPage from "./pages/MyEventsPage"
import NotFoundPage from "./pages/NotFoundPage"
import CreateEventPage from "./pages/CreateEventPage"
import DetailPage from "./pages/DetailPage"

import Header from "./components/Header"

function App() {
  return (

    <>
    <Header />

    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegistrationPage />} />
      <Route path='/my-events' element={<MyEventsPage />} />
      <Route path='/create-event' element={<CreateEventPage />} />
      <Route path='/events/:id' element={<DetailPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
    </>

  )
  
}

export default App
