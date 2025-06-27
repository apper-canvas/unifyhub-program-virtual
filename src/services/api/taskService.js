import tasks from '@/services/mockData/tasks.json';

class TaskService {
  constructor() {
    this.tasks = [...tasks];
  }

  async getAll() {
    await this.delay(300);
    return [...this.tasks].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === 'completed' ? 1 : -1;
      }
      return new Date(a.dueDate || '2099-12-31') - new Date(b.dueDate || '2099-12-31');
    });
  }

  async getById(id) {
    await this.delay(200);
    return this.tasks.find(task => task.id === id);
  }

  async create(taskData) {
    await this.delay(400);
    const newTask = {
      ...taskData,
      id: (Math.max(...this.tasks.map(t => parseInt(t.id))) + 1).toString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay(300);
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks[index] = { ...this.tasks[index], ...updateData };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) throw new Error('Task not found');
    
    this.tasks.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const taskService = new TaskService();