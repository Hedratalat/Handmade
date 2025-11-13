import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../Navbar/Navbar";
import { Heart, PackageOpen, X } from "lucide-react";
import toast from "react-hot-toast";
import Footer from "../Footer/Footer";

function parsePrice(value) {
  if (!value) return null;
  if (typeof value === "number") return value;
  const cleaned = String(value)
    .replace(/[,EGP,جنيه,LE,\$]/gi, "")
    .trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        const numericPrice = parsePrice(raw.price);
        return { id: doc.id, ...raw, numericPrice };
      });
      setProducts(data);

      const uniqueCats = [
        ...new Set(data.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCats);
    });

    return () => unsubscribe();
  }, []);

  // 🧡 جلب المفضلات الخاصة بالمستخدم الحالي
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const favRef = collection(db, "users", user.uid, "favorites");
        const unsubscribeFavs = onSnapshot(favRef, (snapshot) => {
          setFavorites(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
        return () => unsubscribeFavs();
      } else {
        setFavorites([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 🧡 إضافة / إزالة من المفضلة
  const handleToggleFavorite = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    const favRef = collection(db, "users", user.uid, "favorites");
    const q = query(favRef, where("id", "==", product.id));
    const existing = await getDocs(q);

    if (!existing.empty) {
      const favDoc = existing.docs[0];
      await deleteDoc(doc(db, "users", user.uid, "favorites", favDoc.id));
      toast.error("Removed from favorites");
    } else {
      await addDoc(favRef, {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        category: product.category,
      });
      toast.success("Added to favorites");
    }
  };

  // 🛒 جلب السلة الخاصة بالمستخدم الحالي
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const cartRef = collection(db, "users", user.uid, "cart");
        const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
          setCart(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribeCart();
      } else {
        setCart([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // 🛒 إضافة / إزالة من السلة
  const handleToggleCart = async (product) => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please login to manage your cart");
      return;
    }

    const cartRef = collection(db, "users", user.uid, "cart");
    const q = query(cartRef, where("id", "==", product.id));
    const existing = await getDocs(q);

    if (!existing.empty) {
      const cartDoc = existing.docs[0];
      await deleteDoc(doc(db, "users", user.uid, "cart", cartDoc.id));
      toast.error("Removed from cart");
    } else {
      await addDoc(cartRef, {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.numericPrice,
        category: product.category,
      });
      toast.success("Added to cart");
    }
  };

  // 🔍 الفلترة
  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter) {
      result = result.filter((p) => p.category === categoryFilter);
    }

    if (priceFilter) {
      result = result.filter((p) => {
        const price = p.numericPrice || 0;
        if (priceFilter === "under100") return price < 100;
        if (priceFilter === "100-300") return price >= 100 && price <= 300;
        if (priceFilter === "300-500") return price >= 300 && price <= 500;
        if (priceFilter === "above500") return price > 500;
        return true;
      });
    }

    return result;
  }, [search, categoryFilter, priceFilter, products]);
  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const isFav = (productId) => favorites.some((fav) => fav.id === productId);
  const isInCart = (productId) => cart.some((item) => item.id === productId);

  return (
    <>
      <Navbar />
      <div className="mt-20 px-6 md:px-12 font-poppins text-center">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-playfair text-brown font-semibold"
        >
          Explore Our Handmade Products
        </motion.h2>

        {/* Filters */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-3 rounded-xl border border-beige w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite placeholder-warmGray"
          />

          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            value={categoryFilter}
            className="p-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            onChange={(e) => setPriceFilter(e.target.value)}
            value={priceFilter}
            className="p-3 rounded-xl border border-beige focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite"
          >
            <option value="">Filter by Price</option>
            <option value="under100">Less than 100 EGP</option>
            <option value="100-300">100 - 300 EGP</option>
            <option value="300-500">300 - 500 EGP</option>
            <option value="above500">More than 500 EGP</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentItems.length > 0 ? (
            currentItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
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
                      {product.numericPrice
                        ? `${product.numericPrice} EGP`
                        : "N/A"}
                    </span>
                    <button
                      onClick={() => handleToggleCart(product)}
                      className={`px-4 py-2 rounded-full font-poppins text-sm font-medium transition-all duration-300 ${
                        isInCart(product.id)
                          ? "bg-sage text-white hover:bg-green-700"
                          : "bg-terracotta text-white hover:bg-terracottaDark"
                      }`}
                    >
                      {isInCart(product.id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[40vh] text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <PackageOpen size={100} className="text-sage mb-4" />
              </motion.div>
              <p className="text-xl font-medium text-brown font-poppins">
                No products found
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border text-brown font-medium transition ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-beige"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg border font-medium transition ${
                  currentPage === i + 1
                    ? "bg-terracotta text-white"
                    : "text-brown hover:bg-beige"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border text-brown font-medium transition ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-beige"
              }`}
            >
              Next
            </button>
          </div>
        )}

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
                alt="Product Preview"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
