import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("in"); // in | out

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1.2;
      });
    }, 30);

    const exitTimer = setTimeout(() => setPhase("out"), 4200);
    const doneTimer = setTimeout(() => onComplete(), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase === "in" && (
        <motion.div
          key="splash"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#101010",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
          }}
          exit={{ scaleY: 0, transformOrigin: "top" }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Ambient glow */}
          <div
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              background:
                "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)",
              borderRadius: "50%",
              pointerEvents: "none",
            }}
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <svg width="120" height="120" viewBox="0 0 80 80" fill="none">
              <rect width="80" height="80" rx="18" fill="#0f172a" />
              <rect
                x="2"
                y="2"
                width="76"
                height="76"
                rx="16"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              <rect
                x="20"
                y="15"
                width="40"
                height="50"
                rx="5"
                stroke="white"
                strokeWidth="2.5"
              />
              <line
                x1="28"
                y1="30"
                x2="52"
                y2="30"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="28"
                y1="40"
                x2="52"
                y2="40"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="28"
                y1="50"
                x2="40"
                y2="50"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Animated scan line */}
              <motion.line
                x1="14"
                y1="40"
                x2="66"
                y2="40"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeLinecap="round"
                animate={{ translateY: [-12, 12, -12] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Glow trail */}
              <motion.line
                x1="14"
                y1="40"
                x2="66"
                y2="40"
                stroke="#38bdf8"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.15"
                animate={{ translateY: [-12, 12, -12] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 36,
                  fontWeight: 800,
                  color: "#f0f4ff",
                  letterSpacing: "-1px",
                }}
              >
                CogniHire
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#1ec9c6",
                  letterSpacing: "2px",
                  padding: "3px 8px",
                  border: "1px solid rgba(30,201,198,0.3)",
                  borderRadius: 6,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                AI
              </span>
            </div>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                color: "#64748b",
                letterSpacing: "0.5px",
                margin: 0,
              }}
            >
              Analysing your potential
            </p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ width: 160 }}
          >
            <div
              style={{
                width: "100%",
                height: 2,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background: "#1ec9c6",
                  borderRadius: 2,
                  width: `${progress}%`,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
