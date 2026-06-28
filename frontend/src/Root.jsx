import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import App from "./App";
import AuthPage from "./AuthPage";
import SplashScreen from "./components/SplashScreen";
import { AnimatePresence } from "framer-motion";

export default function Root() {
  const [user, setUser] = useState(undefined);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  if (user === undefined) return null;

  if (!user) {
    return splashDone ? (
      <AuthPage onAuth={() => {}} />
    ) : (
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen key="splash" onComplete={() => setSplashDone(true)} />
        )}
      </AnimatePresence>
    );
  }

  return (
    <>
      <App
        user={user}
        onSignOut={() => signOut(auth)}
        splashDone={splashDone}
      />
      <AnimatePresence>
        {!splashDone && (
          <SplashScreen key="splash" onComplete={() => setSplashDone(true)} />
        )}
      </AnimatePresence>
    </>
  );
}
