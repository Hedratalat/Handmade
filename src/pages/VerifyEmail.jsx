import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { useState } from "react";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResendVerification = async () => {
    const auth = getAuth();
    try {
      setLoading(true);
      setMessage("");

      if (!auth.currentUser) {
        setMessage(
          "⚠️ You need to stay signed in to resend verification email."
        );
        setLoading(false);
        return;
      }

      // ✅ تأكد إن بيانات المستخدم محدثة
      await auth.currentUser.reload();

      // ✅ ابعت الإيميل فعليًا
      await sendEmailVerification(auth.currentUser);
      setMessage("✅ Verification email resent successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to resend verification email. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="bg-warmWhite rounded-2xl shadow-lg p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-brown mb-6">
          Verify Your Email
        </h2>

        <p className="text-warmGray mb-8 leading-relaxed">
          A verification email has been sent to
          <br />
          <span
            className="font-semibold text-terracotta cursor-pointer select-text hover:text-terracottaDark"
            onClick={() => navigator.clipboard.writeText(email)}
            title="Click to copy"
          >
            {email}
          </span>
          . Please check your Gmail inbox or your{" "}
          <span className="text-red-500 font-medium">Spam</span> folder.
        </p>

        <button
          onClick={handleResendVerification}
          disabled={loading}
          className={`w-full px-5 py-2 rounded-lg font-semibold shadow-md transition-colors mb-4 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-yellow-400 text-brown hover:bg-yellow-500"
          }`}
        >
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="w-full px-5 py-2 rounded-lg bg-terracotta text-warmWhite font-semibold shadow-md hover:bg-terracottaDark transition-colors"
        >
          Go to Login
        </button>
        <p className="mt-3 text-sm text-warmGray">
          👉 After verifying your email click this button to log in to your
          account.
        </p>
        {message && (
          <p className="mt-4 text-sm font-medium text-brown">{message}</p>
        )}
      </div>
    </div>
  );
}
