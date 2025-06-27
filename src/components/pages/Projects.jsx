import { motion } from 'framer-motion';
import ProjectGrid from '@/components/organisms/ProjectGrid';

const Projects = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Project Management
          </h1>
          <p className="text-gray-600 mt-1">Organize and track projects with linked items from all services.</p>
        </div>
      </div>
      
      <ProjectGrid />
    </motion.div>
  );
};

export default Projects;