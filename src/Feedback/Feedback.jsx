import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft } from "react-icons/fa";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { Toaster, toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ التحقق (Zod Schema)
const feedbackSchema = z.object({
  name: z
    .string()
    .min(3, "Name must contain at least 3 characters")
    .max(30, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(400, "Message is too long"),
});

export default function Feedback() {
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    mode: "onChange",
  });

  // 🔹 جلب التعليقات المعتمدة فقط
  useEffect(() => {
    const q = query(collection(db, "feedback"), where("approved", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApprovedFeedbacks(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    });

    return () => unsubscribe();
  }, []);

  // 🔹 إرسال الفيدباك
  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "feedback"), {
        ...data,
        approved: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Thank you! We’ll review and post it soon.");
      reset();
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <section className="relative bg-gradient-to-b overflow-hidden py-20 px-6 md:px-16 font-poppins">
      {/* خلفيات خفيفة */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-32 h-72 w-72 rounded-full  blur-3xl" />
        <div className="absolute -bottom-20 -left-32 h-72 w-72 rounded-full  blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto text-center mt-1">
        {/* العنوان */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl font-playfair text-brown font-semibold "
        >
          What Our Customers Say
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-3 text-brownDark text-lg mb-12"
        >
          Hear what people love about our handmade creations{" "}
        </motion.p>
        {/* 💬 Show Feedback*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {approvedFeedbacks.length === 0 ? (
            <p className="text-warmGray text-center col-span-full">
              No feedback available yet.
            </p>
          ) : (
            approvedFeedbacks.map((fb, i) => (
              <motion.div
                key={fb.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.15 }}
                className="bg-warmWhite border border-beige rounded-3xl p-6 shadow-lg hover:shadow-2xl 
          transition-all duration-500 hover:scale-105 text-left flex flex-col justify-between h-full"
                style={{ boxShadow: "0 6px 20px rgba(201,125,96,0.15)" }}
              >
                <div>
                  <FaQuoteLeft className="text-terracotta/40 text-3xl mb-3" />
                  <p className="text-brown leading-relaxed mb-3">
                    {fb.message}
                  </p>
                </div>

                {/* الجزء السفلي ثابت دائمًا */}
                <div className="mt-auto pt-3 border-t border-beige">
                  <p className="font-semibold text-brownDark mt-2">{fb.name}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* ✉️ نموذج الإرسال */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto mt-20 max-w-xl bg-warmWhite rounded-3xl shadow-xl hover:shadow-2xl p-8 transition-all duration-500 text-left"
        >
          {/* Title */}
          <motion.h3
            custom={0}
            variants={fadeInUp}
            className="text-2xl font-playfair text-terracotta text-center mb-6"
          >
            Share Your Feedback
          </motion.h3>

          {/* Name */}
          <motion.div custom={1} variants={fadeInUp} className="mb-4">
            <label className="block text-brownDark font-medium mb-1">
              Name *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Enter your full name"
              data-gramm="false"
              data-gramm_editor="false"
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-warmGray/40 focus:ring-terracotta"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </motion.div>

          {/* Email */}
          <motion.div custom={2} variants={fadeInUp} className="mb-4">
            <label className="block text-brownDark font-medium mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="Enter your email"
              data-gramm="false"
              data-gramm_editor="false"
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-warmGray/40 focus:ring-terracotta"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Message */}
          <motion.div custom={3} variants={fadeInUp} className="mb-6">
            <label className="block text-brownDark font-medium mb-1">
              Message *
            </label>
            <textarea
              rows="4"
              {...register("message")}
              placeholder="Write your message..."
              data-gramm="false"
              data-gramm_editor="false"
              className={`w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 resize-none ${
                errors.message
                  ? "border-red-400 focus:ring-red-300"
                  : "border-warmGray/40 focus:ring-terracotta"
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </motion.div>

          {/* Button */}
          <motion.div custom={4} variants={fadeInUp}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isSubmitting}
              className={`w-full font-semibold py-2 rounded-md text-white transition-all duration-300 ${
                isSubmitting
                  ? "bg-beige text-brownDark cursor-not-allowed"
                  : "bg-terracotta hover:bg-terracottaDark"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Feedback"}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}
