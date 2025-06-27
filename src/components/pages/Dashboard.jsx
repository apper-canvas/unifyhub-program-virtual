import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ProgressRing from '@/components/molecules/ProgressRing';
import ApperIcon from '@/components/ApperIcon';

const Dashboard = () => {
  const stats = [
    { title: 'Unread Messages', value: 24, change: '+5', icon: 'Mail', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Upcoming Events', value: 7, change: '+2', icon: 'Calendar', color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Pending Tasks', value: 18, change: '-3', icon: 'CheckSquare', color: 'text-orange-600', bgColor: 'bg-orange-100' },
    { title: 'Active Projects', value: 5, change: '+1', icon: 'Folder', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];
  
  const recentActivity = [
    { type: 'message', title: 'New email from Sarah Johnson', time: '2 minutes ago', service: 'gmail' },
    { type: 'task', title: 'Design review completed', time: '15 minutes ago', service: 'asana' },
    { type: 'event', title: 'Team standup meeting', time: '1 hour ago', service: 'google' },
    { type: 'message', title: 'Slack notification from #development', time: '2 hours ago', service: 'slack' },
  ];
  
  const projects = [
    { name: 'Website Redesign', progress: 75, color: '#2E3192' },
    { name: 'Mobile App Launch', progress: 45, color: '#00D4AA' },
    { name: 'Q4 Planning', progress: 90, color: '#FF9F00' },
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening across your services.</p>
        </div>
        <Button variant="accent" className="flex items-center space-x-2">
          <ApperIcon name="Plus" size={16} />
          <span>Quick Add</span>
        </Button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline mt-2">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`ml-2 text-sm font-medium ${
                      stat.change.startsWith('+') ? 'text-success' : 'text-error'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                  <ApperIcon name={stat.icon} className={stat.color} size={24} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-gray-900">Recent Activity</h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-3 hover:bg-surface rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <ApperIcon 
                    name={activity.type === 'message' ? 'Mail' : activity.type === 'task' ? 'CheckSquare' : 'Calendar'} 
                    className="text-white" 
                    size={16} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{activity.time}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full service-${activity.service}`}>
                      {activity.service}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
        
        {/* Project Progress */}
        <Card className="p-6">
          <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">Project Progress</h2>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <ProgressRing progress={project.progress} size={48} />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.progress}% complete</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="secondary" className="w-full mt-6">
            View All Projects
          </Button>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'Mail', label: 'Compose Email', color: 'bg-blue-100 text-blue-600' },
            { icon: 'Calendar', label: 'Schedule Event', color: 'bg-green-100 text-green-600' },
            { icon: 'Plus', label: 'Create Task', color: 'bg-orange-100 text-orange-600' },
            { icon: 'Folder', label: 'New Project', color: 'bg-purple-100 text-purple-600' },
          ].map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-surface rounded-lg hover:bg-gray-100 transition-colors text-center group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 ${action.color} group-hover:scale-105 transition-transform`}>
                <ApperIcon name={action.icon} size={24} />
              </div>
              <p className="text-sm font-medium text-gray-700">{action.label}</p>
            </motion.button>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default Dashboard;