import { useRef, useEffect, useState } from "react";
import { useFetcher, redirect } from "react-router-dom";
import Button from "../components/ui/Button";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { changePassword } from "../utils/data";
import { authProvider } from "../utils/auth";

export const firstLoginAction = async ({ request }) => {
  const formData = await request.formData();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }
  
  if (password !== confirmPassword) {
      return { error: "Passwords do not match" };
  }

  try {
    await changePassword(password);
    // Update local state and authProvider state so that checks pass
    if (authProvider.user) {
        authProvider.user.firstLogin = false;
    }
    return redirect("/");
  } catch (err) {
    const message = err.response?.data?.error || "Failed to change password";
    return { error: message };
  }
};

const FirstLoginPage = () => {
    const fetcher = useFetcher();
    const inputRef = useRef(null);
    const isSubmitting = fetcher.state === "submitting";
    const error = fetcher.data?.error;
    
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
  
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
       <div className="flex min-h-screen items-center justify-center bg-[#d8d8d8] bg-[url('/backgrounds/b_login.jpg')] bg-cover bg-fixed bg-center">
             <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
             
             <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
               <div className="mb-8 text-center">
                 <h1 className="text-3xl font-bold text-white">Setup Password</h1>
                 <p className="mt-2 text-sm text-slate-400">Please set a new password to continue</p>
               </div>
       
               <fetcher.Form method="post" className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-300">New Password</label>
                   <div className="relative">
                     <input
                       ref={inputRef}
                       type={showPass ? "text" : "password"}
                       name="password"
                       className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
                       placeholder="Enter new password"
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

                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                   <div className="relative">
                     <input
                       type={showConfirmPass ? "text" : "password"}
                       name="confirmPassword"
                       className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-11 text-white outline-none transition-colors focus:border-indigo-500 focus:bg-white/10"
                       placeholder="Confirm new password"
                     />
                     <button
                       type="button"
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                       onClick={() => setShowConfirmPass(!showConfirmPass)}
                       aria-label={showConfirmPass ? "Hide password" : "Show password"}
                     >
                       {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
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
                   {isSubmitting ? "Changing..." : "Continue"}
                 </Button>
               </fetcher.Form>
             </div>
           </div>
    );
};

export default FirstLoginPage;