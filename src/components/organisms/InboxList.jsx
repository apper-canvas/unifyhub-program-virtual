import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ServiceBadge from '@/components/molecules/ServiceBadge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { messageService } from '@/services/api/messageService';

const InboxList = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  
  const loadMessages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await messageService.getAll();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadMessages();
  }, []);
  
  const handleMarkAsRead = async (messageId) => {
    try {
      const message = messages.find(m => m.id === messageId);
      const updatedMessage = await messageService.update(messageId, { read: !message.read });
      setMessages(prev => prev.map(m => m.id === messageId ? updatedMessage : m));
      toast.success(updatedMessage.read ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      toast.error('Failed to update message');
    }
  };
  
  const handleArchive = async (messageId) => {
    try {
      await messageService.delete(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      toast.success('Message archived');
    } catch (err) {
      toast.error('Failed to archive message');
    }
  };
  
  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !message.read;
    return message.service === filter;
  });
  
  const services = [...new Set(messages.map(m => m.service))];
  
  if (loading) return <Loading type="inbox" />;
  if (error) return <Error message={error} onRetry={loadMessages} />;
  if (filteredMessages.length === 0) {
    return (
      <Empty 
        title="No messages found"
        description="Your inbox is empty or all messages have been filtered out."
        icon="Inbox"
      />
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({messages.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({messages.filter(m => !m.read).length})
        </Button>
        {services.map(service => (
          <Button
            key={service}
            variant={filter === service ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(service)}
            className="whitespace-nowrap"
          >
            {service} ({messages.filter(m => m.service === service).length})
          </Button>
        ))}
      </div>
      
      {/* Message List */}
      <div className="space-y-3">
        {filteredMessages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hover className={`p-4 ${!message.read ? 'border-l-4 border-l-accent bg-accent/5' : ''}`}>
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-medium text-sm">
                    {message.from.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className={`font-medium ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {message.from}
                    </p>
                    <ServiceBadge service={message.service} />
                    {message.labels.map(label => (
                      <span key={label} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {label}
                      </span>
                    ))}
                  </div>
                  <h3 className={`font-medium mb-1 ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {message.subject}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {message.preview}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(message.id)}
                    className="p-1"
                  >
                    <ApperIcon 
                      name={message.read ? "MailOpen" : "Mail"} 
                      size={16} 
                      className={message.read ? "text-gray-400" : "text-accent"}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(message.id)}
                    className="p-1"
                  >
                    <ApperIcon name="Archive" size={16} className="text-gray-400 hover:text-primary" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InboxList;