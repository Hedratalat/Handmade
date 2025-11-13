import ImageHero from "../assets/handmadeHeroimg.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  const paragraphs = [
    "Each piece tells a story. Support artisans and bring unique, handmade beauty into your life.",
    "Our collections are carefully curated to showcase the finest craftsmanship.",
    "Join our community of art lovers and celebrate creativity in every form.",
    "Discover limited-edition creations that make perfect gifts for your loved ones.",
    "Experience the joy of handmade treasures that tell a personal story.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % paragraphs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[500px] md:h-[650px] flex justify-center items-center">
      <img
        src={ImageHero}
        alt="Image of hero section"
        className="w-full h-full object-cover absolute inset-0"
      />

      <div className="absolute inset-0 bg-black/20"></div>

      <motion.div className="relative px-4 text-center z-10">
        <motion.h1
          className="font-playfair text-4xl md:text-6xl lg:text-7xl font-extrabold text-cream drop-shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Discover Handcrafted Treasures
        </motion.h1>

        <div className=" font-poppins mt-4 text-lg md:text-2xl lg:text-3xl max-w-xl mx-auto font-bold relative h-24">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              className="absolute w-full text-cream drop-shadow-md mt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
            >
              {paragraphs[currentIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
        <Link to="products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group mt-4 md:mt-10 bg-terracotta text-white font-poppins px-8 py-3 
          rounded-full shadow-lg flex items-center justify-center gap-3 mx-auto
          hover:bg-terracottaDark transition-all duration-300"
          >
            <span className="text-lg font-semibold tracking-wide">
              Shop Now
            </span>
            <motion.span className="group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight size={22} />{" "}
            </motion.span>
          </motion.button>{" "}
        </Link>
      </motion.div>
    </section>
  );
}
