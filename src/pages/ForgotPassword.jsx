import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// Validation Schema
const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export default function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values) {
    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      await sendPasswordResetEmail(auth, values.email);
      setSuccessMessage(
        "Password reset email sent! Please check your inbox or spam folder. After resetting, go back to Login and sign in with your new password."
      );
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send reset email. Please check your email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-2">
      <div className="w-full max-w-md bg-warmWhite rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-brown mb-4 text-center">
          Forgot Password
        </h2>
        <p className="text-sm text-warmGray text-center mb-6">
          Enter your registered email to receive a password reset link.
        </p>

        {/* ✅ Success Message */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
            {successMessage}
          </div>
        )}

        {/* ❌ Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-brown mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="example@email.com"
              className={`w-full rounded-lg border p-3 text-brown text-sm placeholder-warmGray focus:outline-none focus:ring-2 focus:ring-terracotta ${
                errors.email ? "border-destructive" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl bg-terracotta text-warmWhite font-semibold shadow-sm hover:bg-terracottaDark transition-colors disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-terracottaDark hover:text-terracotta transition-colors"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
