import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import Navbar from "../Navbar/Navbar";
import { Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import Footer from "../Footer/Footer";

// ✅ Zod Schema للتحقق من البيانات
const checkoutSchema = z.object({
  name: z
    .string()
    .min(5, "Full name must be at least 5 characters")
    .max(35, "Full name must be less than 50 characters")
    .regex(/^[A-Za-z\s]+$/, "Full name must contain only letters"),
  city: z
    .string()
    .min(3, "City name must be valid")
    .regex(/^[A-Za-z\s]+$/, "City must contain only letters"),
  area: z
    .string()
    .min(4, "Area name must be valid")
    .regex(/^[A-Za-z0-9\s]+$/, "Area must contain letters or numbers only"),
  address: z
    .string()
    .min(5, "Address must be valid")
    .max(100, "Address is too long"),
  floor: z.string().optional(),
  phone: z
    .string()
    .regex(/^(\+2)?01[0125][0-9]{8}$/, "Invalid Egyptian phone number format"),
  paymentMethod: z.string().nonempty(),
});

export default function Checkout() {
  const location = useLocation();
  const { cartItems, totalPrice } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    area: "",
    address: "",
    floor: "",
    phone: "",
    paymentMethod: "Cash on Delivery",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = checkoutSchema.safeParse(formData);

    if (!validation.success) {
      const newErrors = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field) newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const user = auth.currentUser;
    if (!user) {
      setErrors({ general: "Please login to complete your order" });
      return;
    }

    setLoading(true);

    try {
      // حفظ الطلب في orders
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        ...formData,
        items: cartItems,
        totalPrice,
        status: "pending",
        timestamp: serverTimestamp(),
      });

      // مسح كل العناصر من cart بعد الطلب
      const cartRef = collection(db, "users", user.uid, "cart");
      const cartSnapshot = await getDocs(cartRef);
      for (const docItem of cartSnapshot.docs) {
        await deleteDoc(docItem.ref);
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error saving order:", error);
      setErrors({ general: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen  px-4 sm:px-6 md:px-10 lg:px-20 py-10 font-poppins">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-6 bg-green-100 border border-green-400 text-green-800 rounded-xl p-4 flex items-center gap-3 shadow-md"
          >
            <CheckCircle2 size={28} className="text-green-600" />
            <p className="text-base sm:text-lg font-medium">
              Your order is <strong>pending</strong> and will be confirmed by
              phone or WhatsApp message.
            </p>
          </motion.div>
        )}

        {errors.general && (
          <p className="text-red-500 text-center mb-4">{errors.general}</p>
        )}

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-playfair font-bold text-brown text-center mb-10"
        >
          Checkout
        </motion.h1>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />
            <InputField
              label="Area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              error={errors.area}
            />
            <InputField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />
            <InputField
              label="Floor (Optional)"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder="e.g. 2nd floor"
            />
            <InputField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +20 10xxxxxxx"
              error={errors.phone}
            />

            <div>
              <label className="block text-brown font-medium mb-1">
                Payment Method
              </label>
              <input
                type="text"
                value="Cash on Delivery"
                readOnly
                className="w-full border border-beige bg-gray-50 rounded-lg p-3 text-gray-700 cursor-not-allowed"
              />
            </div>

            <div className="mt-4 text-center sm:text-left">
              <p className="text-xl font-semibold text-brown">
                Total: <span className="text-sage">{totalPrice} EGP</span>
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="bg-sage text-white px-8 py-3 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Confirm Order"
              )}
            </motion.button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

function InputField({ label, name, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="block text-brown font-medium mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 ${
          error
            ? "border-destructive focus:ring-destructive"
            : "border-beige focus:ring-sage"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
