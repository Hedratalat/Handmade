import ImageHero from "../../public/covermob.jpg";
import ImageHero2 from "../../public/cover.jpg";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

const socials = [
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/il.candellas/",
    label: "Instagram",
  },
  {
    icon: FaFacebookF,
    href: "https://facebook.com/yourpage",
    label: "Facebook",
  },
  {
    icon: FaTiktok,
    href: "https://www.tiktok.com/@ilcandellas?_t=ZS-8yuIE7gpsN3&_r=1&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAadHwi4fU6SQgs1i1fmj5wt5QcUVNQBr481mRIJYOvZhqg7ReBeCN0hGTCO2YQ_aem_zFMkarUGsCHijxDEUvJ6hA",
    label: "TikTok",
  },
  { icon: FaWhatsapp, href: "https://wa.me/+97337721142", label: "WhatsApp" },
];

export default function Hero() {
  return (
    <section className="relative w-full h-[500px] sm:h-[550px] md:h-[480px] lg:h-[540px] overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={ImageHero2} />
        <img
          src={ImageHero}
          alt="Il Candellas"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </picture>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="
          absolute z-10 px-6 text-center
          inset-x-0 bottom-20 
          md:inset-x-auto md:bottom-auto md:top-[66%]
          md:left-[15%] md:w-[44%] md:px-0
flex flex-col items-center gap-3 md:gap-4        "
      >
        <p className="hidden md:block font-poppins text-[#5a1a2e] text-sm lg:text-lg font-medium max-w-md">
          Your home for handcrafted scented candles
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 w-full max-w-[200px] sm:w-auto md:max-w-none px-7 py-3 md:px-8 md:py-2.5 bg-[#5a1a2e] text-white rounded-full font-semibold text-sm hover:bg-[#431322] transition"
          >
            Shop Now <ArrowRight size={18} />
          </Link>

          <Link
            to="/about"
            className="inline-flex items-center justify-center w-full max-w-[200px] sm:w-auto md:max-w-none px-7 py-3 md:px-8 md:py-2.5 border-2 border-[#5a1a2e] text-[#5a1a2e] rounded-full font-semibold text-sm hover:bg-[#5a1a2e] hover:text-white transition"
          >
            Learn More
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#5a1a2e] text-white hover:bg-[#431322] transition"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
