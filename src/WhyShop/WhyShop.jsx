import { motion } from "framer-motion";
import { Leaf, Heart, HandHeart, ShieldCheck } from "lucide-react";

export default function ShopWithUs() {
  const features = [
    {
      id: 1,
      icon: (
        <Heart
          size={40}
          className="text-terracotta transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        />
      ),
      title: "Unique & Authentic",
      description:
        "Every piece is handmade and one-of-a-kind, crafted with love and skill.",
    },
    {
      id: 2,
      icon: (
        <Leaf
          size={40}
          className="text-sageDark transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
        />
      ),
      title: "Sustainable",
      description:
        "Eco-friendly materials and mindful production that care for our planet.",
    },
    {
      id: 3,
      icon: (
        <HandHeart
          size={40}
          className="text-terracottaDark transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
        />
      ),
      title: "Support Artisans",
      description:
        "Each purchase empowers local artisans and keeps traditional crafts alive.",
    },
    {
      id: 4,
      icon: (
        <ShieldCheck
          size={40}
          className="text-sage transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110"
        />
      ),
      title: "Quality Assured",
      description:
        "Every item is inspected with care to ensure exceptional quality and finish.",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.9 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
    hover: {
      y: -8,
      scale: 1.03,
      boxShadow: "0 12px 25px rgba(107, 78, 61, 0.25)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <section className="mt-20 text-center px-6 md:px-12">
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-playfair text-brown font-semibold"
      >
        Why Shop With Us
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-3 text-brownDark text-lg"
      >
        Because every handmade piece tells a story worth owning
      </motion.p>

      {/* الكروت */}
      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            className="group bg-warmWhite border border-border rounded-2xl shadow-md p-8 flex flex-col items-center text-center transition-all duration-300"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            custom={index}
            viewport={{ once: true }}
          >
            <div className="bg-cream p-4 rounded-full mb-4 shadow-inner flex items-center justify-center">
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold text-brown font-playfair mb-2">
              {feature.title}
            </h3>

            <p className="text-warmGray text-sm font-poppins leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
