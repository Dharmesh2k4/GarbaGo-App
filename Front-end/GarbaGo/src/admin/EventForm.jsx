import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';

const EventForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { document.title = "Organize Event | Eventify"; }, []);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    // ✅ Restrict access to Admin only
    useEffect(() => {
        const token = localStorage.getItem('garbagoToken');
        const role = localStorage.getItem('garbagoRole');

        if (!token || role !== 'admin') {
            toast.error('Access denied! Admins only.', { position: 'top-right' });
            navigate('/login');
        }
    }, [navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('garbagoToken');
            const formData = new FormData();
            formData.append('eventName', data.eventName);
            formData.append('place', data.place);
            formData.append('location', data.location);
            formData.append('date', data.date);
            formData.append('time', data.time);
            formData.append('price', data.price);
            formData.append('seats', data.seats);
            formData.append('description', data.description);
            formData.append('banner', data.banner[0]);

            // ✅ Corrected URL
            const res = await fetch('http://localhost:3000/api/event/create', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            // Only parse JSON if response is ok
            const text = await res.text();
            let result;
            try {
                result = JSON.parse(text);
            } catch {
                throw new Error('Invalid JSON returned from server: ' + text);
            }

            if (result.status === 'success') {
                toast.success(result.message, { position: 'top-right' });
                setTimeout(() => navigate('/manageEvent'), 2000);
            } else {
                toast.error(result.message, { position: 'top-right' });
            }
        } catch (err) {
            console.error(err);
            toast.error('Server error!', { position: 'top-right' });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <>
            <ToastContainer />
            {isLoading && <Loader />}
            <div className="flex justify-center mt-20 mb-10">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-5xl">
                    <h1 className="font-bold text-3xl text-center mb-8">Create Event</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Event Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="eventName" className="font-bold">Event Name</label>
                            <input
                                id="eventName"
                                type="text"
                                placeholder="Enter Event Name"
                                className="border border-gray-400 rounded p-2"
                                {...register('eventName', { required: 'Event Name is required!' })}
                            />
                            {errors.eventName && <span className="text-red-500">{errors.eventName.message}</span>}
                        </div>

                        {/* Place */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="place" className="font-bold">Place</label>
                            <input
                                id="place"
                                type="text"
                                placeholder="Event Place"
                                className="border border-gray-400 rounded p-2"
                                {...register('place', { required: 'Place is required!' })}
                            />
                            {errors.place && <span className="text-red-500">{errors.place.message}</span>}
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="location" className="font-bold">Location (Full Address)</label>
                            <input
                                id="location"
                                type="text"
                                placeholder="Address"
                                className="border border-gray-400 rounded p-2"
                                {...register('location', { required: 'Location is required!' })}
                            />
                            {errors.location && <span className="text-red-500">{errors.location.message}</span>}
                        </div>

                        {/* Date */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="date" className="font-bold">Date</label>
                            <input
                                id="date"
                                type="date"
                                className="border border-gray-400 rounded p-2"
                                {...register('date', { required: 'Date is required!' })}
                            />
                            {errors.date && <span className="text-red-500">{errors.date.message}</span>}
                        </div>

                        {/* Time */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="time" className="font-bold">Time</label>
                            <input
                                id="time"
                                type="time"
                                className="border border-gray-400 rounded p-2"
                                {...register('time', { required: 'Time is required!' })}
                            />
                            {errors.time && <span className="text-red-500">{errors.time.message}</span>}
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="font-bold">Price (₹)</label>
                            <input
                                id="price"
                                type="number"
                                placeholder="Ticket Price"
                                className="border border-gray-400 rounded p-2"
                                {...register('price', { required: 'Price is required!' })}
                            />
                            {errors.price && <span className="text-red-500">{errors.price.message}</span>}
                        </div>

                        {/* Seats */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="seats" className="font-bold">Total Seats</label>
                            <input
                                id="seats"
                                type="number"
                                placeholder="Available Seats"
                                className="border border-gray-400 rounded p-2"
                                {...register('seats', { required: 'Seats are required!' })}
                            />
                            {errors.seats && <span className="text-red-500">{errors.seats.message}</span>}
                        </div>

                        {/* Description */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label htmlFor="description" className="font-bold">Description</label>
                            <textarea
                                id="description"
                                placeholder="Enter event description"
                                className="border border-gray-400 rounded p-2"
                                rows={4}
                                {...register('description', { required: 'Description is required!' })}
                            />
                            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
                        </div>

                        {/* Banner */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label htmlFor="banner" className="font-bold">Event Banner</label>
                            <input
                                id="banner"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                className="border border-gray-400 rounded p-2"
                                {...register('banner', { required: 'Banner is required!' })}
                            />
                            {errors.banner && <span className="text-red-500">{errors.banner.message}</span>}
                        </div>

                        {/* Submit */}
                        <div className="md:col-span-2 flex justify-center mt-6">
                            <button
                                disabled={isSubmitting}
                                className="bg-purple-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-purple-500 transition">
                                Publish Event
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};

export default EventForm;
