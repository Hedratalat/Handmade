import { motion } from "framer-motion";
import HandmadeHero from "../assets/aboutImage.jfif"; // غيّر المسار حسب مكان الصورة
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen font-poppins text-brown">
        {/* ====== Hero Section ====== */}
        <section className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center overflow-hidden">
          <img
            src={HandmadeHero}
            alt="Handmade art background"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/40" />

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative text-4xl md:text-6xl font-playfair text-warmWhite text-center px-4"
          >
            The Art of Handmade{" "}
          </motion.h1>
        </section>

        {/* ====== About Content ====== */}
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl text-warmGray leading-relaxed mb-10"
          >
            At <span className="text-terracotta font-semibold">Handmade</span>,
            we believe that true beauty lies in the details crafted by human
            hands. Every creation is a reflection of dedication, creativity, and
            timeless artistry. Our purpose is to celebrate handcrafted
            excellence — connecting you with pieces that carry warmth,
            authenticity, and a touch of soul in every stitch and curve.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Mission */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-warmWhite rounded-2xl shadow-md p-6"
            >
              <h3 className="text-2xl font-semibold text-terracotta mb-2">
                🎯 Our Mission
              </h3>
              <p className="text-warmGray leading-relaxed">
                To preserve traditional art and connect artisans with those who
                value authenticity, sustainability, and beauty.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-warmWhite rounded-2xl shadow-md p-6"
            >
              <h3 className="text-2xl font-semibold text-terracotta mb-2">
                🌿 Our Vision
              </h3>
              <p className="text-warmGray leading-relaxed">
                To inspire appreciation for handmade artistry and create a
                community that celebrates creativity and craftsmanship.
              </p>
            </motion.div>

            {/* Quality */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-warmWhite rounded-2xl shadow-md p-6"
            >
              <h3 className="text-2xl font-semibold text-terracotta mb-2">
                💎 Our Quality
              </h3>
              <p className="text-warmGray leading-relaxed">
                Each item is thoughtfully designed and carefully handcrafted,
                ensuring top-notch quality with a human touch.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ====== Footer Quote ====== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-terracottaDark py-12 px-4 text-center relative"
        >
          {/* خط زخرفي أعلى النص */}
          <div className="w-20 h-1 bg-terracotta/50 mx-auto rounded-full mb-4" />

          {/* النص */}
          <p className="text-2xl md:text-3xl italic font-playfair max-w-2xl mx-auto">
            “Made by hands, powered by heart”
          </p>

          {/* خط زخرفي أسفل النص */}
          <div className="w-20 h-1 bg-terracotta/50 mx-auto rounded-full mt-4" />
        </motion.section>
      </div>
      <Footer />
    </>
  );
}
