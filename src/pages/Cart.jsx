import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../Navbar/Navbar";
import { ShoppingCart, Trash2, PackageCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const cartRef = collection(db, "users", user.uid, "cart");
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          setCartItems(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
          setLoading(false);
        });
        return () => unsubscribeCart();
      } else {
        setCartItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("Please login to manage your cart");
        return;
      }

      setDeletingId(productId);

      const cartRef = collection(db, "users", user.uid, "cart");
      const q = query(cartRef, where("id", "==", productId));
      const existing = await getDocs(q);

      if (!existing.empty) {
        const cartDoc = existing.docs[0];
        await deleteDoc(doc(db, "users", user.uid, "cart", cartDoc.id));
        toast.error("Removed from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", {
      state: { cartItems, totalPrice },
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  px-4 sm:px-6 md:px-10 lg:px-20 py-10 font-poppins">
        {/* 🛍️ Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-playfair font-bold text-brown text-center mb-10"
        >
          Your Shopping Cart
        </motion.h1>

        {/* 🔄 Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="animate-spin text-sage" size={60} />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <ShoppingCart size={90} className="text-sage mb-4" />
            <p className="text-lg sm:text-xl text-brown font-medium">
              Your cart is empty
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10">
            {/* 🧾 Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-center sm:items-start gap-4 border border-beige p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg font-semibold text-brown">
                      {item.name}
                    </h3>
                    <p className="text-warmGray text-sm mb-2 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-sage font-bold text-lg">
                      {item.price} EGP
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={deletingId === item.id}
                    className={`p-2 rounded-full ${
                      deletingId === item.id
                        ? "bg-gray-300"
                        : "bg-terracotta hover:bg-terracottaDark"
                    } text-white transition`}
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/*  Total + Checkout */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between border-t border-beige pt-6 gap-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-brown text-center sm:text-left">
                Total:{" "}
                <span className="text-sage font-bold">{totalPrice} EGP</span>
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCheckout}
                className="bg-sage text-white px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition w-full sm:w-auto"
              >
                <PackageCheck size={22} />
                Checkout
              </motion.button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
