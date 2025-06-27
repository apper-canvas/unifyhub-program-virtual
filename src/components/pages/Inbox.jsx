import { motion } from 'framer-motion';
import InboxList from '@/components/organisms/InboxList';

const Inbox = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Unified Inbox
          </h1>
          <p className="text-gray-600 mt-1">All your messages from connected services in one place.</p>
        </div>
      </div>
      
      <InboxList />
    </motion.div>
  );
};

export default Inbox;