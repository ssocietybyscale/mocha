"use client";

import React, { useState, useEffect } from "react";
import CustomSelect from "./ui/CustomSelect";
import { Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import "./EventForm.css";

interface FormData {
  fullName: string;
  whatsappNumber: string;
  email: string;
  message: string;
  interest: string;
  totalPrice: number;
}

const INTEREST_OPTIONS = [
  { label: "1 person", value: "1" },
  { label: "2 person", value: "2" },
  { label: "3 person", value: "3" },
  { label: "4 person", value: "4" },
  { label: "5 person", value: "5" },
  { label: "6 person", value: "6" },
  { label: "7 person", value: "7" },
  { label: "8 person", value: "8" },
  { label: "9 person", value: "9" },
  { label: "10 person", value: "10" },
];

const SUCCESS_TOAST_STYLE = {
  className: "crisp-toast",
  style: {
    background: "#14532d",
    color: "#fff",
    borderRadius: "16px",
    fontSize: "14px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

const ERROR_TOAST_STYLE = {
  className: "crisp-toast",
  style: {
    background: "#7f1d1d",
    color: "#fff",
    borderRadius: "16px",
    fontSize: "14px",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
};

type SubmitStatus = "idle" | "saving" | "sending" | "success";

const EventForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    whatsappNumber: "",
    email: "",
    message: "",
    interest: "",
    totalPrice: 0,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [emailSent, setEmailSent] = useState<boolean | null>(null);

  // Clean up timer if component unmounts
  useEffect(() => {
    return () => {};
  }, []);

  const validate = () => {
    const newErrors: Partial<FormData> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp Number is required";
    } else if (
      !/^\d{10,}$/.test(formData.whatsappNumber.replace(/[^0-9]/g, ""))
    ) {
      newErrors.whatsappNumber = "Enter a valid 10-digit number";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.interest) newErrors.interest = "Please select an option";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    let { name, value } = e.target;

    // WhatsApp Prefix Logic
    if (name === "whatsappNumber") {
      // Remove all non-digits for validation
      const digits = value.replace(/\D/g, "");

      // If user starts typing and doesn't have + or +91, we add it
      if (digits.length > 0) {
        if (!value.startsWith("+91")) {
          // If they typed something like 987..., prepend +91
          if (value.startsWith("91") && value.length > 2) {
            value = "+" + value;
          } else if (!value.startsWith("+")) {
            value = "+91 " + value;
          }
        }
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    const persons = parseInt(value) || 0;
    const price = persons * 699;

    setFormData((prev) => ({
      ...prev,
      interest: value,
      totalPrice: price,
    }));

    if (errors.interest) {
      setErrors((prev) => ({ ...prev, interest: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setStatus("saving");

      // Simulate state progression for better UX
      // The API call usually takes 1-2s. We show "Saving" first, then switch to "Sending"
      // to give the user feedback that multiple steps are happening.
      const stateTimer = setTimeout(() => {
        setStatus((prev) => (prev === "saving" ? "sending" : prev));
      }, 1500);

      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // Safe JSON parsing
        const contentType = response.headers.get("content-type");
        let data;
        if (contentType && contentType.indexOf("application/json") !== -1) {
          data = await response.json();
        } else {
          const text = await response.text();
          throw new Error(response.statusText || "Server error occurred");
        }

        if (!response.ok) {
          throw new Error(data.error || "Failed to register");
        }

        clearTimeout(stateTimer);
        // Primary: DB saved. Secondary: email may or may not have been sent.
        setStatus("success");

        // 1. Database Notification
        toast.success("Registration successful!", SUCCESS_TOAST_STYLE);

        // 2. User Confirmation (Thanking for registration)
        if (data.userEmailSent) {
          toast.success("Thank you for registration!", SUCCESS_TOAST_STYLE);
          setEmailSent(true);
        } else {
          toast.error("Thank-you email delivery failed.", ERROR_TOAST_STYLE);
          setEmailSent(false);
        }
      } catch (error: any) {
        clearTimeout(stateTimer);
        setStatus("idle");
        console.error("Submission error:", error);
        toast.error(
          error.message || "Something went wrong. Please try again.",
          ERROR_TOAST_STYLE,
        );
      }
    } else {
      toast.error("Please fix the errors in the form.", ERROR_TOAST_STYLE);
    }
  };

  if (status === "success") {
    return (
      <div className="success-container">
        <div className="success-icon-bg">
          <Send className="success-icon" />
        </div>
        <h3 className="success-title">Request Sent!</h3>
        <p className="success-desc">
          Thanks for reaching out, {formData.fullName.split(" ")[0]}.<br />
          {emailSent ? (
            <>
              We've sent a confirmation email to{" "}
              <strong>{formData.email}</strong>.
            </>
          ) : emailSent === false ? (
            <>
              Your registration is saved, but we couldn't send a confirmation
              email to <strong>{formData.email}</strong>.
            </>
          ) : (
            <>
              Your registration is saved. You will receive a confirmation if
              email delivery is available.
            </>
          )}
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              fullName: "",
              whatsappNumber: "",
              email: "",
              message: "",
              interest: "",
              totalPrice: 0,
            });
            setEmailSent(null);
          }}
          className="reset-btn"
        >
          Send Another
        </button>
      </div>
    );
  }

  // Helper to render button content based on state
  const renderButtonContent = () => {
    switch (status) {
      case "saving":
        return (
          <>
            <Loader2 className="spinner" />
            Saving details...
          </>
        );
      case "sending":
        return (
          <>
            <Loader2 className="spinner" />
            Sending confirmation...
          </>
        );
      case "idle":
      default:
        return "Register";
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">Mocha Mono Vol.2 Registration</h2>
        <p className="form-subtitle">
          Fill in the details below to get registered for the event.
        </p>
      </div>

      {/* Event Details Summary */}
      <div className="event-details-summary">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            color: "var(--text-secondary)",
            fontSize: "13px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <span>Music, Live Gigs</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
            color: "var(--text-secondary)",
            fontSize: "13px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Fri, 20 Feb, 4:30 PM</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--text-secondary)",
            fontSize: "13px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span style={{ lineHeight: "1.4" }}>
            The B.O.M.B.A.I | Chandrasekharpur, Bhubaneshwar
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName" className="input-label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Rahul Sharma"
            disabled={status !== "idle"}
            className={`text-input ${errors.fullName ? "has-error" : ""}`}
          />
          {errors.fullName && <p className="error-msg">{errors.fullName}</p>}
        </div>

        {/* WhatsApp & Email Row */}
        <div className="form-row">
          <div>
            <label htmlFor="whatsappNumber" className="input-label">
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              disabled={status !== "idle"}
              className={`text-input ${errors.whatsappNumber ? "has-error" : ""}`}
            />
            {errors.whatsappNumber && (
              <p className="error-msg">{errors.whatsappNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              disabled={status !== "idle"}
              className={`text-input ${errors.email ? "has-error" : ""}`}
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}
          </div>
        </div>

        {/* Custom Select */}
        <div
          style={{
            pointerEvents: status !== "idle" ? "none" : "auto",
            opacity: status !== "idle" ? 0.7 : 1,
            marginBottom: formData.interest ? "20px" : "0",
          }}
        >
          <CustomSelect
            label="Number of Bookings for"
            options={INTEREST_OPTIONS}
            value={formData.interest}
            onChange={handleSelectChange}
            placeholder="Choose Number of Bookings"
            error={errors.interest}
          />
        </div>

        {/* Dynamic Pricing Result */}
        <div className="form-group price-display-group">
          <label className="input-label">Total Amount</label>
          <div className="price-display-box">
            <span className="price-amount">₹{formData.totalPrice}</span>
            <span className="price-detail-hint">
              ₹699 × {formData.interest} Person(s)
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="form-group" style={{ marginBottom: "32px" }}>
          <label htmlFor="message" className="input-label">
            Message <span className="optional-text">(Optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            placeholder="Any special requests or queries..."
            disabled={status !== "idle"}
            className="text-area"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status !== "idle"}
          className="submit-btn"
        >
          {renderButtonContent()}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
