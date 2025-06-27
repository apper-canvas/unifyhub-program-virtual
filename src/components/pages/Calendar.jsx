import { motion } from 'framer-motion';
import CalendarGrid from '@/components/organisms/CalendarGrid';

const Calendar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Unified Calendar
          </h1>
          <p className="text-gray-600 mt-1">View all your events from connected calendar services.</p>
        </div>
      </div>
      
      <CalendarGrid />
    </motion.div>
  );
};

export default Calendar;