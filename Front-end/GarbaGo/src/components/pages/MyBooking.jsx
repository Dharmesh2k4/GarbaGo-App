import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ useNavigate for redirection

  useEffect(() => { document.title = "My Bookings | Eventify"; }, []);

  useEffect(() => {
    const token = localStorage.getItem('garbagoToken');
    const role = localStorage.getItem('garbagoRole');

    if (!token || role !== 'user') {
      toast.error('Access denied! User only.', { position: 'top-right' });
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("garbagoToken");
        const res = await fetch("http://localhost:3000/api/booking/myBookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.status === "success") setBookings(data.bookedEvents);
        else toast.error(data.message || "Failed to fetch bookings");
      } catch (err) {
        console.error(err);
        toast.error("Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!bookings.length) return <p className="text-center py-10">No bookings yet</p>;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="max-w-5xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Booked Events</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              {/* Banner */}
              {b.event.banner && (
                <img
                  src={b.event.banner}
                  alt={b.event.eventName}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{b.event.eventName}</h2>
                <p><strong>Date:</strong> {new Date(b.event.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {b.event.time}</p>
                <p><strong>Place:</strong> {b.event.place}</p>
                <p><strong>Amount Paid:</strong> ₹{b.amountPaid}</p>
                <p className="mt-2 text-gray-500 text-sm">Organizer: {b.event.organizer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MyBookings;
