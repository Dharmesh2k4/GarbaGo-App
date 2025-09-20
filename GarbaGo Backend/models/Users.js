import mongoose from "mongoose";

const usersSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique optional but recommended
});

export const Users = mongoose.model("Users", usersSchema);
