import { useRef, useEffect, useState } from "react";
import { useFetcher, redirect } from "react-router-dom";
import Button from "../components/ui/Button";
import { authProvider } from "../utils/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginSchema } from "../../shared/schemas/user.schema";

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username")?.trim();
  const password = formData.get("password");
  const remember = formData.get("remember") === "on"

  // Frontend validation (matches backend Zod: username min 3, password min 8)
  const validation = loginSchema.safeParse({ username, password });
  if (!validation.success) {
    return { error: validation.error.issues[0].message };
  }

  try {
    const user = await authProvider.signin(username, password, remember);
    if (!user) {
      return { error: "Invalid username or password" };
    }
    if (user.firstLogin) {
      return redirect("/first-login");
    }
    return redirect("/");
  } catch (err) {
    console.log("error",err);
    const message = err.response?.data?.error || "Invalid username or password";
    return { error: message };
  }
};

const LoginPage = () => {
  const fetcher = useFetcher();
  const inputRef = useRef(null);
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.error;
  const[showPass,setShowPass] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8d8d8] bg-[url('/backgrounds/b_login.jpg')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account</p>
        </div>

        <fetcher.Form method="post" className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Username</label>
            <input
              ref={inputRef}
              type="text"
              name="username"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
              placeholder="Enter your username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>  

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button 
            variant="solid" 
            className="w-full py-3 text-base disabled:opacity-50" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400">
              <input type="checkbox" name="remember" className="rounded border-white/10 bg-white/5" />
              Remember me
            </label>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
};

export default LoginPage;

