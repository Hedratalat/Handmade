import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { X, Check } from "lucide-react";

export default function OrdersDash() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Update order status
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: "completed" });
      toast.success("Order marked as completed!");
    } catch {
      toast.error("Failed to update order status.");
    }
  };

  // ❌ Delete order
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      toast.success("Order deleted successfully!");
    } catch {
      toast.error("Failed to delete order.");
    } finally {
      setSelectedDelete(null);
    }
  };

  return (
    <section className="p-6 md:p-12 min-h-screen ">
      <h2 className="text-3xl font-playfair text-brown mb-8 text-center font-semibold">
        Orders Management
      </h2>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <p className="text-center text-warmGray col-span-full">
            No orders found.
          </p>
        ) : (
          orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-warmWhite rounded-2xl shadow-md p-4 flex justify-between items-center border border-beige hover:shadow-lg transition"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-brown font-playfair">
                  {order.name}
                </h3>
                <p className="text-sm text-warmGray">
                  Total:{" "}
                  <span className="font-semibold text-terracotta">
                    ${order.totalPrice}
                  </span>
                </p>
                <p
                  className={`text-sm font-semibold ${
                    order.status === "pending"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {order.status.toUpperCase()}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                {/* Approve button only if pending */}
                {order.status === "pending" && (
                  <button
                    onClick={() => handleApprove(order.id)}
                    className="bg-green-100 text-green-700 hover:bg-green-200 w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition"
                    title="Mark as completed"
                  >
                    <Check size={16} />
                  </button>
                )}
                {/* Delete button */}
                <button
                  onClick={() => setSelectedDelete(order.id)}
                  className="bg-red-100 text-red-700 hover:bg-red-200 w-8 h-8 flex items-center justify-center rounded-md shadow-sm transition"
                  title="Delete order"
                >
                  <X size={16} />
                </button>
                {/* View Details button */}
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="bg-brown text-white hover:bg-brownDark w-full text-sm py-1 px-2
                   rounded-md shadow-sm transition mt-1"
                  title="View order details"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* 🔍 Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)} // اضغط خارج الكادر لغلقه
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-warmWhite rounded-3xl p-6 max-w-3xl w-full shadow-lg border border-beige overflow-y-auto max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()} // منع الغلق عند الضغط داخل الكادر
            >
              {/* زر الإغلاق من الأعلى على اليمين */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 bg-red-100 text-red-700 hover:bg-red-200 w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition"
              >
                <X size={16} />
              </button>

              <h3 className="text-2xl font-playfair text-brown mb-4 text-center font-semibold">
                Order Details
              </h3>

              {/* بيانات الطلب */}
              <div className="mb-6 space-y-3">
                <div className="bg-orange-50 p-3 rounded-lg shadow-sm ">
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedOrder.name}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {selectedOrder.phone || "No phone"}
                  </p>
                  <p className="mb-1">
                    <strong>Address:</strong> {selectedOrder.address}
                  </p>
                  <p className="mb-1">
                    <strong>Area:</strong> {selectedOrder.area}
                  </p>
                  <p className="mb-1">
                    <strong>City:</strong> {selectedOrder.city}
                  </p>
                  {selectedOrder.floor && (
                    <p>
                      <strong>Floor:</strong> {selectedOrder.floor}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 p-3 rounded-lg shadow-sm">
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    {selectedOrder.status.toUpperCase()}
                  </p>
                  <p className="mb-1">
                    <strong>Order Time:</strong>{" "}
                    {selectedOrder.timestamp?.toDate().toLocaleString()}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg shadow-sm">
                  <p className="mb-1">
                    <strong>Total Price:</strong> ${selectedOrder.totalPrice}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
              </div>

              {/* عناصر الطلب */}
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border border-beige rounded-xl p-3 shadow-sm hover:shadow-md transition bg-white"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border border-beige"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-brown">{item.name}</h4>
                      <p className="text-sm text-warmGray">
                        {item.description}
                      </p>
                      <p className="text-terracotta font-semibold mt-1">
                        ${item.price}
                      </p>
                      {item.category && (
                        <p className="text-sm text-green-700 mt-1">
                          Category: {item.category}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="mt-6 bg-terracotta text-white px-6 py-2 rounded-full hover:bg-terracottaDark transition w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*  Delete Confirmation */}
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
                Delete Order?
              </h3>
              <p className="text-warmGray font-poppins mb-6">
                Are you sure you want to delete this order? This action cannot
                be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDelete(selectedDelete)}
                  className="bg-red-500 text-white px-5 py-2 rounded-full hover:bg-red-600 transition"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setSelectedDelete(null)}
                  className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition"
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
