import {
  Facebook,
  Instagram,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

export default function Footer() {
  return (
    <footer className="bg-terracotta text-warmWhite mt-9">
      {/* المحتوى الرئيسي */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left font-poppins">
        {/* عن العيادة */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-semibold mb-2 font-playfair">{`Handmade`}</h3>
          <p className="text-warmWhite/70 text-base leading-relaxed mb-3">
            Discover unique handmade treasures crafted with love by talented
            artisans from around the world.
          </p>

          {/* السوشيال ميديا - نسخة الديسكتوب */}
          <div className="hidden md:block">
            <p className="font-medium text-warmWhite text-lg mb-2">Follow Us</p>
            <div className="flex justify-start space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <Facebook className="w-5 h-5 text-warmWhite/70 hover:text-warmWhite" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <Instagram className="w-5 h-5 text-warmWhite/70 hover:text-warmWhite" />
              </a>
              <a
                href="https://wa.me/2012785201484"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="w-5 h-5 text-warmWhite/70 hover:text-warmWhite" />
              </a>
            </div>
          </div>
        </div>

        {/* روابط سريعة */}
        <div>
          <h3 className="text-xl font-semibold mb-2 font-playfair">
            Quick Links
          </h3>
          <ul className="flex flex-col  gap-3  md:pt-2 text-warmWhite/70 text-base md:text-lg font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-warmWhite transition-colors duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-warmWhite transition-colors duration-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="hover:text-warmWhite transition-colors duration-300"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-warmWhite transition-colors duration-300"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* خدماتنا */}
        <div>
          <h3 className="text-xl font-semibold mb-2 font-playfair">
            Our Services
          </h3>
          <ul className="space-y-1 text-warmWhite/70 text-base">
            <li>Connecting Artisans with Customers</li>
            <li>Promoting Local Handmade Brands</li>
            <li>Custom & Personalized Orders</li>
            <li>Secure Online Shopping Experience</li>
            <li>Nationwide & International Delivery</li>
          </ul>
        </div>

        {/* التواصل */}
        <div>
          <h3 className="text-xl font-semibold mb-2 font-playfair">
            Contact Us
          </h3>
          <div className="space-y-2 text-warmWhite/70 text-base">
            <p className="flex justify-center md:justify-start items-center gap-2">
              <MapPin className="w-4 h-4 text-warmWhite" /> Cairo
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Phone className="w-4 h-4 text-warmWhite" /> +20 100 123 4567
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Mail className="w-4 h-4 text-warmWhite" /> support@handmade.com
            </p>
            <p className="flex justify-center md:justify-start items-center gap-2">
              <Clock className="w-4 h-4 text-warmWhite" /> Sat–Fri: 9:00 AM -
              6:00 PM
            </p>
            <p className="ml-0 md:ml-6">Sunday: Closed</p>
          </div>
        </div>
      </div>

      {/* نسخة الموبايل من السوشيال ميديا */}
      <div className="block md:hidden text-center mt-4">
        <p className="font-medium text-warmWhite text-lg mb-2">Follow Us</p>
        <div className="flex justify-center space-x-3">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <Facebook className="w-5 h-5 text-warmWhite/70 hover:text-warmWhite" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5 text-warmWhite/70 hover:text-warmWhite" />
          </a>
          <a
            href="https://wa.me/2012785201484"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="w-5 h-5 text-warmWhite/70 hover:text-warmWhite" />
          </a>
        </div>
      </div>

      {/* خط تحت الفوتر */}
      <div className="border-t border-warmWhite/30 text-center py-3 mt-4">
        <p className="text-warmWhite/70 text-sm md:text-base">
          © 2025 Handmade. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
