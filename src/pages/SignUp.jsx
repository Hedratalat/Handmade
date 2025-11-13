import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

// Validation Schema
const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(6, { message: "Name must be at least 6 characters long" })
      .max(30, { message: "Name must be at most 30 characters long" })
      .regex(/^[\p{L} ]+$/u, "Full Name must contain letters only"),

    email: z
      .string()
      .email({ message: "Please enter a valid email" })
      .refine(
        (val) => {
          const lowerVal = val.toLowerCase();
          return /^[a-zA-Z][a-zA-Z0-9._%+-]*@gmail\.(com|net|org)(\.eg)?$/.test(
            lowerVal
          );
        },
        { message: "Email must be a valid Gmail address" }
      ),
    phone: z
      .string()
      .regex(/^01[0125][0-9]{8}$/, "Phone must be a valid Egyptian number"),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
      })
      .regex(/^\S*$/, { message: "Password must not contain spaces" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values) {
    setSubmitting(true);

    try {
      // 1️⃣ إنشاء المستخدم
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      // 2️⃣ تحديث displayName
      await updateProfile(user, { displayName: values.fullName });

      // 3️⃣ إرسال إيميل التفعيل
      await sendEmailVerification(user);

      // 4️⃣ حفظ البيانات في Firestore
      await setDoc(doc(db, "Users", user.uid), {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        createdAt: new Date().toISOString(),
        emailVerified: user.emailVerified,
      });

      navigate("/verifyEmail", { state: { email: values.email } });

      reset();
    } catch (error) {
      console.error(error);

      // تحويل رسائل الأخطاء
      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message =
          "This email is already registered. Please login or use another email.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak. Please choose a stronger password.";
      }

      toast.error(message);
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
            Join Our Community
          </h3>
          <p className="text-warmGray text-center px-4">
            Sign up now and start buying or selling unique handmade pieces.
            Simple, safe, and made with love.
          </p>
          <div className="mt-6 w-full px-6">
            <div className="bg-cream rounded-xl p-4">
              <p className="text-sm text-brownDark">Why Handmade?</p>
              <ul className="mt-3 list-disc list-inside text-warmGray text-sm">
                <li>Authentic handmade art pieces.</li>
                <li>Support independent creators.</li>
                <li>
                  Secure payments and easy-to-use{" "}
                  <span className="ml-5 inline-block">interface.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side: Form */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brown mb-6">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  placeholder="Enter your name"
                  className={`w-full rounded-lg border p-3 text-brown text-sm placeholder-warmGray focus:outline-none focus:ring-2 focus:ring-terracotta ${
                    errors.fullName ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  Phone
                </label>
                <input
                  {...register("phone")}
                  type="text"
                  placeholder="Enter your phone number"
                  className={`w-full rounded-lg border p-3 text-brown text-sm placeholder-warmGray focus:outline-none focus:ring-2 focus:ring-terracotta ${
                    errors.phone ? "border-destructive" : "border-border"
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

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
                    placeholder="Enter a strong password"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-brown mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    className={`w-full rounded-lg border p-3 pr-10 text-brown text-sm placeholder-warmGray focus:outline-none focus:ring-2 focus:ring-terracotta ${
                      errors.confirmPassword
                        ? "border-destructive"
                        : "border-border"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute inset-y-0 right-2 flex items-center px-2 text-warmGray"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.confirmPassword.message}
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
                  {submitting ? "Creating account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center border-t pt-4">
            <p className="text-sm font-medium text-brown">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-terracottaDark hover:text-terracotta transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
