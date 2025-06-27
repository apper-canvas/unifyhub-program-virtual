import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ConnectionStatus from '@/components/molecules/ConnectionStatus';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { serviceConnectionService } from '@/services/api/serviceConnectionService';

const ServiceConnections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const availableServices = [
    { id: 'gmail', name: 'Gmail', icon: 'Mail', description: 'Connect your Gmail account for email management', color: 'bg-red-100 text-red-800' },
    { id: 'outlook', name: 'Outlook', icon: 'Mail', description: 'Connect your Outlook account for email management', color: 'bg-blue-100 text-blue-800' },
    { id: 'slack', name: 'Slack', icon: 'MessageSquare', description: 'Integrate with Slack for team communication', color: 'bg-purple-100 text-purple-800' },
    { id: 'discord', name: 'Discord', icon: 'MessageCircle', description: 'Connect Discord for community management', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'google', name: 'Google Calendar', icon: 'Calendar', description: 'Sync your Google Calendar events', color: 'bg-green-100 text-green-800' },
    { id: 'apple', name: 'Apple Calendar', icon: 'Calendar', description: 'Connect your Apple Calendar', color: 'bg-gray-100 text-gray-800' },
    { id: 'todoist', name: 'Todoist', icon: 'CheckSquare', description: 'Sync tasks from Todoist', color: 'bg-red-100 text-red-800' },
    { id: 'asana', name: 'Asana', icon: 'CheckSquare', description: 'Connect your Asana workspace', color: 'bg-orange-100 text-orange-800' },
  ];
  
  const loadConnections = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await serviceConnectionService.getAll();
      setConnections(data);
    } catch (err) {
      setError('Failed to load service connections. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadConnections();
  }, []);
  
  const handleConnect = async (serviceId) => {
    try {
      // Simulate OAuth flow
      toast.info('Redirecting to service authentication...');
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newConnection = await serviceConnectionService.create({
        serviceId,
        status: 'connected',
        lastSync: new Date().toISOString(),
        settings: {}
      });
      
      setConnections(prev => [...prev, newConnection]);
      toast.success(`Successfully connected to ${availableServices.find(s => s.id === serviceId)?.name}`);
    } catch (err) {
      toast.error('Failed to connect service');
    }
  };
  
  const handleDisconnect = async (connectionId) => {
    try {
      await serviceConnectionService.delete(connectionId);
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      toast.success('Service disconnected');
    } catch (err) {
      toast.error('Failed to disconnect service');
    }
  };
  
  const handleSync = async (connectionId) => {
    try {
      const connection = connections.find(c => c.id === connectionId);
      const updatedConnection = await serviceConnectionService.update(connectionId, {
        status: 'syncing',
        lastSync: new Date().toISOString()
      });
      
      setConnections(prev => prev.map(c => c.id === connectionId ? updatedConnection : c));
      
      // Simulate sync process
      setTimeout(async () => {
        const finalConnection = await serviceConnectionService.update(connectionId, {
          status: 'connected',
          lastSync: new Date().toISOString()
        });
        setConnections(prev => prev.map(c => c.id === connectionId ? finalConnection : c));
        toast.success('Sync completed');
      }, 3000);
      
      toast.info('Syncing data...');
    } catch (err) {
      toast.error('Failed to sync service');
    }
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadConnections} />;
  
  const connectedServices = connections.map(c => c.serviceId);
  const availableToConnect = availableServices.filter(s => !connectedServices.includes(s.id));
  
  return (
    <div className="space-y-8">
      {/* Connected Services */}
      <div>
        <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
          Connected Services ({connections.length})
        </h2>
        
        {connections.length === 0 ? (
          <Empty 
            title="No services connected"
            description="Connect your first service to start aggregating your productivity data."
            icon="Settings"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections.map((connection, index) => {
              const service = availableServices.find(s => s.id === connection.serviceId);
              if (!service) return null;
              
              return (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                          <ApperIcon name={service.icon} size={24} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <ConnectionStatus 
                        status={connection.status} 
                        lastSync={connection.lastSync}
                        service={connection.serviceId}
                      />
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleSync(connection.id)}
                          disabled={connection.status === 'syncing'}
                          className="flex items-center space-x-1"
                        >
                          <ApperIcon 
                            name="RefreshCw" 
                            size={14} 
                            className={connection.status === 'syncing' ? 'animate-spin' : ''} 
                          />
                          <span>Sync</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDisconnect(connection.id)}
                          className="text-error hover:text-error"
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Available Services */}
      {availableToConnect.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-xl text-gray-900 mb-6">
            Available Services ({availableToConnect.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableToConnect.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}>
                        <ApperIcon name={service.icon} size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="accent"
                    onClick={() => handleConnect(service.id)}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <ApperIcon name="Plus" size={16} />
                    <span>Connect</span>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceConnections;