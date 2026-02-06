import { useState, useRef, useEffect } from "react";
import Button from "../components/ui/Button";

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin" && password === "admin") {
      onLogin({ name: "Admin User", role: "admin" });
    } else if (email === "leader" && password === "leader") {
      onLogin({ name: "Leader User", role: "leader" });
    } else if (email === "user" && password === "user") {
      onLogin({ name: "Normal User", role: "user" });
    } else {
      setError("Invalid credentials. Try admin/admin, leader/leader, or user/user");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8d8d8] bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <input
              ref={inputRef}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button variant="solid" className="w-full py-3 text-base" type="submit">
            Sign In
          </Button>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" className="rounded border-white/10 bg-white/5" />
              Remember me
            </label>
            <button type="button" className="text-indigo-400 hover:text-indigo-300">
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
