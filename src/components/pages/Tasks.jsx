import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';

const Tasks = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Task Management
          </h1>
          <p className="text-gray-600 mt-1">Manage tasks from all your connected productivity services.</p>
        </div>
      </div>
      
      <TaskList />
    </motion.div>
  );
};

export default Tasks;