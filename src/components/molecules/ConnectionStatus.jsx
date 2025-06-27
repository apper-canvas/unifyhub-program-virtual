import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ConnectionStatus = ({ status, lastSync, service }) => {
  const statusConfig = {
    connected: { color: 'text-success', bgColor: 'bg-success', icon: 'CheckCircle' },
    syncing: { color: 'text-warning', bgColor: 'bg-warning', icon: 'RefreshCw' },
    error: { color: 'text-error', bgColor: 'bg-error', icon: 'AlertCircle' },
    disconnected: { color: 'text-gray-400', bgColor: 'bg-gray-400', icon: 'XCircle' },
  };
  
  const config = statusConfig[status] || statusConfig.disconnected;
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${config.bgColor}`} />
        {status === 'syncing' && (
          <motion.div
            className={`absolute inset-0 w-2 h-2 rounded-full ${config.bgColor} opacity-75`}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <div className="flex items-center space-x-1">
        <ApperIcon name={config.icon} size={14} className={config.color} />
        <span className={`text-xs ${config.color} capitalize`}>{status}</span>
      </div>
      {lastSync && (
        <span className="text-xs text-gray-500">
          {new Date(lastSync).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;