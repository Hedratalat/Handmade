import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function UserDash() {
  const [users, setUsers] = useState([]);

  // 🔹 جلب المستخدمين من كولكشن Users
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="p-6 md:p-12 min-h-screen">
      <h2 className="text-3xl font-playfair text-brown mb-8 text-center font-semibold">
        Users Management
      </h2>

      {/* 🔹 قائمة المستخدمين */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-warmWhite rounded-2xl shadow-md p-5 border border-beige"
          >
            <h3 className="text-lg font-semibold text-brown font-playfair mb-2">
              {user.fullName || "Unnamed User"}
            </h3>
            <p className="text-sm text-warmGray mb-1">{user.email}</p>
            <p className="text-brownDark text-base font-poppins mb-4">
              {user.phone || "No phone number"}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
