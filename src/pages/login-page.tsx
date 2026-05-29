import { useEffect, useState } from "react";
import { useAuth } from "@/lib/dev-auth";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {
  const { isLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();

  const [isDev, setIsDev] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // detect whether backend is running in dev mode
    fetch("/api/v1/auth/dev-info")
      .then((r) => r.json())
      .then((j) => setIsDev(Boolean(j?.dev)))
      .catch(() => setIsDev(false));
  }, []);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      const data = (await res.json()) as { username: string; roles: string[] };
      signIn({ username: data.username, roles: data.roles || [] });
      // login succeeded; navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (isDev === null) return <div>Checking auth mode...</div>;

  if (isDev) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6">
        <h2 className="text-2xl mb-4">Developer Login</h2>
        <form onSubmit={submit}>
          <label className="block mb-2">Username</label>
          <input
            className="w-full mb-4 p-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />

          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full mb-4 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="text-red-600 mb-2">{error}</div>}

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          Dev accounts: admin / AdminPass123!, attendee / AttendeePass123!, validator / ValidatorPass123!
        </div>
      </div>
    );
  }

  return <div>Local auth mode is unavailable.</div>;
};

export default LoginPage;
