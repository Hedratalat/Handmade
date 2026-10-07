import Navbar from "../Navbar/Navbar";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import toast, { Toaster } from "react-hot-toast";
import Footer from "../Footer/Footer";
const bahrainPhoneRegex = /^(\+973|00973|973)?[36]\d{7}$/;

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => bahrainPhoneRegex.test(value.replace(/[\s-]/g, "")),
      "Enter a valid Bahrain phone number",
    )
    .transform((value) => "+973" + value.replace(/[\s-]/g, "").slice(-8)),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await addDoc(collection(db, "messages"), {
        ...data,
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent successfully");
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again");
    }
  };

  return (
    <>
      <Navbar />

      <div className=" min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <motion.h2
          className="text-4xl font-playfair text-brown mb-12 text-center"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Contact Us
        </motion.h2>

        <motion.div
          className="bg-warmWhite rounded-2xl shadow-md p-10 w-full max-w-6xl border border-border flex flex-col md:flex-row gap-10"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 space-y-4 order-2 md:order-1"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <input
              type="text"
              placeholder="Your Name"
              data-gramm="false"
              data-gramm_editor="false"
              {...register("name")}
              className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage font-poppins"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <input
              type="email"
              placeholder="Your Email"
              data-gramm="false"
              data-gramm_editor="false"
              {...register("email")}
              className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage font-poppins"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <input
              type="tel"
              inputMode="tel"
              placeholder="Phone Number"
              data-gramm="false"
              data-gramm_editor="false"
              {...register("phone")}
              className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage font-poppins"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}

            <textarea
              placeholder="Your Message"
              data-gramm="false"
              data-gramm_editor="false"
              rows="5"
              {...register("message")}
              className="w-full p-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage font-poppins"
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-terracotta hover:bg-terracottaDark text-warmWhite font-poppins py-3 rounded-xl transition-all disabled:opacity-60"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>

          {/* 💬 معلومات التواصل */}
          <motion.div
            className="flex-1 flex flex-col justify-center text-brown font-poppins space-y-4 order-1 md:order-2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-2xl font-playfair mb-4 text-terracotta">
              Get in Touch
            </h2>
            <p className="text-brown leading-relaxed">
              We'd love to hear from you! Feel free to reach out through any of
              the following methods.
            </p>

            <div className="mt-6 space-y-3">
              <p className="font-medium">
                📧 Email:{" "}
                <span className="text-terracotta">
                  ilcandellas.store@gmail.com
                </span>
              </p>
              <p className="font-medium">
                📞 Phone: <span className="text-terracotta">+973 37721142</span>
              </p>
              <p className="font-medium">
                🕓 Working Hours:{" "}
                <span className="text-terracotta">9:00 AM - 6:00 PM</span>
              </p>
            </div>

            {/* روابط التواصل الاجتماعي */}
            <motion.div
              className="flex items-center mt-6 space-x-6 text-terracotta text-3xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-terracottaDark transition-transform transform hover:scale-110"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.tiktok.com/@ilcandellas?_t=ZS-8yuIE7gpsN3&_r=1&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAadHwi4fU6SQgs1i1fmj5wt5QcUVNQBr481mRIJYOvZhqg7ReBeCN0hGTCO2YQ_aem_zFMkarUGsCHijxDEUvJ6hA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="hover:text-terracottaDark transition-transform transform hover:scale-110"
              >
                <FaTiktok />
              </a>
              <a
                href="https://www.instagram.com/il.candellas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-terracottaDark transition-transform transform hover:scale-110"
              >
                <FaInstagram />
              </a>

              <a
                href="https://wa.me/+97337721142"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="hover:text-terracottaDark transition-transform transform hover:scale-110"
              >
                <FaWhatsapp />
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
