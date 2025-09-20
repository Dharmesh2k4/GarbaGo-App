import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ useNavigate for redirection

  useEffect(() => {
    const token = localStorage.getItem('garbagoToken');
    const role = localStorage.getItem('garbagoRole');

    if (!token || role !== 'admin') {
      toast.error('Access denied! Admins only.', { position: 'top-right' });
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => { document.title = "Booked Events"; }, []);

  useEffect(() => {
    const fetchEventsWithBookings = async () => {
      try {
        const token = localStorage.getItem("garbagoToken");
        if (!token) return toast.error("Token missing!");

        const resEvents = await fetch("http://localhost:3000/api/booking/bookedEvents", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!resEvents.ok) throw new Error("Failed to fetch events");

        const dataEvents = await resEvents.json();
        const allEvents = dataEvents.events || [];

        console.log(allEvents);
        setEvents(allEvents);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventsWithBookings();
  }, []);

  if (loading) return <p className="text-center py-10">Loading events...</p>;
  if (events.length === 0)
    return <p className="text-center py-10 text-gray-500">No events found</p>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="px-4 md:px-12 mt-10 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Admin Dashboard - Event Tickets
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {event.banner && (
                <img
                  src={`http://localhost:3000/${event.banner.replace(/\\/g, "/")}`}
                  alt={event.eventName}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
                <p className="text-gray-600 mb-1">
                  Date: {new Date(event.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-600 mb-1">
                  Time: {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <p className="text-gray-700 mb-1">Total Seats: {event.totalSeats}</p>
                <p className="text-green-600 font-semibold mb-1">
                  Tickets Booked: {event.totalBooked || 0}
                </p>
                <p className="text-red-600 font-semibold">
                  Seats Remaining: {event.seatsRemaining || event.totalSeats}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminEvents;
