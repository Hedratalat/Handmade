import { useState, useEffect } from "react";
import {
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import toast from "react-hot-toast";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [cartCount, setCartCount] = useState(0); // 🛒 عدد المنتجات في السلة

  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setIsUserOpen(!isUserOpen);

  // 🧡 متابعة المستخدم + المفضلات + السلة
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // ❤️ المفضلات
        const favRef = collection(db, "users", currentUser.uid, "favorites");
        const unsubscribeFav = onSnapshot(favRef, (snapshot) => {
          setFavoritesCount(snapshot.size);
        });

        // 🛒 السلة
        const cartRef = collection(db, "users", currentUser.uid, "cart");
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          setCartCount(snapshot.size);
        });

        return () => {
          unsubscribeFav();
          unsubscribeCart();
        };
      } else {
        setFavoritesCount(0);
        setCartCount(0);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsUserOpen(false);
    navigate("/login");
    toast.success("Logged out successfully 👋");
  };

  return (
    <nav className="sticky top-0 w-full bg-cream/70 backdrop-blur-md shadow-md z-50 font-poppins">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <h2 className="text-brown text-3xl font-playfair font-bold tracking-wide">
          <Link
            to="/"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Handmade
          </Link>
        </h2>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-5 text-brown text-lg font-bold">
          <li>
            <Link
              to="/"
              className="hover:text-terracotta transition-colors"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="hover:text-terracotta transition-colors"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="hover:text-terracotta transition-colors"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-terracotta transition-colors"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Icons + User */}
        <div className="flex items-center gap-4 relative">
          {/* ❤️ Favorite */}
          <div
            className="relative cursor-pointer"
            onClick={() => {
              navigate("/favorites");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaHeart className="w-6 h-6 md:w-7 md:h-7 text-brown hover:text-terracotta transition-colors" />
            {favoritesCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracottaDark text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </div>

          {/* 🛒 Cart */}
          <div
            className="relative cursor-pointer"
            onClick={() => {
              navigate("/cart");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-brown hover:text-terracottaDark transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracottaDark text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>

          {/* 👤 User */}
          <div className="relative group">
            {/* أيقونة المستخدم */}
            <div
              onClick={toggleUserMenu}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-brown  hover:bg-terracotta flex items-center justify-center
                 text-white font-bold cursor-pointer text-lg"
            >
              {user ? user.displayName.charAt(0).toUpperCase() : <FaUser />}
            </div>

            {/* Dropdown */}
            {(isUserOpen || true) && (
              <div
                className="absolute right-0 mt-2 w-40 sm:w-44 bg-white rounded-xl shadow-lg py-2 z-50 
                 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200"
              >
                {!user && (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-brown hover:bg-cream hover:text-terracotta transition-colors"
                      onClick={() => setIsUserOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-2 text-brown hover:bg-cream hover:text-terracotta transition-colors"
                      onClick={() => setIsUserOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                {user && (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-brown hover:bg-cream hover:text-terracotta transition-colors"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 📱 Mobile Menu */}
          <button
            className="md:hidden ml-2 text-brown focus:outline-none transition-transform duration-300"
            onClick={toggleMenu}
          >
            {isOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col gap-2 p-4 bg-cream shadow-md text-lg font-bold text-brown">
          <li>
            <Link
              className="hover:text-terracotta transition-colors"
              to="/"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-terracotta transition-colors"
              to="/about"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-terracotta transition-colors"
              to="/products"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              className="hover:text-terracotta transition-colors"
              to="/contact"
              onClick={() => {
                setIsOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
