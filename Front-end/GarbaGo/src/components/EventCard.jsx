import React from "react";

const EventCard = ({ event }) => {
  return (
    <div className="cursor-pointer w-[280px] sm:w-[300px] md:w-[340px] flex-shrink-0 h-[400px]">
      <div className="relative bg-white  shadow-md rounded-lg overflow-hidden hover:shadow-lg hover:bg-purple-100 transition flex flex-col h-full">
        {/* Date Strip */}
        <div className="absolute top-2 left-2 bg-black text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-md z-10">
          {new Date(event.date).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          })}
        </div>

        {/* Banner */}
        <img
          className="w-full h-[180px] sm:h-[200px] md:h-[200px] object-cover"
          src={event.banner}
          alt={event.eventName}
        />

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow justify-between">
          <div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold line-clamp-2">
              {event.eventName}
            </h3>
            <p className="text-gray-500 text-[13px] mt-1">{event.organizer}</p>
            <p className="text-gray-700 text-sm mt-1 line-clamp-1">{event.place}</p>
            <p className="text-gray-600 text-sm mt-1">
              {new Date(event.date).toLocaleDateString()} | {event.time}
            </p>
          </div>

          {/* Price */}
          <div className="mt-2 text-pink-600 font-semibold text-[15px]">
            ₹{event.price}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
