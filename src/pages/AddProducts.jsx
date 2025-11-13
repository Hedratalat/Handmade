import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { collection, serverTimestamp, setDoc, doc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function AddProducts() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // رفع الصورة على Cloudinary
  const uploadImageCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "handmade_upload"); // preset خاص بالمشروع
    data.append("folder", "handmade_uploads"); // مجلد المشروع

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dciqod9kj/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const json = await res.json();
      return json.secure_url; // رابط الصورة النهائي
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const uploadedUrl = await uploadImageCloudinary(file);
    if (uploadedUrl) {
      setProductData((prev) => ({ ...prev, imageUrl: uploadedUrl }));
      toast.success("Image uploaded successfully");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productData.imageUrl) {
      toast.error("Please upload an image before submitting.");
      return;
    }
    setLoading(true);

    try {
      const newDocRef = doc(collection(db, "Products"));
      await setDoc(newDocRef, {
        ...productData,
        price: parseFloat(productData.price),
        createdAt: serverTimestamp(),
      });

      toast.success("Product added successfully");
      setProductData({
        name: "",
        description: "",
        price: "",
        category: "",
        imageUrl: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-poppins px-5 py-10">
      <motion.h2
        className="text-3xl font-playfair text-brown mb-8 text-center font-semibold"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Add New Product
      </motion.h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl">
        {/* Product Name */}
        <div className="flex flex-col">
          <label className="text-brown font-medium mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            data-gramm="false"
            data-gramm_editor="false"
            placeholder="Enter product name"
            className="p-4 rounded-xl border border-beige w-full focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite placeholder-warmGray text-lg"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-brown font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            rows="4"
            data-gramm="false"
            data-gramm_editor="false"
            placeholder="Enter product description"
            className="p-4 rounded-xl border border-beige w-full focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite placeholder-warmGray text-lg"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-brown font-medium mb-2">Price ($)</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
            placeholder="Enter product price"
            className="p-4 rounded-xl border border-beige w-full focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite placeholder-warmGray text-lg"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-brown font-medium mb-2">
            Category <span className="text-warmGray text-sm">(optional)</span>
          </label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            data-gramm="false"
            data-gramm_editor="false"
            placeholder="Enter category (optional)"
            className="p-4 rounded-xl border border-beige w-full focus:outline-none focus:ring-2 focus:ring-sage text-brown bg-warmWhite placeholder-warmGray text-lg"
          />
        </div>

        {/* Product Image URL */}
        <div className="flex flex-col">
          <label className="text-brown font-medium mb-2">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm
      file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 
      file:text-white file:bg-terracotta file:hover:bg-terracottaDark
      file:cursor-pointer cursor-pointer"
          />
        </div>

        {/* Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          className={`mt-4 w-fit px-10 py-3 rounded-xl font-semibold text-warmWhite text-lg transition-all shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-terracotta hover:bg-terracottaDark"
          }`}
        >
          {loading ? "Adding..." : "Add Product"}
        </motion.button>
      </form>
    </div>
  );
}
