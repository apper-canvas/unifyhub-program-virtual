import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'inbox') {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-4 shimmer"
          >
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-3 bg-gray-100 rounded w-16" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-1/2" />
              </div>
              <div className="h-3 bg-gray-100 rounded w-12" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'calendar') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 shimmer">
        <div className="grid grid-cols-7 gap-4 mb-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-6 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 35 }).map((_, index) => (
            <div key={index} className="h-24 bg-gray-100 rounded border" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'tasks') {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3 shimmer"
          >
            <div className="w-4 h-4 bg-gray-200 rounded border-2" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="h-6 bg-gray-100 rounded w-16" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'projects') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 shimmer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-32" />
              <div className="w-12 h-12 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loading;