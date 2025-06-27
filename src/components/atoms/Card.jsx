import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const cardClasses = `
    bg-white rounded-lg shadow-sm border border-gray-100
    ${hover ? 'hover:shadow-md hover:scale-[1.02] transition-all duration-200' : ''}
    ${className}
  `;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cardClasses}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;