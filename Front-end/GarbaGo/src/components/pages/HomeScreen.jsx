import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import EventCard from '../EventCard';
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from '../../redux/userDetails/UserSlice';

const HomeScreen = () => {
    const navigate = useNavigate();
    const [index, setIndex] = useState(0);
    const scrollRef = useRef();
    const { name, email } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [events, setEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentEvents, setRecentEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔑 Fetch user from localStorage
        const storedUser = localStorage.getItem("garbagoUser");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                dispatch(setUserData({ name: user.name, email: user.email }));
            } catch (error) {
                console.error("Error parsing stored user:", error);
            }
        }
    }, [dispatch]);

    useEffect(() => { document.title = "Home Screen"; }, []);

    const listImages = [
        '/imgs/garba/garba1.jpg',
        '/imgs/garba/garba2.jpg',
        '/imgs/garba/garba3.jpg',
    ];

    const cardCont = [
        { title: 'Dance the Night Away!', content: 'Join the most vibrant Garba events near you. Book tickets from ₹199.' },
        { title: 'Learn Garba Moves', content: 'Step up your Garba skills with interactive tutorials and workshops.' },
        { title: 'Celebrate Together', content: 'Experience the joy of community Garba nights and events around you.' },
    ];

    const getInitials = (fullName) => {
        if (!fullName) return "";
        const parts = fullName.trim().split(" ");
        return parts.length === 1
            ? parts[0][0].toUpperCase()
            : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const imageWidth = 1340;

    const scrollToIndex = (newIndex) => {
        if (scrollRef.current) {
            const slideWidth = scrollRef.current.clientWidth; // dynamic width
            scrollRef.current.scrollTo({
                left: newIndex * slideWidth,
                behavior: "smooth",
            });
        }
    };

    const scroll = (direction) => {
        let newIndex;
        if (direction === "right") {
            newIndex = (index + 1) % listImages.length;
        } else {
            newIndex = (index - 1 + listImages.length) % listImages.length;
        }
        setIndex(newIndex);
        scrollToIndex(newIndex);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth >= 1024) { // lg and above
                const interval = setInterval(() => scroll('right'), 5000);
                return () => clearInterval(interval);
            }
        };

        const cleanup = handleScroll();
        window.addEventListener('resize', handleScroll);

        return () => {
            if (cleanup) cleanup();
            window.removeEventListener('resize', handleScroll);
        };
    }, [index]);


    // Check token & navigate
    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (token) {
            if (role === 'admin') navigate('/admin/dashboard');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // 🔑 Fetch events from backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/event/");
                const data = await res.json();
                console.log(data)
                setEvents(data.events || []); // all events
            } catch (err) {
                console.error("Error fetching events:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);



    if (loading) return <p className="px-24 py-4">Loading events...</p>;

    return (
        <>
            {/* Upper section */}
            <div className='upperPart flex items-center gap-3 md:px-24 px-3 py-4'>
                <h1 className='text-xl font-bold bg-purple-600 text-black lg:w-[60px] w-[40px] h-[40px] lg:h-[60px] flex items-center justify-center p-3 rounded-full hover:bg-purple-700 cursor-pointer'>{getInitials(name)}</h1>
                <p className='font-bold text-lg'>Welcome back, {name}</p>
            </div>

            {/* Slider */}
            <div className="slidebox flex justify-center items-center gap-4 mt-4 relative">
                {/* Left button */}
                <FaChevronCircleLeft
                    size={40}
                    className="cursor-pointer hidden lg:block"
                    onClick={() => scroll("left")}
                />

                <div
                    className={`scrollImgs flex ${window.innerWidth >= 1024 ? "overflow-x-auto scroll-smooth" : ""
                        } no-scrollbar w-full`}
                    ref={scrollRef}
                >
                    {window.innerWidth >= 1024 ? (
                        listImages.map((src, idx) => (
                            <div
                                key={idx}
                                className="relative w-full h-[400px] flex-shrink-0"
                            >
                                <img
                                    src={src}
                                    alt={`slider-${idx}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-[100px] left-5 bg-white flex flex-col justify-start gap-5 w-[400px] h-[200px] p-4 rounded-md shadow">
                                    <h1 className="text-3xl font-bold">{cardCont[idx].title}</h1>
                                    <p>{cardCont[idx].content}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Mobile / md: show only first image
                        <div className="relative w-full h-[250px] md:h-[350px] flex-shrink-0">
                            <img
                                src={listImages[0]}
                                alt={`slider-0`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-[50px] left-5 bg-white flex flex-col justify-start gap-3 w-[300px] h-[150px] p-3 hidden md:block rounded-md shadow">
                                <h1 className="text-2xl font-bold">{cardCont[0].title}</h1>
                                <p>{cardCont[0].content}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right button */}
                <FaChevronCircleRight
                    size={40}
                    className="cursor-pointer hidden lg:block"
                    onClick={() => scroll("right")}
                />
            </div>




            {/* Event Cards */}
            <div className="heroContainer md:px-24 mx-4 gap-3 py-4 mt-5 md:w-auto w-[100vw]">
                <div className="card">
                    <h1 className='md:text-4xl text-2xl font-bold'>Upcoming Garba Events</h1>
                    <h1 className='mt-3 font-bold text-xl'>Recommended for you</h1>
                    <div className="cardContainer mt-4 flex gap-4 items-stretch max-w-screen overflow-x-auto no-scrollbar">
                        {events.length > 0 ? events.map(event => (
                            <div
                                key={event._id}
                                className="cursor-pointer rounded-md flex-shrink-0 h-full"
                                onClick={() => navigate(`/bookEvent/${event._id}`)}
                            >
                                <EventCard event={event} />
                            </div>
                        )) : <p>No events found.</p>}
                    </div>



                </div>


            </div>
        </>
    );
};

export default HomeScreen;
