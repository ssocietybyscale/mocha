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
              <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 10px;">

                <h2 style="color:#1C1C1C; margin-bottom:10px;">
                  Your Entry is Confirmed — Welcome to Mocha Mono Vol. 2 🎶
                </h2>

                <p style="font-size:15px; color:#333;">
                  Dear <strong>${fullName}</strong>,
                </p>

                <p style="font-size:15px; color:#333;">
                  Your entry to <strong>Mocha Mono Vol. 2</strong> has been successfully confirmed, and we’re glad you joined us on the spot.
                </p>

                <p style="font-size:15px; color:#333;">
                  Thank you for booking your entry at the venue and becoming part of an evening dedicated to vinyl music, meaningful conversations, good food, and great vibes. This experience is all about slowing down, tuning in, and truly feeling the music.
                </p>

                <div style="background:#f9fafb; padding:16px; border-radius:8px; margin:22px 0;">
                  <p style="margin:6px 0; font-size:14px;"><strong>Name:</strong> ${fullName}</p>
                  <p style="margin:6px 0; font-size:14px;"><strong>Number of Entries:</strong> ${interest}</p>
                  <p style="margin:6px 0; font-size:14px;"><strong>Event:</strong> Mocha Mono Vol. 2</p>
                  <p style="margin:6px 0; font-size:14px;"><strong>Venue:</strong> Bombai Cafe</p>
                  <p style="margin:6px 0; font-size:14px;"><strong>Date:</strong> 20th February 2026</p>
                  <p style="margin:6px 0; font-size:14px;"><strong>Time:</strong> 4:30 PM onwards</p>
                </div>

                <p style="font-size:15px; color:#333;">
                  Your spot is now secured, and we’re excited to have you with us for this special evening.
                </p>

                <p style="font-size:15px; color:#333;">
                  If you need any assistance during the event, feel free to connect with our team at the venue or contact us at <strong>73278 22710</strong>.
                </p>

                <p style="font-size:15px; color:#333;">
                  Thank you for being here and booking your entry with us. We hope you have a memorable experience. ✨
                </p>

                <p style="margin-top:30px; font-size:14px; color:#333;">
                  Warm regards,<br>
                  <strong>Team Mocha Mono</strong><br>
                  SSOCIETY BY SCALE<br>
                  Contact: 73278 22710
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
