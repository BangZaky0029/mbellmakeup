import React from "react"
import { motion } from "framer-motion"
import type { MotionProps } from "framer-motion"

type ButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    variant?: "primary" | "outline"
  }

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-8 py-3 rounded-full font-sans text-sm tracking-widest uppercase transition-all duration-300 ease-out font-bold relative overflow-hidden group"

  const variants = {
    primary:
      "bg-primary text-white hover:shadow-[0_0_20px_rgba(212,165,165,0.6)] border border-transparent",
    outline:
      "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg",
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {variant === "primary" && (
        <span className="absolute inset-0 scale-0 rounded-full transition-all duration-300 group-hover:scale-100 group-hover:bg-rose-400/20" />
      )}
    </motion.button>
  )
}

export default Button
