import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import App from "./App";
import AuthPage from "./AuthPage";
import SplashScreen from "./components/SplashScreen";

export default function Root() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  // Still checking auth state
  if (user === undefined || !splashDone) {
    return <SplashScreen onComplete={() => setSplashDone(true)} />;
  }
  // Not logged in
  if (!user) {
    return <AuthPage onAuth={() => {}} />;
  }

  // Logged in
  return <App user={user} onSignOut={() => signOut(auth)} />;
}
