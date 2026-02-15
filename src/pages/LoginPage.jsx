import { useRef, useEffect } from "react";
import { Form, useActionData, useNavigation, redirect } from "react-router-dom";
import Button from "../components/ui/Button";
import { authProvider } from "../utils/auth";

export const loginAction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (!username) {
     return { error: "Username is required" };
  }

  const user = await authProvider.signin(username, password);
  if (!user) {
    return { error: "Username or password is incorrect" };
  }

  return redirect("/");
};

const LoginPage = () => {
  const actionData = useActionData();
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d8d8d8] bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in to your account</p>
        </div>

        <Form method="post" className="space-y-6">
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
            <input
              type="password"
              name="password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
              placeholder="Enter your password"
            />
          </div>

          {actionData?.error && <p className="text-sm text-rose-400">{actionData.error}</p>}

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
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
