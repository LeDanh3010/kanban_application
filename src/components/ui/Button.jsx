const join = (...parts) => parts.filter(Boolean).join(" ");

const styles = {
  base: "inline-flex items-center justify-center gap-2 font-semibold transition cursor-pointer",
  outline:
    "rounded-full bg-slate-900 text-slate-100 shadow-[0_8px_18px_rgba(15,16,20,0.35)] hover:border-slate-500 outline-none",
  icon: "grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-[0_8px_18px_rgba(15,16,20,0.35)] hover:border-slate-500",
  ghost:
    "rounded-full border border-white/10 bg-transparent text-slate-200 hover:bg-white/10",
  solid:
    "rounded-full bg-slate-100 text-slate-900 hover:bg-white shadow-[0_8px_18px_rgba(15,16,20,0.35)]",
  tab: "rounded-xl px-2 py-2 text-sm text-slate-200",
};

const Button = ({
  variant = "outline",
  className,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={join(styles.base, styles[variant], className)}
      {...props}
    />
  );
};

export default Button;
