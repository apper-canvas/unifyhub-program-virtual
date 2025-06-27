import connections from '@/services/mockData/serviceConnections.json';

class ServiceConnectionService {
  constructor() {
    this.connections = [...connections];
  }

  async getAll() {
    await this.delay(300);
    return [...this.connections].sort((a, b) => {
      if (a.status !== b.status) {
        const statusOrder = { connected: 0, syncing: 1, error: 2, disconnected: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.lastSync) - new Date(a.lastSync);
    });
  }

  async getById(id) {
    await this.delay(200);
    return this.connections.find(connection => connection.id === id);
  }

  async create(connectionData) {
    await this.delay(400);
    const newConnection = {
      ...connectionData,
      id: (Math.max(...this.connections.map(c => parseInt(c.id))) + 1).toString()
    };
    this.connections.push(newConnection);
    return { ...newConnection };
  }

  async update(id, updateData) {
    await this.delay(300);
    const index = this.connections.findIndex(connection => connection.id === id);
    if (index === -1) throw new Error('Connection not found');
    
    this.connections[index] = { ...this.connections[index], ...updateData };
    return { ...this.connections[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.connections.findIndex(connection => connection.id === id);
    if (index === -1) throw new Error('Connection not found');
    
    this.connections.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const serviceConnectionService = new ServiceConnectionService();