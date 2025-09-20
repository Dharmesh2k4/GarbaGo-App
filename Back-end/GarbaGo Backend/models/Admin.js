import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    default: "Admin",
  }
});

export const Admin = mongoose.model("Admin", AdminSchema);


//run bewlow command to insert a admin
// use yourDBName;  // switch to your database

// db.admins.insertOne({
//   email: "demoadmin@example.com",
//   name: "Demo Admin"
// });