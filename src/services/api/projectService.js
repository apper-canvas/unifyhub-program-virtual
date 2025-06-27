import projects from '@/services/mockData/projects.json';

class ProjectService {
  constructor() {
    this.projects = [...projects];
  }

  async getAll() {
    await this.delay(300);
    return [...this.projects].sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  async getById(id) {
    await this.delay(200);
    return this.projects.find(project => project.id === id);
  }

  async create(projectData) {
    await this.delay(400);
    const newProject = {
      ...projectData,
      id: (Math.max(...this.projects.map(p => parseInt(p.id))) + 1).toString(),
      created: new Date().toISOString()
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await this.delay(300);
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) throw new Error('Project not found');
    
    this.projects[index] = { ...this.projects[index], ...updateData };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) throw new Error('Project not found');
    
    this.projects.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const projectService = new ProjectService();