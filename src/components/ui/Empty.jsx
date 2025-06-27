import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "Nothing here yet", 
  description = "Get started by adding your first item", 
  actionText = "Get Started",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-accent to-emerald-400 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="text-white" size={40} />
      </div>
      <h3 className="font-display font-semibold text-xl text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button variant="primary" onClick={onAction} className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={16} />
          <span>{actionText}</span>
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;