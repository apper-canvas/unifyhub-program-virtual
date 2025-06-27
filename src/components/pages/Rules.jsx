import { motion } from 'framer-motion';
import RulesBuilder from '@/components/organisms/RulesBuilder';

const Rules = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Automation Rules
          </h1>
          <p className="text-gray-600 mt-1">Create powerful automation rules to streamline your workflow.</p>
        </div>
      </div>
      
      <RulesBuilder />
    </motion.div>
  );
};

export default Rules;