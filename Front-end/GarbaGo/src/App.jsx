import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SignUp from './components/pages/SignUp'
import OTP from './components/pages/OTP'
import HomeScreen from './components/pages/HomeScreen'
import Dashbord from './admin/Dashbord'
import EventForm from './admin/EventForm'
import EventDetails from './components/pages/EventDetails'
import EventCheckOut from './components/pages/EventCheckOut'
import ManageEvent from './admin/ManageEvent'
import Payment from './components/pages/Payment'
import MyBookings from './components/pages/MyBooking'
import AdminEvents from './admin/AdminEvents'
import NotFound from './components/pages/NotFound'

function App() {

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <><Navbar /><SignUp /><Footer /></>
    },
    {
      path: '/login',
      element: <><Navbar /><Login /><Footer /></>
    },
    {
      path: '/otp',
      element: <><Navbar /><OTP /><Footer /></>
    },
    {
      path: '/home',
      element: <><Navbar /><HomeScreen /><Footer /></>
    },
    {
      path: '/admin/dashboard',
      element: <><Navbar /><Dashbord /><Footer /></>
    },
    {
      path: '/organizeEvent',
      element: <><Navbar /><EventForm /><Footer /></>
    },
    {
      path: '/eventDetails/:eventId',
      element: <><Navbar /><EventDetails /><Footer /></>
    },
    {
      path: '/manageEvent',
      element: <><Navbar /><ManageEvent /><Footer /></>
    },
    {
      path: '/bookEvent/:eventId',
      element: <><Navbar /><EventCheckOut /><Footer /></>
    },
    {
      path: "/payment/:eventId",
      element:  <><Navbar /><Payment /><Footer /></>
    },
    {
      path: "/mybooking",
      element:  <><Navbar /><MyBookings /><Footer /></>
    },
    {
      path: "/bookedEvents",
      element: <><Navbar /><AdminEvents /><Footer /></>
    },
    {
      path: "*",
      element: <NotFound/>
    },

  ]);

  return (
    <>
      <RouterProvider router={routes} />
    </>
  )
}

export default App
