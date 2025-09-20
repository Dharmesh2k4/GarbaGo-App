import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const EventDetails = () => {
    const [active, setActive] = useState("Event Details");
    const navigate = useNavigate();
    const [eventDetails, setEventDetails] = useState({});
    const [banner, setBanner] = useState(null);
    const { eventId } = useParams(); // Only eventId is needed

    // Redirect based on role or login

    useEffect(() => { document.title = "Event Details | Eventify"; }, []);

    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (token) {
            if (role === 'user') navigate('/home');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Fetch event details
    useEffect(() => {
        const fetchEventDetails = async () => {
            const token = localStorage.getItem("garbagoToken");
            console.log(eventId)
            if (!token) {
                navigate("/manageEvents");
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/api/event/getEventDetails", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ eventId, token }),
                });
                const data = await res.json();
                if (data.status === "success") {
                    setEventDetails(data.data);
                    setBanner(data.data.banner);
                } else {
                    console.error(data.message);
                }
            } catch (err) {
                console.error("Error fetching event details:", err);
            }
        };

        fetchEventDetails();
    }, [eventId, navigate]);

    const menuItems = [{ name: "Event Details" }];

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

    // Prefill event form
    useEffect(() => {
        if (eventDetails) {
            const formattedDate = eventDetails.date
                ? new Date(eventDetails.date).toISOString().split("T")[0]
                : "";

            const formattedTime = eventDetails.time
                ? new Date(`1970-01-01T${eventDetails.time}`).toTimeString().slice(0, 5)
                : "";

            setValue("eventName", eventDetails.eventName || "");
            setValue("organizer", eventDetails.organizer || "");
            setValue("place", eventDetails.place || "");
            setValue("location", eventDetails.location || "");
            setValue("date", formattedDate);
            setValue("time", formattedTime);
            setValue("price", eventDetails.price || "");
            setValue("seats", eventDetails.seats || "");
        }
    }, [eventDetails, setValue]);

    // Update Event
    const onSubmitUpdate = async (data) => {
        const formData = new FormData();
        formData.append("eventId", eventId);
        formData.append("eventName", data.eventName);
        formData.append("organizer", data.organizer);
        formData.append("place", data.place);
        formData.append("location", data.location);
        formData.append("date", data.date);
        formData.append("time", data.time);
        formData.append("price", data.price);
        formData.append("seats", data.seats);
        if (data.banner && data.banner[0]) {
            formData.append("banner", data.banner[0]);
        }

        try {
            const r = await fetch("http://localhost:3000/api/event/updateEvent", {
                method: "POST",
                body: formData,
            });

            const res = await r.json();
            if (res.status === "success") {
                toast("Event updated successfully!");
            } else {
                toast(res.message || "Failed to update event.");
            }
        } catch (err) {
            console.error("Error updating event:", err);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="my-10 mx-2 flex flex-col gap-2">
                {/* Menu */}
                <div className="left w-[100vw] h-[12%] bg-purple-200 flex md:flex-row flex-col gap-2 items-center justify-around rounded-sm">
                    {menuItems.map((item) => (
                        <span
                            key={item.name}
                            onClick={() => setActive(item.name)}
                            className={
                                active === item.name
                                    ? "bg-purple-400 p-2 border border-black cursor-pointer font-semibold rounded-md min-w-[200px] text-center"
                                    : "hover:bg-purple-400 p-2 border border-black cursor-pointer font-semibold rounded-md min-w-[200px] text-center"
                            }
                        >
                            {item.name}
                        </span>
                    ))}
                </div>

                {/* Content */}
                <div className="right w-[100vw] min-h-[50vh] mb-10 bg-purple-200">
                    {active === "Event Details" && (
                        <form onSubmit={handleSubmit(onSubmitUpdate)}>
                            <div className="p-3 flex flex-col items-center gap-8">
                                {/* Show Banner */}
                                {banner && (
                                    <div className="w-[300px] h-[200px]">
                                        <img
                                            src={`${banner}`}
                                            alt="Event Banner"
                                            className="w-full h-full object-cover rounded-md border border-black"
                                        />
                                    </div>
                                )}

                                {/* Fields */}
                                <div className="grid grid-cols-2 gap-6 w-full max-w-[800px]">
                                    <input type="text" placeholder="Event Name" className="p-2 border rounded-md"
                                        {...register("eventName", { required: "Event Name required!" })} />
                                    <input type="text" placeholder="Organizer" className="p-2 border rounded-md"
                                        {...register("organizer", { required: "Organizer required!" })} />
                                    <input type="text" placeholder="Place" className="p-2 border rounded-md" {...register("place")} />
                                    <input type="text" placeholder="Location" className="p-2 border rounded-md" {...register("location")} />
                                    <input type="date" className="p-2 border rounded-md" {...register("date")} />
                                    <input type="time" className="p-2 border rounded-md" {...register("time")} />
                                    <input type="number" placeholder="Price" className="p-2 border rounded-md" {...register("price")} />
                                    <input type="number" placeholder="Seats" className="p-2 border rounded-md" {...register("seats")} />
                                    <input type="file" accept="image/*" className="col-span-2 p-2 border rounded-md bg-white" {...register("banner")} />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="btn w-full flex gap-4 items-center justify-center mt-[50px]">
                                <button
                                    disabled={isSubmitting}
                                    className="bg-purple-500 rounded-md w-[300px] h-[50px] flex items-center justify-center gap-2"
                                >
                                    <p className="font-bold">Update Event</p>
                                </button>
                                {/* Delete Button */}
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (window.confirm("Are you sure you want to delete this event?")) {
                                            try {
                                                const token = localStorage.getItem("garbagoToken");
                                                const res = await fetch(`http://localhost:3000/api/event/deleteEvent/${eventId}`, {
                                                    method: "DELETE",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        Authorization: `Bearer ${token}`, // if verifyToken uses Bearer
                                                    },
                                                });
                                                const data = await res.json();
                                                if (data.status === "success") {
                                                    toast.success(data.message);
                                                    navigate("/"); // Redirect after deletion
                                                } else {
                                                    toast.error(data.message || "Failed to delete event.");
                                                }
                                            } catch (err) {
                                                console.error("Error deleting event:", err);
                                                toast.error("Error deleting event.");
                                            }
                                        }
                                    }}
                                    className="bg-red-500 rounded-md w-[300px] h-[50px] flex items-center justify-center gap-2"
                                >
                                    <p className="font-bold text-white">Delete Event</p>
                                </button>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default EventDetails;
