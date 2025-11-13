import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Edit, X } from "lucide-react";

export default function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    file: null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Products"), (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "Products", id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setSelectedDelete(null);
    }
  };

  const handleEdit = (product) => {
    setEditData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      file: null,
      id: product.id,
    });
    setSelectedEdit(product.id);
  };

  const uploadImageCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "handmade_upload");
    data.append("folder", "handmade_uploads");
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dciqod9kj/image/upload",
        { method: "POST", body: data }
      );
      const json = await res.json();
      return json.secure_url;
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image. Please try again.");
      return null;
    }
  };

  const handleSaveEdit = async () => {
    let imageUrl = editData.imageUrl;

    if (editData.file) {
      const uploadedUrl = await uploadImageCloudinary(editData.file);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    try {
      await updateDoc(doc(db, "Products", editData.id), {
        name: editData.name,
        description: editData.description,
        price: Number(editData.price),
        category: editData.category,
        imageUrl: imageUrl,
      });
      toast.success("Product updated successfully!");
      setSelectedEdit(null);
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <section className="p-6 md:p-12 min-h-screen">
      <h2 className="text-3xl font-playfair text-brown mb-8 text-center font-semibold">
        Products Management
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-warmWhite rounded-2xl shadow-md p-5 border border-beige flex flex-col justify-between"
          >
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-brown font-playfair">
                {product.name}
              </h3>
              <p className="text-warmGray text-sm">{product.description}</p>
              <p className="text-sage font-bold mt-2">{product.price} EGP</p>
              <p className="text-warmGray text-sm">{product.category}</p>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-sage text-white px-4 py-2 rounded-full hover:bg-sageDark transition"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => setSelectedDelete(product.id)}
                className="bg-terracotta text-white px-4 py-2 rounded-full hover:bg-terracottaDark transition"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-full border ${
                currentPage === i + 1
                  ? "bg-sage text-white border-sage"
                  : "bg-warmWhite text-brown border-beige"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {selectedDelete && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-warmWhite rounded-2xl p-6 max-w-md w-full text-center shadow-lg border border-beige"
            >
              <h3 className="text-xl font-semibold text-brown font-playfair mb-3">
                Delete Product?
              </h3>
              <p className="text-warmGray font-poppins mb-6">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDelete(selectedDelete)}
                  className="bg-terracotta text-white px-5 py-2 rounded-full hover:bg-terracottaDark transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setSelectedDelete(null)}
                  className="bg-sage text-white px-5 py-2 rounded-full hover:bg-sageDark transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Popup */}
      <AnimatePresence>
        {selectedEdit && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-warmWhite rounded-2xl p-6 max-w-sm w-full shadow-lg border border-beige overflow-auto"
            >
              <h3 className="text-xl font-semibold text-brown font-playfair mb-5">
                Edit Product
              </h3>

              {/* Image */}
              <div className="flex flex-col mb-3">
                <label className="text-brown font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setEditData({ ...editData, file: e.target.files[0] })
                  }
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm cursor-pointer"
                />
                {editData.imageUrl && (
                  <img
                    src={editData.imageUrl}
                    alt="Preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Name */}
              <div className="flex flex-col mb-3">
                <label className="text-brown font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col mb-3">
                <label className="text-brown font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                  rows={2}
                />
              </div>

              {/* Price */}
              <div className="flex flex-col mb-3">
                <label className="text-brown font-medium mb-1">Price</label>
                <input
                  type="number"
                  value={editData.price}
                  onChange={(e) =>
                    setEditData({ ...editData, price: e.target.value })
                  }
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col mb-3">
                <label className="text-brown font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={editData.category}
                  onChange={(e) =>
                    setEditData({ ...editData, category: e.target.value })
                  }
                  className="border border-slate-300 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleSaveEdit}
                  className="bg-sage text-white px-5 py-2 rounded-full hover:bg-sageDark transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setSelectedEdit(null)}
                  className="bg-terracotta text-white px-5 py-2 rounded-full hover:bg-terracottaDark transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
