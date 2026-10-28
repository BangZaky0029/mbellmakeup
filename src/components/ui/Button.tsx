import React from "react";
import { motion } from "framer-motion";
import type { MotionProps } from "framer-motion";

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    variant?: "primary" | "outline" | "surface";
  };

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full font-sans text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 ease-out relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-mbell-rose focus:ring-offset-2";

  const variants = {
    primary:
      "bg-mbell-primary text-mbell-canvas hover:bg-mbell-ink shadow-[0_4px_16px_rgba(158,90,84,0.25)] hover:shadow-[0_8px_24px_rgba(42,33,33,0.3)] border border-transparent",
    outline:
      "bg-transparent border border-mbell-rose text-mbell-primary hover:bg-mbell-primary hover:text-mbell-canvas hover:border-transparent",
    surface:
      "bg-mbell-surface text-mbell-ink border border-mbell-border hover:bg-mbell-blush/60",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        {children}
      </span>
      {variant === "primary" && (
        <span className="absolute inset-0 scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10" />
      )}
    </motion.button>
  );
};

export default Button;
