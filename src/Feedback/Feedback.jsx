import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const STEP = 3;
const DELAY = 4000;

const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .min(3, "Name is too short")
    .max(30, "Name is too long")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("Invalid email address"),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message")
    .min(10, "Message is too short")
    .max(400, "Message is too long"),
});

export default function Feedback() {
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
  const [page, setPage] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(feedbackSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", message: "" },
  });

  useEffect(() => {
    const q = query(collection(db, "feedback"), where("approved", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setApprovedFeedbacks(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (showAll || approvedFeedbacks.length <= STEP) return;

    const timer = setInterval(() => {
      setPage((prev) => prev + 1);
    }, DELAY);

    return () => clearInterval(timer);
  }, [showAll, approvedFeedbacks.length]);

  const total = approvedFeedbacks.length;
  const start = total > 0 ? page % total : 0;
  const visibleFeedbacks =
    showAll || total <= STEP
      ? approvedFeedbacks
      : Array.from(
          { length: STEP },
          (_, k) => approvedFeedbacks[(start + k) % total],
        );

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "feedback"), {
        ...data,
        approved: false,
        createdAt: serverTimestamp(),
      });
      toast.success("Thank you We’ll review and post it soon.");
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
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-32 h-72 w-72 rounded-full  blur-3xl" />
        <div className="absolute -bottom-20 -left-32 h-72 w-72 rounded-full  blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto text-center mt-1">
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
          Hear what people love about our candles
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {approvedFeedbacks.length === 0 ? (
            <p className="text-warmGray text-center col-span-full">
              No feedback available yet.
            </p>
          ) : (
            <AnimatePresence mode="popLayout">
              {visibleFeedbacks.map((fb, i) => (
                <motion.div
                  key={fb.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    delay: i * 0.15,
                  }}
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

                  <div className="mt-auto pt-3 border-t border-beige">
                    <p className="font-semibold text-brownDark mt-2">
                      {fb.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {approvedFeedbacks.length > STEP && (
          <button
            type="button"
            onClick={() => setShowAll((prev) => !prev)}
            className="mt-10 px-6 py-2 rounded-full bg-terracotta text-white hover:bg-terracottaDark transition"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        )}

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mx-auto mt-20 max-w-xl bg-warmWhite rounded-3xl shadow-xl hover:shadow-2xl p-8 transition-all duration-500 text-left"
        >
          <motion.h3
            custom={0}
            variants={fadeInUp}
            className="text-2xl font-playfair text-terracotta text-center mb-6"
          >
            Share Your Feedback
          </motion.h3>

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

          <motion.div custom={4} variants={fadeInUp}>
            <motion.button
              type="submit"
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
