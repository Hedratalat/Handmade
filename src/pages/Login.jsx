import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Please enter the password you registered with" }),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setSubmitting(true);
    setErrorMessage("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );

      // Optional: تحقق إن الإيميل مفعل قبل الدخول
      if (!userCredential.user.emailVerified) {
        setErrorMessage("Please verify your email before logging in.");
        return;
      }

      toast.success(
        `Welcome ${userCredential.user.displayName?.split(" ")[0] || "User"}`
      );

      if (userCredential.user.email === "hedratalat6@gmail.com") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Email or password is incorrect.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-2">
      <div className="w-full max-w-3xl bg-warmWhite rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left side */}
        <div
          className="hidden md:flex flex-col items-center justify-center p-8"
          aria-hidden="true"
          style={{ background: "linear-gradient(180deg,#FAF7F2, #E8DCC4)" }}
        >
          <h3 className="text-3xl font-playfair font-bold text-brown mb-2">
            Welcome Back
          </h3>
          <p className="text-warmGray text-center px-4">
            Sign in to continue buying or selling unique handmade pieces. Safe,
            simple, and made with love.
          </p>
        </div>

        {/* Right side: Form */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            {errorMessage && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {errorMessage}
              </div>
            )}
            <h2 className="text-2xl font-bold text-brown mb-6">Login</h2>

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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full rounded-lg border p-3 pr-10 text-brown text-sm placeholder-warmGray focus:outline-none focus:ring-2 focus:ring-terracotta ${
                      errors.password ? "border-destructive" : "border-border"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-warmGray"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.password.message}
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
                  {submitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-terracottaDark hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center border-t pt-4">
            <p className="text-sm font-medium text-brown">
              Don't have an account?
              <Link
                to="/signup"
                className="font-semibold text-terracottaDark hover:text-terracotta transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
