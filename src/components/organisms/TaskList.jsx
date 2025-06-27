import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import ServiceBadge from "@/components/molecules/ServiceBadge";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadTasks();
  }, []);
  
const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };
  
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    try {
      const task = await taskService.create({
        title: newTask,
        description: '',
        priority: 'medium',
        dueDate: null,
        status: 'pending',
        service: 'unifyhub',
        projectId: null
      });
      setTasks(prev => [task, ...prev]);
      setNewTask('');
      setShowAddForm(false);
      toast.success('Task added successfully');
    } catch (err) {
      toast.error('Failed to add task');
    }
  };
  
const handleDeleteTask = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'overdue') {
      return task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
    }
    return task.service === filter;
  });
  
  const services = [...new Set(tasks.map(t => t.service))];
  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  };
  
  if (loading) return <Loading type="tasks" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;
  
  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <Card className="p-4">
        {!showAddForm ? (
          <Button 
            variant="ghost" 
            onClick={() => setShowAddForm(true)}
            className="w-full text-left justify-start text-gray-500 border-2 border-dashed border-gray-200 hover:border-primary/50"
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Add a new task...
          </Button>
        ) : (
          <form onSubmit={handleAddTask} className="flex space-x-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1"
              autoFocus
            />
            <Button type="submit" variant="accent">
              <ApperIcon name="Plus" size={16} />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setShowAddForm(false);
                setNewTask('');
              }}
            >
              <ApperIcon name="X" size={16} />
            </Button>
          </form>
        )}
      </Card>
      
      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button
          variant={filter === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({tasks.length})
        </Button>
        <Button
          variant={filter === 'pending' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending ({tasks.filter(t => t.status === 'pending').length})
        </Button>
        <Button
          variant={filter === 'completed' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('completed')}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </Button>
        <Button
          variant={filter === 'overdue' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setFilter('overdue')}
        >
          Overdue ({tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length})
        </Button>
        {services.map(service => (
          <Button
            key={service}
            variant={filter === service ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter(service)}
            className="whitespace-nowrap"
          >
            {service} ({tasks.filter(t => t.service === service).length})
          </Button>
        ))}
      </div>
      
      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Empty 
          title="No tasks found"
          description="No tasks match your current filter. Try adjusting your view or add a new task."
          icon="CheckSquare"
          actionText="Add Task"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => {
            const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';
return (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className={`p-4 ${isOverdue ? 'border-l-4 border-l-error bg-error/5' : ''}`}>
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
<button
                      onClick={() => handleToggleComplete(task.Id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                        task.status === 'completed'
                          ? 'bg-success border-success text-white'
                          : 'border-gray-300 hover:border-success'
                      }`}
                    >
                      {task.status === 'completed' && (
                        <ApperIcon name="Check" size={12} />
                      )}
                    </button>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${
                          task.status === 'completed' 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h3>
                        <ServiceBadge service={task.service} />
                        <Badge variant={priorityColors[task.priority]} size="xs">
                          {task.priority}
                        </Badge>
                        {isOverdue && (
                          <Badge variant="error" size="xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className={`text-sm flex items-center ${
                          isOverdue ? 'text-error' : 'text-gray-500'
                        }`}>
                          <ApperIcon name="Calendar" size={14} className="mr-1" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    {/* Actions */}
<div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.Id)}
                        className="p-1 text-gray-400 hover:text-error"
                      >
                        <ApperIcon name="Trash2" size={16} />
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
  );
};

export default TaskList;