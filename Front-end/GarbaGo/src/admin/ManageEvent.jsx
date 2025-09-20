import React, { useEffect, useState } from 'react';
import { IoMdSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';

const ManageEvents = () => {
    const [eventsList, setEventsList] = useState([]);
    const navigate = useNavigate();

    const goToEvent = (id) => {
        navigate(`/eventDetails/${id}`);
    };
    useEffect(() => { document.title = "Manage Events | Eventify"; }, []);

    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (token) {
            if (role === 'user') navigate('/home');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Helper to format date & time
    const formatDateTime = (isoString) => {
        if (!isoString) return '';
        const date = new Date(isoString);

        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US', timeOptions);

        return `${formattedDate} | ${formattedTime}`;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            const token = localStorage.getItem('garbagoToken');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3000/api/event/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.status === 401) {
                    console.error("Unauthorized: Invalid or missing token");
                    return;
                }

                const result = await res.json();

                // Backend sends events in result.data
                if (result.status === 'success') {
                    setEventsList(result.data || []);
                } else {
                    console.error("Failed to fetch events:", result.message);
                }
            } catch (e) {
                console.error("Error fetching events:", e);
            }
        };

        fetchEvents();
    }, []);


    return (
        <div className='px-4 md:px-24 mt-10'>
            <h1 className='text-3xl md:text-4xl font-bold'>Events</h1>

            {/* Navbar */}
            <div className="navbar mt-8 flex items-center justify-between">
                {/* Hide search + filter on mobile */}
                <div className="div1 hidden md:flex items-center gap-10">
                    <div className="search flex items-center gap-5">
                        <input
                            className='border border-purple-500 w-[240px] h-[46px] p-2 rounded-md'
                            type="text"
                            placeholder='Search Your Event'
                        />
                        <button className='bg-purple-600 hover:bg-purple-400 text-white p-1 rounded-md w-[50px] h-[46px] flex justify-center items-center'>
                            <IoMdSearch size={30} />
                        </button>
                    </div>
                    <div className="filter">
                        <select className='border outline-none border-purple-500 hover:bg-purple-200 cursor-pointer px-1 text-purple-500 font-bold p-1 h-[46px] w-[140px] rounded-md'>
                            <option value="">Newest</option>
                            <option value="">Oldest</option>
                            <option value="">Published</option>
                            <option value="">Unpublished</option>
                        </select>
                    </div>
                </div>

                {/* Always show New Event button */}
                <div className="createEvent">
                    <Link
                        to={'/organizeEvent'}
                        className='bg-purple-500 hover:bg-purple-400 cursor-pointer text-white font-bold p-2 md:p-3 px-3 md:px-4 h-[40px] w-[120px] md:w-[140px] rounded-md text-center block'
                    >
                        New Event
                    </Link>
                </div>
            </div>

            {/* Event List */}
            <div className="events space-y-3 mt-12 w-full">
                {eventsList.length > 0 ? eventsList.map((event) => (
                    <div
                        key={event._id}
                        className="relative group border border-purple-300 p-4 rounded-md"
                    >
                        {/* Desktop → row, Mobile → column */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group-hover:blur-sm transition duration-300 relative z-0">
                            <img
                                className='w-full md:w-[150px] h-[150px] object-contain rounded-md'
                                src={event.banner}
                                alt={event.eventName}
                            />
                            <div className="flex flex-col justify-around  flex-1 text-center md:text-left">
                                <h4 className="font-bold">{event.eventName}</h4>
                                <p><b>{event.status}</b></p>
                                <p>{event.place}</p>
                                <p className="font-bold text-md md:text-lg">{formatDateTime(event.date)}</p>
                            </div>
                        </div>

                        <div className="link absolute top-0 left-0 z-10 w-full h-full hidden group-hover:flex items-center justify-center transition duration-300 bg-white/70">
                            <p className="text-xl font-bold text-purple-500">
                                <button onClick={() => goToEvent(event._id)}>Edit</button> /{" "}
                                <button onClick={() => goToEvent(event._id)}>Manage Event</button>
                            </p>
                        </div>
                    </div>
                )) : (
                    <h1 className='text-center font-bold text-[20px] md:text-[30px] pt-10'>No Events Published Yet</h1>
                )}
            </div>
        </div>
    )
}

export default ManageEvents;
