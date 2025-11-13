import { FaSearch, FaCartPlus, FaTruck } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      icon: <FaSearch className="w-10 h-10 text-warmWhite" />,
      title: "Browse & Discover",
      description:
        "Explore our curated collection of handmade products from talented artisans.",
    },
    {
      icon: <FaCartPlus className="w-10 h-10 text-warmWhite" />,
      title: "Select Your Favorites",
      description:
        "Add unique pieces to your cart and customize options like size and color.",
    },
    {
      icon: <FaTruck className="w-10 h-10 text-warmWhite" />,
      title: "Enjoy Fast Delivery",
      description:
        "Receive your handcrafted treasures carefully packaged and ready to enjoy.",
    },
  ];

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <section className="mt-24 px-6 md:px-28  font-poppins text-center ">
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-playfair text-brown font-semibold "
      >
        How It Works
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-3 text-brownDark text-lg"
      >
        Follow these simple steps to get your handmade treasures delivered right
        to your door.
      </motion.p>

      {/* Steps */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 items-start gap-10 md:gap-6 mt-10 ">
        {/* الخط الأفقي */}
        <div className="hidden md:block absolute top-14 left-10 right-10 h-0.5 bg-terracotta/30 z-0"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            className={`relative z-10 flex flex-col items-center ${
              index === 0
                ? "md:items-start text-left"
                : index === 2
                ? "md:items-end text-right"
                : "text-center"
            }`}
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-terracotta rounded-full flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <h3 className="mb-2 text-xl md:text-2xl text-brown font-playfair">
              {step.title}
            </h3>
            <p
              className={`text-brownDark text-sm md:text-base leading-relaxed max-w-xs ${
                index === 0
                  ? "text-center md:text-left"
                  : index === 2
                  ? "text-center md:text-right"
                  : "text-center"
              }`}
            >
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
