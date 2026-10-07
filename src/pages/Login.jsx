import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { auth, db } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export default function Login() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleGoogleLogin() {
    setSubmitting(true);
    setErrorMessage("");
    try {
      const { user } = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      let role = "user";
      if (snap.exists()) {
        role = snap.data().role || "user";
      } else {
        await setDoc(userRef, {
          name: user.displayName || "",
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
        });
      }

      toast.success(`Welcome ${user.displayName?.split(" ")[0] || "User"}`);

      if (role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        setErrorMessage("Sign in was cancelled.");
      } else if (error.code === "auth/popup-blocked") {
        setErrorMessage(
          "Popup was blocked. Please allow popups and try again.",
        );
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-2">
      <div className="w-full max-w-sm bg-warmWhite rounded-2xl shadow-lg p-6 md:p-8">
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
            {errorMessage}
          </div>
        )}
        <h2 className="text-2xl font-bold text-brown mb-2 text-center">
          Login
        </h2>
        <p className="text-sm text-warmGray mb-6 text-center">
          Sign in with your Google account to continue.
        </p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-warmWhite border border-border text-brown font-semibold shadow-sm hover:bg-cream transition-colors disabled:opacity-60 flex items-center justify-center gap-3"
        >
          <FcGoogle size={22} />
          {submitting ? "Signing in..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}
