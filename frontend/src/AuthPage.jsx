import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const Icon = ({ d, size = 20, stroke = "currentColor", fill = "none" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm16 2l-8 5-8-5",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11-3a3 3 0 100 6 3 3 0 000-6z",
  eyeOff:
    "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
  google: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const friendlyError = (code) => {
    const map = {
      "auth/email-already-in-use": "An account with this email already exists.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-credential": "Invalid email or password.",
      "auth/popup-closed-by-user": "Google sign-in was cancelled.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
    };
    return map[code] || "Something went wrong. Please try again.";
  };

  const handleSubmit = async () => {
    if (!email || !password) return setError("Please fill in all fields.");
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuth();
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onAuth();
    } catch (e) {
      setError(friendlyError(e.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <style>{authCss}</style>

      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="auth-wrap">
        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">
            <Icon d={Icons.zap} size={20} fill="white" stroke="none" />
          </div>
          <span className="brand-name">CogniHire</span>
          <span className="brand-tag">AI</span>
        </div>

        {/* Card */}
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h1>
            <p className="auth-subtitle">
              {mode === "login"
                ? "Sign in to view your analysis history"
                : "Create your account — it's free"}
            </p>
          </div>

          {/* Google */}
          <button
            className="google-btn"
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? <span className="spinner" /> : <GoogleIcon />}
            <span>Continue with Google</span>
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          {/* Email */}
          <div className="field">
            <label className="field-label">Email</label>
            <div className="input-wrap">
              <span className="input-icon">
                <Icon d={Icons.mail} size={16} />
              </span>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          {/* Password */}
          <div className="field">
            <label className="field-label">Password</label>
            <div className="input-wrap">
              <span className="input-icon">
                <Icon d={Icons.lock} size={16} />
              </span>
              <input
                className="auth-input"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
              <button
                className="eye-btn"
                onClick={() => setShowPass(!showPass)}
              >
                <Icon d={showPass ? Icons.eyeOff : Icons.eye} size={16} />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && <div className="auth-error">{error}</div>}

          {/* Submit */}
          <button
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Toggle */}
          <p className="auth-toggle">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
              }}
            >
              {mode === "login" ? " Sign up" : " Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const authCss = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

:root {
  --bg: #080c14;
  --surface: rgba(255,255,255,0.04);
  --surface-hover: rgba(255,255,255,0.07);
  --border: rgba(255,255,255,0.08);
  --border-focus: rgba(99,179,237,0.5);
  --text-primary: #f0f4ff;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  --accent: #38bdf8;
  --accent-glow: rgba(56,189,248,0.2);
  --accent-btn: linear-gradient(135deg, #0ea5e9, #6366f1);
  --missing: rgba(239,68,68,0.15);
  --missing-text: #f87171;
  --missing-border: rgba(239,68,68,0.3);
  --orb1: rgba(56,189,248,0.12);
  --orb2: rgba(99,102,241,0.10);
  --orb3: rgba(168,85,247,0.08);
}

/* Orbs */
.orb { position: fixed; border-radius: 50%; filter: blur(80px); pointer-events: none; z-index: 0; }
.orb-1 { width: 600px; height: 600px; background: var(--orb1); top: -200px; right: -100px; animation: drift1 18s ease-in-out infinite; }
.orb-2 { width: 500px; height: 500px; background: var(--orb2); bottom: 0; left: -150px; animation: drift2 22s ease-in-out infinite; }
.orb-3 { width: 400px; height: 400px; background: var(--orb3); top: 50%; left: 50%; transform: translate(-50%,-50%); animation: drift3 16s ease-in-out infinite; }
@keyframes drift1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-40px,60px) scale(1.1); } }
@keyframes drift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(50px,-40px) scale(0.9); } }
@keyframes drift3 { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.15); } }

.brand-name { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; color: var(--text-primary); }
.brand-icon { width: 32px; height: 32px; background: var(--accent-btn); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
.brand-tag { font-size: 10px; font-weight: 600; background: var(--accent-btn); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: 1px; }


.auth-root {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow: hidden;
  padding: 24px;
}

.auth-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}

.auth-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-card {
  width: 100%;
  background: var(--surface);
  backdrop-filter: blur(24px);
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.auth-header { text-align: center; }

.auth-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.8px;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.auth-subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

/* Google Button */
.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 13px;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Outfit', sans-serif;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}
.google-btn:hover:not(:disabled) {
  background: var(--surface);
  border-color: var(--border-focus);
  transform: translateY(-1px);
}
.google-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
  font-size: 12px;
}
.divider::before, .divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

/* Fields */
.field { display: flex; flex-direction: column; gap: 8px; }
.field-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
}
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  display: flex;
  pointer-events: none;
}
.auth-input {
  width: 100%;
  padding: 13px 44px 13px 42px;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 14px;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
}
.auth-input:focus { border-color: var(--border-focus); }
.auth-input::placeholder { color: var(--text-muted); }
.eye-btn {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;
  padding: 4px;
  transition: color 0.2s;
}
.eye-btn:hover { color: var(--text-primary); }

/* Error */
.auth-error {
  background: var(--missing);
  border: 1px solid var(--missing-border);
  color: var(--missing-text);
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 13px;
}

/* Submit */
.auth-btn {
  width: 100%;
  padding: 15px;
  background: var(--accent-btn);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.auth-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
}
.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(14,165,233,0.35);
}
.auth-btn:disabled { opacity: 0.7; cursor: not-allowed; }

/* Toggle */
.auth-toggle {
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
}
.auth-toggle button {
  background: none;
  border: none;
  color: var(--accent);
  font-weight: 600;
  font-size: 14px;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s;
}
.auth-toggle button:hover { opacity: 0.8; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
`;
