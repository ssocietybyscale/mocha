import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Resend } from "resend";

// Initialize the cached connection variable
let cachedDb: any = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  const opts = { bufferCommands: false };
  const db = await mongoose.connect(process.env.MONGO_URI, opts);
  cachedDb = db;
  return db;
};

// Define Schema
const registrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  email: { type: String, required: true },
  interest: { type: String, required: true }, // This stores the number of persons
  totalPrice: { type: Number, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = new Resend(resendApiKey);

export async function POST(request: Request) {
  try {
    // 1. Connect to Database
    await connectToDatabase();

    const body = await request.json();
    const { fullName, whatsappNumber, email, interest, message, totalPrice } =
      body;

    if (
      !fullName ||
      !whatsappNumber ||
      !email ||
      !interest ||
      totalPrice === undefined
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Save to MongoDB
    const newRegistration = new Registration({
      fullName,
      whatsappNumber,
      email,
      interest,
      message,
      totalPrice,
    });

    const savedDoc = await newRegistration.save();
    console.log(
      `Registration saved with ID: ${savedDoc._id}, Total Price: ₹${totalPrice}`,
    );

    // 3. Send Emails via Resend
    let userEmailSent = false;
    let emailError = null;

    if (resendApiKey) {
      try {
        // Send Thank You Email to user
        const userEmailResponse = await resend.emails.send({
          from: "Mocha Event <no-reply@ssociety.in>",
          to: email,
          subject: "Mocha Event - Registration Confirmed",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #1C1C1C;">Registration Confirmed</h2>
              <p>Hi <strong>${fullName}</strong>,</p>
              <p>Thank you for registering for the <strong>Mocha Mono Vol. 2</strong> event. We have successfully received your details.</p>
              
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Bookings:</strong> ${interest} Person(s)</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Total Amount:</strong> ₹${totalPrice}</p>
                <p style="margin: 5px 0; font-size: 14px; color: #555;"><strong>Email:</strong> ${email}</p>
              </div>

              <p>We will review your request and get back to you shortly with further details regarding payment and venue directions.</p>
              
              <p style="margin-top: 30px; font-size: 12px; color: #999;">
                Mocha Mono Vol.2<br>
                Bhubaneswar
              </p>
            </div>
          `,
        });

        userEmailSent = !userEmailResponse.error;
        if (userEmailResponse.error) {
          emailError = userEmailResponse.error.message;
        }
        console.log("User Email Response:", userEmailResponse);
      } catch (err: any) {
        emailError = err?.message || String(err);
        console.error("Email Sending Error:", err);
      }
    } else {
      console.warn("RESEND_API_KEY is missing, skipping email.");
      emailError = "Resend API key missing";
    }

    // 4. Return Success
    return NextResponse.json(
      {
        message: "Registration successful",
        registrationId: savedDoc._id,
        userEmailSent,
        emailError,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message },
      { status: 500 },
    );
  }
}
