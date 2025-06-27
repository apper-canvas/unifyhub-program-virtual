import events from '@/services/mockData/events.json';

class EventService {
  constructor() {
    this.events = [...events];
  }

  async getAll() {
    await this.delay(300);
    return [...this.events].sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  async getById(id) {
    await this.delay(200);
    return this.events.find(event => event.id === id);
  }

  async create(eventData) {
    await this.delay(400);
    const newEvent = {
      ...eventData,
      id: (Math.max(...this.events.map(e => parseInt(e.id))) + 1).toString()
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, updateData) {
    await this.delay(300);
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) throw new Error('Event not found');
    
    this.events[index] = { ...this.events[index], ...updateData };
    return { ...this.events[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.events.findIndex(event => event.id === id);
    if (index === -1) throw new Error('Event not found');
    
    this.events.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const eventService = new EventService();