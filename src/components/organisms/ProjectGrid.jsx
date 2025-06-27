import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { projectService } from '@/services/api/projectService';

const ProjectGrid = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', color: '#2E3192' });
  
  const colors = [
    '#2E3192', '#515CAE', '#00D4AA', '#FF9F00', '#FF3E3E', 
    '#2196F3', '#9C27B0', '#4CAF50', '#FF5722', '#607D8B'
  ];
  
const loadProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await projectService.getAll();
      // Transform API data to component expected format
      const transformedData = data.map(project => ({
        ...project,
        id: project.Id, // Map database Id to lowercase id
        linkedItems: (() => {
          try {
            return typeof project.linked_items === 'string' 
              ? JSON.parse(project.linked_items) 
              : Array.isArray(project.linked_items) 
                ? project.linked_items 
                : [];
          } catch {
            return [];
          }
        })()
      }));
      setProjects(transformedData);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    
try {
      const project = await projectService.create({
        name: newProject.name,
        color: newProject.color,
        linkedItems: [],
        progress: 0
      });
      // Transform created project to expected format
      const transformedProject = {
        ...project,
        id: project.Id,
        linkedItems: []
      };
      setProjects(prev => [transformedProject, ...prev]);
      setNewProject({ name: '', color: '#2E3192' });
      setShowAddForm(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };
  
const handleDeleteProject = async (projectId) => {
    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };
  
  if (loading) return <Loading type="projects" />;
  if (error) return <Error message={error} onRetry={loadProjects} />;
  
  return (
    <div className="space-y-6">
      {/* Add Project Form */}
      {showAddForm && (
        <Card className="p-6">
          <form onSubmit={handleAddProject} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Input
                label="Project Name"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                className="flex-1"
                autoFocus
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewProject(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newProject.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" variant="accent">
                Create Project
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => {
                  setShowAddForm(false);
                  setNewProject({ name: '', color: '#2E3192' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Add Button */}
      {!showAddForm && (
        <Button 
          variant="accent" 
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Project</span>
        </Button>
      )}
      
      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Empty 
          title="No projects yet"
          description="Create your first project to start organizing your tasks, events, and messages."
          icon="Folder"
          actionText="Create Project"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="p-6 relative group">
                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-error"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-semibold text-lg text-gray-900 pr-8">
                    {project.name}
                  </h3>
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: project.color }}
                  />
                </div>
                
                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <ProgressRing progress={project.progress} size={60} />
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="font-semibold text-gray-900">{Math.round(project.progress)}%</p>
                  </div>
                </div>
                
                {/* Linked Items */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Linked Items</span>
                    <span className="text-sm text-gray-500">{project.linkedItems.length}</span>
                  </div>
                  
                  {project.linkedItems.length > 0 ? (
                    <div className="space-y-1">
                      {project.linkedItems.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <ApperIcon 
                            name={item.type === 'task' ? 'CheckSquare' : item.type === 'event' ? 'Calendar' : 'Mail'} 
                            size={14} 
                            className="text-gray-400" 
                          />
                          <span className="text-gray-600 truncate">{item.title}</span>
                        </div>
                      ))}
                      {project.linkedItems.length > 3 && (
                        <p className="text-xs text-gray-500 ml-6">
                          +{project.linkedItems.length - 3} more items
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No linked items yet</p>
                  )}
                </div>
                
                {/* Created Date */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Created {new Date(project.created).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;