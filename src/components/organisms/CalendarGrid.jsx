import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ServiceBadge from '@/components/molecules/ServiceBadge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { eventService } from '@/services/api/eventService';

const CalendarGrid = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await eventService.getAll();
      setEvents(data);
    } catch (err) {
      setError('Failed to load calendar events. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadEvents();
  }, []);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.start), day));
  };
  
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };
  
  if (loading) return <Loading type="calendar" />;
  if (error) return <Error message={error} onRetry={loadEvents} />;
  
  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={() => navigateMonth(-1)}>
              <ApperIcon name="ChevronLeft" size={20} />
            </Button>
            <Button variant="secondary" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="ghost" onClick={() => navigateMonth(1)}>
              <ApperIcon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>
        
        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-500 bg-surface rounded-lg">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px">
          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`
                  min-h-[120px] p-2 bg-white border border-gray-100 cursor-pointer
                  hover:bg-surface transition-colors duration-200
                  ${!isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''}
                  ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}
                  ${isToday ? 'bg-accent/10 border-accent' : ''}
                `}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isToday ? 'text-accent font-bold' : 
                    isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="w-2 h-2 bg-accent rounded-full" />
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <div
                      key={event.id}
                      className="p-1 bg-primary/10 text-primary text-xs rounded truncate"
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
      
      {/* Selected Day Events */}
      <Card className="p-6">
        <h3 className="font-display font-semibold text-lg mb-4">
          Events for {format(selectedDate, 'EEEE, MMMM d')}
        </h3>
        {getEventsForDay(selectedDate).length === 0 ? (
          <Empty 
            title="No events scheduled"
            description="This day is free of scheduled events."
            icon="Calendar"
          />
        ) : (
          <div className="space-y-3">
            {getEventsForDay(selectedDate).map(event => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start space-x-4 p-4 bg-surface rounded-lg"
              >
                <div className="w-3 h-3 bg-accent rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <ServiceBadge service={event.service} />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {format(new Date(event.start), 'h:mm a')} - {format(new Date(event.end), 'h:mm a')}
                  </p>
                  {event.location && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <ApperIcon name="MapPin" size={14} className="mr-1" />
                      {event.location}
                    </p>
                  )}
                  {event.attendees.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CalendarGrid;