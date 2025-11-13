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
import { Check, X } from "lucide-react";

export default function FeedbackDash() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedDelete, setSelectedDelete] = useState(null);

  // 🔹 Fetch feedbacks
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "feedback"), (snapshot) => {
      setFeedbacks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Approve feedback
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "feedback", id), { approved: true });
      toast.success("Feedback approved successfully!");
    } catch (error) {
      toast.error("Failed to approve feedback", error);
    }
  };

  // ❌ Delete feedback
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "feedback", id));
      toast.success("Feedback deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete feedback", error);
    } finally {
      setSelectedDelete(null);
    }
  };

  return (
    <section className="p-6 md:p-12  min-h-screen">
      <h2 className="text-3xl font-playfair text-brown mb-8 text-center font-semibold">
        Feedback Management
      </h2>

      {/* Feedback List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedbacks.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-warmWhite rounded-2xl shadow-md p-5 border border-beige"
          >
            <h3 className="text-lg font-semibold text-brown font-playfair">
              {item.name}
            </h3>
            <p className="text-sm text-warmGray mb-2">{item.email}</p>
            <p className="text-brownDark text-base mb-4 font-poppins">
              {item.message}
            </p>

            <div className="flex justify-end gap-3 ">
              {!item.approved && (
                <button
                  onClick={() => handleApprove(item.id)}
                  className="bg-sage text-white px-4 py-2 rounded-full hover:bg-sageDark transition"
                >
                  <Check size={18} />
                </button>
              )}
              <button
                onClick={() => setSelectedDelete(item.id)}
                className="bg-terracotta text-white px-4 py-2 rounded-full hover:bg-terracottaDark transition "
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 🧡 Delete Confirmation Popup */}
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
              className="bg-warmWhite rounded-2xl p-8 max-w-md w-full text-center shadow-lg border border-beige"
            >
              <h3 className="text-xl font-semibold text-brown font-playfair mb-3">
                Delete Feedback?
              </h3>
              <p className="text-warmGray font-poppins mb-6">
                Are you sure you want to delete this feedback? This action
                cannot be undone.
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
    </section>
  );
}
