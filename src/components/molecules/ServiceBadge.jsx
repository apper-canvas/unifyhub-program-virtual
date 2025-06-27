import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ServiceBadge = ({ service, size = 'sm' }) => {
  const serviceConfig = {
    gmail: { icon: 'Mail', color: 'bg-red-100 text-red-800' },
    outlook: { icon: 'Mail', color: 'bg-blue-100 text-blue-800' },
    slack: { icon: 'MessageSquare', color: 'bg-purple-100 text-purple-800' },
    discord: { icon: 'MessageCircle', color: 'bg-indigo-100 text-indigo-800' },
    google: { icon: 'Calendar', color: 'bg-green-100 text-green-800' },
    apple: { icon: 'Calendar', color: 'bg-gray-100 text-gray-800' },
    'outlook-cal': { icon: 'Calendar', color: 'bg-blue-100 text-blue-800' },
    todoist: { icon: 'CheckSquare', color: 'bg-red-100 text-red-800' },
    asana: { icon: 'CheckSquare', color: 'bg-orange-100 text-orange-800' },
    notion: { icon: 'FileText', color: 'bg-gray-100 text-gray-800' },
  };
  
  const config = serviceConfig[service] || { icon: 'Circle', color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <ApperIcon name={config.icon} size={12} className="mr-1" />
      {service}
    </span>
  );
};

export default ServiceBadge;