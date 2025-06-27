import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  className = '', 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg focus:ring-primary/50 hover:scale-[1.02]",
    secondary: "bg-white text-primary border border-primary/20 hover:bg-primary/5 focus:ring-primary/50 hover:border-primary/40",
    accent: "bg-gradient-to-r from-accent to-emerald-400 text-white shadow-md hover:shadow-lg focus:ring-accent/50 hover:scale-[1.02]",
    danger: "bg-gradient-to-r from-error to-red-500 text-white shadow-md hover:shadow-lg focus:ring-error/50 hover:scale-[1.02]",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5 focus:ring-primary/50",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;