import { motion } from 'framer-motion';
import ServiceConnections from '@/components/organisms/ServiceConnections';

const Services = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Connected Services
          </h1>
          <p className="text-gray-600 mt-1">Manage your connected productivity services and integrations.</p>
        </div>
      </div>
      
      <ServiceConnections />
    </motion.div>
  );
};

export default Services;