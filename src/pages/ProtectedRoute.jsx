import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setRoleLoading(false);
      return;
    }

    getDoc(doc(db, "users", user.uid))
      .then((snap) => setRole(snap.exists() ? snap.data().role : null))
      .catch(() => setRole(null))
      .finally(() => setRoleLoading(false));
  }, [user, loading]);

  if (loading || roleLoading) return <p>Loading...</p>;

  if (!user || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
