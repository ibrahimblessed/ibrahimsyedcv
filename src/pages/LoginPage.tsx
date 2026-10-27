import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { useAuth } from "../auth/AuthContext";

function explain(err: unknown): string | null {
  if (!(err instanceof FirebaseError)) return "Something went wrong. Please try again.";
  switch (err.code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-email":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return null;
    case "auth/operation-not-allowed":
      return "This sign-in method isn't enabled yet. Turn it on in Firebase Console → Authentication → Sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain isn't authorised. Add it in Firebase Console → Authentication → Settings → Authorised domains.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    default:
      return `Sign-in failed (${err.code}).`;
  }
}

export default function LoginPage() {
  const { user, ready, signInEmail, signInGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ready && user) navigate(from, { replace: true });
  }, [ready, user, from, navigate]);

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(explain(err));
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void run(() => signInEmail(email.trim(), password));
  }

  return (
    <div className="center-screen">
      <div className="card login">
        <span className="mono eyebrow">// admin_access</span>
        <h1 className="login-title">Sign in</h1>
        <p className="muted small">Private area for managing the skills shown on the CV.</p>

        <form onSubmit={onSubmit} className="form" noValidate>
          <label>
            <span className="mono">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            <span className="mono">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}

          <button className="btn primary block" type="submit" disabled={busy || !email || !password}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="divider mono">
          <span>or</span>
        </div>
        <button className="btn block" type="button" disabled={busy} onClick={() => void run(signInGoogle)}>
          Continue with Google
        </button>

        <Link to="/" className="back mono muted">
          ← Back to CV
        </Link>
      </div>
    </div>
  );
}
