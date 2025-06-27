import messages from '@/services/mockData/messages.json';

class MessageService {
  constructor() {
    this.messages = [...messages];
  }

  async getAll() {
    await this.delay(300);
    return [...this.messages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await this.delay(200);
    return this.messages.find(message => message.id === id);
  }

  async create(messageData) {
    await this.delay(400);
    const newMessage = {
      ...messageData,
      id: (Math.max(...this.messages.map(m => parseInt(m.id))) + 1).toString(),
      timestamp: new Date().toISOString()
    };
    this.messages.unshift(newMessage);
    return { ...newMessage };
  }

  async update(id, updateData) {
    await this.delay(300);
    const index = this.messages.findIndex(message => message.id === id);
    if (index === -1) throw new Error('Message not found');
    
    this.messages[index] = { ...this.messages[index], ...updateData };
    return { ...this.messages[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.messages.findIndex(message => message.id === id);
    if (index === -1) throw new Error('Message not found');
    
    this.messages.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const messageService = new MessageService();