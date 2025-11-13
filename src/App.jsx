import React, { Suspense, lazy } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ButtonScroll from "./ButtonScroll/ButtonScroll";
import ProtectedRoute from "./pages/ProtectedRoute";
import "./App.css";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Products = lazy(() => import("./pages/Products"));
const DashBoardLayout = lazy(() => import("./DashboardLayout/DashboardLayout"));
const AddProducts = lazy(() => import("./pages/AddProducts"));
const FeedbackDash = lazy(() => import("./pages/FeedbackDash"));
const MessageDash = lazy(() => import("./pages/MessageDash"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const UserDash = lazy(() => import("./pages/UserDash"));
const OrdersDah = lazy(() => import("./pages/OrdersDash"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProductsManagement = lazy(() => import("./pages/ProductsManagement"));

// Spinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-16 h-16 border-4 border-t-orange-500 border-b-orange-500 border-l-gray-300 border-r-gray-300 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <>
      <HashRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verifyEmail" element={<VerifyEmail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashBoardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="addProducts" replace />} />
              <Route path="addProducts" element={<AddProducts />} />
              <Route
                path="productsManagement"
                element={<ProductsManagement />}
              />
              <Route path="userDash" element={<UserDash />} />
              <Route path="ordersDah" element={<OrdersDah />} />
              <Route path="feedback" element={<FeedbackDash />} />
              <Route path="message" element={<MessageDash />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
      <ButtonScroll />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
