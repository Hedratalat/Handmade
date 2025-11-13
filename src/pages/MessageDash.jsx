import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Mail, User, Calendar, MessageSquare, Trash2, X } from "lucide-react";

export default function MessageDash() {
  const [messages, setMessages] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ open: false, id: null });

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetched);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "messages", id));
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setDeletingId(null);
      setConfirmModal({ open: false, id: null });
    }
  };

  return (
    <div className="min-h-screen  px-6 py-10 font-poppins">
      <motion.h1
        className="text-3xl font-playfair text-brown mb-8 text-center font-semibold"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        Received Messages
      </motion.h1>

      {messages.length === 0 ? (
        <motion.p
          className="text-center text-brown text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No messages found 📭
        </motion.p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              className="bg-warmWhite rounded-2xl shadow-lg border border-border p-6 hover:shadow-xl transition-all flex flex-col justify-between"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-terracotta font-semibold text-lg">
                    <User size={18} />
                    <span>{msg.name}</span>
                  </div>
                  {msg.createdAt?.seconds && (
                    <div className="flex items-center gap-1 text-sm text-warmGray">
                      <Calendar size={14} />
                      <span>
                        {new Date(
                          msg.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-brown mb-2">
                  <Mail size={16} />
                  <span className="text-sm">{msg.email}</span>
                </div>

                <p className="text-terracotta font-medium mb-2">
                  Subject: <span className="text-brown">{msg.subject}</span>
                </p>

                <div className="flex items-start gap-2 text-brownDark leading-relaxed mt-2">
                  <MessageSquare size={16} className="mt-1 text-terracotta" />
                  <p>{msg.message}</p>
                </div>
              </div>

              <motion.button
                onClick={() => setConfirmModal({ open: true, id: msg.id })}
                disabled={deletingId === msg.id}
                className={`mt-5 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all 
                  ${
                    deletingId === msg.id
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-terracotta hover:bg-terracottaDark text-warmWhite"
                  }`}
                whileTap={{ scale: 0.95 }}
              >
                {deletingId === msg.id ? "Deleting..." : "Delete Message"}
                <Trash2 size={16} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {confirmModal.open && (
          <>
            {/* الخلفية */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal({ open: false, id: null })}
            ></motion.div>

            {/* المربع نفسه */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-warmWhite rounded-2xl shadow-xl p-6 w-full max-w-sm relative">
                <button
                  onClick={() => setConfirmModal({ open: false, id: null })}
                  className="absolute top-3 right-3 text-brown hover:text-terracotta transition"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-playfair text-terracotta mb-4 text-center">
                  Confirm Deletion
                </h3>

                <p className="text-center text-brown mb-6">
                  Are you sure you want to delete this message? This action
                  cannot be undone.
                </p>

                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setConfirmModal({ open: false, id: null })}
                    className="px-4 py-2 rounded-lg border border-brown text-brown hover:bg-brown hover:text-warmWhite transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => handleDelete(confirmModal.id)}
                    className="px-4 py-2 rounded-lg bg-terracotta text-warmWhite hover:bg-terracottaDark transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
