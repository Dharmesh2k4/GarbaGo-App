import React, { useState, useEffect } from 'react'
import Loader from '../Loader';
import { useParams, } from 'react-router-dom';
import { Calendar, Clock, Hourglass, Users, Languages, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const EventCheckOut = () => {
    const { eventId } = useParams(); // get eventId from URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (!token || role !== 'user') {
            toast.error('Access denied! User only.', { position: 'top-right' });
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => { document.title = "Checkout | Eventify"; }, []);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem("garbagoToken") // ✅ get token

                const res = await fetch('http://localhost:3000/api/event/getEventDetails', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ eventId, token }) // replace userId dynamically
                });
                const data = await res.json();
                console.log(data)
                if (data.status === 'success') {
                    setEvent(data.data);
                }
            } catch (err) {
                console.error('Error fetching event:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    const handleBookNow = () => {
        // Navigate to Payment page and send eventId
        navigate(`/payment/${eventId}`);
    };


    if (loading) return <p className="px-4 py-6">Loading event...</p>;
    if (!event) return <p className="px-4 py-6">Event not found!</p>;

    return (
        <div className='flex items-center md:flex-row flex-col justify-center gap-10 my-[2%]'>
            <div className="w-full max-w-sm md:max-w-none md:w-auto">
                <h1 className='text-2xl font-bold'>{event.eventName} </h1>
                <div className="log">
                    <img
                        className="w- h-[180px] sm:h-[200px] rounded-md md:h-[400px] object-cover"
                        src={event.banner}
                        alt={event.eventName}
                    />
                </div>
            </div>
            <div className="right">

                <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    {/* Details Section */}
                    <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center">
                            <span className="mr-2">📅</span>
                            {new Date(event.date).toDateString()}
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">⏰</span> {event.time}
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">🎟️</span> Seats: {event.seats}
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">👤</span> Organizer: {event.organizer}
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">📍</span> {event.location}
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t mt-4 pt-3 flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-gray-800">₹{event.price} onwards</div>
                            <div className="text-green-600 text-sm font-medium">Available</div>
                        </div>
                        <button
                            onClick={handleBookNow}
                            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                        >
                            Book Now
                        </button>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default EventCheckOut