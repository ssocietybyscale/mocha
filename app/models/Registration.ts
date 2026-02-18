import mongoose from "mongoose";

const RegistrationSchema = new mongoose.Schema(
  {
    fullName: String,
    whatsappNumber: String,
    email: String,
    interest: String,
    totalPrice: Number,
    message: String,
  },
  { collection: "registrations", timestamps: true },
);

export default mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema);
