import { motion } from "framer-motion";
import HandmadeHero from "../../public/cover.jpg";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <div className=" min-h-screen font-poppins text-brown">
        {/*  Hero Section  */}
        <section className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center overflow-hidden">
          <img
            src={HandmadeHero}
            alt="Candles glowing softly in a warm setting"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-black/30" />

          {/* <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative text-4xl sm:text-3xl md:text-6xl font-playfair text-warmWhite text-center px-4"
          >
            Every Moment Deserves a Glow
          </motion.h2> */}
        </section>

        {/*  About Content  */}
        <section className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl text-warmGray leading-relaxed mb-10"
          >
            At{" "}
            <span className="text-terracotta font-semibold">Il Candellas</span>,
            we believe that a single flame can change the mood of a whole room.
            Every candle we make is poured with care, using quality wax and
            carefully chosen scents. Our purpose is to bring warmth, calm, and a
            touch of elegance to your everyday moments, from quiet evenings at
            home to celebrations with the people you love.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {/* Mission */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-warmWhite rounded-2xl shadow-md p-6"
            >
              <h3 className="text-2xl font-semibold text-terracotta mb-2">
                🕯️ Our Mission
              </h3>
              <p className="text-warmGray leading-relaxed">
                To create beautiful candles that turn ordinary moments into
                special ones, with scents and designs that feel personal and
                welcoming.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-warmWhite rounded-2xl shadow-md p-6"
            >
              <h3 className="text-2xl font-semibold text-terracotta mb-2">
                ✨ Our Vision
              </h3>
              <p className="text-warmGray leading-relaxed">
                To make candlelight a part of every home and every occasion, and
                to build a community that finds comfort in a warm glow.
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
                Each candle is made with quality wax and a clean, even burn, so
                the scent stays soft and the flame stays steady.
              </p>
            </motion.div>
          </div>
        </section>

        {/*  Footer Quote  */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-terracottaDark py-12 px-4 text-center relative"
        >
          <div className="w-20 h-1 bg-terracotta/50 mx-auto rounded-full mb-4" />

          <p className="text-2xl md:text-3xl italic font-playfair max-w-2xl mx-auto">
            “Because every moment deserves a special glow”
          </p>

          <div className="w-20 h-1 bg-terracotta/50 mx-auto rounded-full mt-4" />
        </motion.section>
      </div>
      <Footer />
    </>
  );
}
