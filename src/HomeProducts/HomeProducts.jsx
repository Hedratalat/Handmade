import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  limit,
  addDoc,
  deleteDoc,
  doc,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Heart, X, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const arrowVariants = {
  initial: { x: 0 },
  hover: { x: 5 },
};

export default function HomeProducts() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  // جلب آخر 6 منتجات
  useEffect(() => {
    const q = query(
      collection(db, "Products"),
      orderBy("createdAt", "desc"),
      limit(6)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      },
      (error) => {
        console.warn("Failed to fetch products:", error.message);
        setProducts([]);
      }
    );
    return () => unsubscribe();
  }, []);

  // جلب المفضلات
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const favRef = collection(db, "users", user.uid, "favorites");
        const unsubscribeFavs = onSnapshot(
          favRef,
          (snapshot) => {
            setFavorites(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
          },
          (error) => {
            console.warn("Failed to fetch favorites:", error.message);
            setFavorites([]);
          }
        );
        return () => unsubscribeFavs();
      } else {
        setFavorites([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // جلب السلة
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const cartRef = collection(db, "users", user.uid, "cart");
        const unsubscribeCart = onSnapshot(
          cartRef,
          (snapshot) => {
            setCart(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
          },
          (error) => {
            console.warn("Failed to fetch cart:", error.message);
            setCart([]);
          }
        );
        return () => unsubscribeCart();
      } else {
        setCart([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const isFav = (productId) => favorites.some((fav) => fav.id === productId);
  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const handleToggleFavorite = async (product) => {
    const user = auth.currentUser;
    if (!user) return toast.error("Please login to add favorites");

    const favRef = collection(db, "users", user.uid, "favorites");
    const q = query(favRef, where("id", "==", product.id));
    const existing = await getDocs(q);

    if (!existing.empty) {
      const favDoc = existing.docs[0];
      await deleteDoc(doc(db, "users", user.uid, "favorites", favDoc.id));
      toast.error("Removed from favorites");
    } else {
      await addDoc(favRef, product);
      toast.success("Added to favorites");
    }
  };

  const handleToggleCart = async (product) => {
    const user = auth.currentUser;
    if (!user) return toast.error("Please login to manage cart");

    const cartRef = collection(db, "users", user.uid, "cart");
    const q = query(cartRef, where("id", "==", product.id));
    const existing = await getDocs(q);

    if (!existing.empty) {
      const cartDoc = existing.docs[0];
      await deleteDoc(doc(db, "users", user.uid, "cart", cartDoc.id));
      toast.error("Removed from cart");
    } else {
      await addDoc(cartRef, product);
      toast.success("Added to cart");
    }
  };

  return (
    <section className="mt-16 text-center px-6 md:px-12">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-playfair text-brown font-semibold"
      >
        Featured Creations
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-3 text-brownDark text-lg"
      >
        Our most loved handmade pieces, crafted with care and attention to
        detail
      </motion.p>

      {/* Products Grid */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="group relative bg-warmWhite rounded-2xl shadow-md overflow-hidden border border-border hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* صورة الكارد */}
            <div
              className="relative cursor-pointer"
              onClick={() => setSelectedImage(product.imageUrl)}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <button
                className={`absolute top-3 right-3 p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                  isFav(product.id)
                    ? "bg-terracotta text-white"
                    : "bg-warmWhite/50 text-terracotta hover:bg-terracotta hover:text-white"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(product);
                }}
              >
                <Heart size={22} />
              </button>
            </div>

            {/* محتوى الكارد */}
            <div className="flex flex-col justify-between h-full p-5 text-left">
              <div>
                <h3 className="text-xl font-semibold text-brown font-playfair group-hover:text-terracotta transition">
                  {product.name}
                </h3>
                <p className="mt-2 text-warmGray text-sm font-poppins">
                  {product.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-bold text-sage">
                  {product.price || "N/A"} EGP
                </span>
                <button
                  onClick={() => handleToggleCart(product)}
                  className={`px-4 py-2 rounded-full font-poppins text-sm font-medium transition-all duration-300 ${
                    isInCart(product.id)
                      ? "bg-sage text-white hover:bg-green-700"
                      : "bg-terracotta text-white hover:bg-terracottaDark"
                  }`}
                >
                  {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Products Button */}
      <div className="mt-10">
        <Link to="/products">
          <motion.button
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="group mt-5 md:mt-10 bg-white text-terracotta font-poppins px-8 py-3 
            rounded-full shadow-lg flex items-center justify-center gap-3 mx-auto
            hover:bg-terracotta hover:text-white transition-all duration-300"
          >
            <span className="text-lg font-semibold tracking-wide">
              View All Products
            </span>
            <motion.span
              variants={arrowVariants}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight size={22} />
            </motion.span>
          </motion.button>
        </Link>
      </div>

      {/* Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-terracotta hover:text-white transition"
              onClick={() => setSelectedImage(null)}
            >
              <X size={22} />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={selectedImage}
              alt="Enlarged product"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
