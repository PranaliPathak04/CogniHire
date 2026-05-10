import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import App from "./App";
import AuthPage from "./AuthPage";

export default function Root() {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Still checking auth state
  if (user === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#080c14",
          color: "#64748b",
          fontFamily: "Outfit, sans-serif",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <AuthPage onAuth={() => {}} />;
  }

  // Logged in
  return <App user={user} onSignOut={() => signOut(auth)} />;
}
