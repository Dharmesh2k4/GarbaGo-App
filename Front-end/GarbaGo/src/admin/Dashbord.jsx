import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";

const Dashboard = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => { document.title = "Admin Dashbord"; }, []);

    useEffect(() => {
        const token = localStorage.getItem("garbagoToken");
        const role = localStorage.getItem("garbagoRole");

        if (!token) {
            navigate("/login");
        } else if (role !== "admin") {
            navigate("/home");
        }
    }, [navigate]);

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem("garbagoToken");
                const res = await fetch("http://localhost:3000/api/event/getAllEvents", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // if backend checks auth
                    },
                });
                const data = await res.json();
                if (data.status === "success") {
                    setEvents(data.data);
                } else {
                    console.error("Error fetching events:", data.message);
                }
            } catch (err) {
                console.error("Error fetching events:", err);
            }
        };

        fetchEvents();
    }, []);

    const handleCardClick = (eventId) => {
        navigate(`/eventDetails/${eventId}`);
    };

    return (
        <div className="p-5">
            {/* ✅ Title before cards */}
            <h1 className="text-3xl font-bold mb-6 text-center">
                Organized Events
            </h1>

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div
                            key={event._id}
                            onClick={() => handleCardClick(event._id)}
                            className="cursor-pointer"
                        >
                            <EventCard event={event} />
                        </div>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">
                        No events found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;