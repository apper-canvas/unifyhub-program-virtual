import rules from '@/services/mockData/rules.json';

class RuleService {
  constructor() {
    this.rules = [...rules];
  }

  async getAll() {
    await this.delay(300);
    return [...this.rules].sort((a, b) => a.enabled === b.enabled ? 0 : a.enabled ? -1 : 1);
  }

  async getById(id) {
    await this.delay(200);
    return this.rules.find(rule => rule.id === id);
  }

  async create(ruleData) {
    await this.delay(400);
    const newRule = {
      ...ruleData,
      id: (Math.max(...this.rules.map(r => parseInt(r.id))) + 1).toString(),
      lastRun: null
    };
    this.rules.push(newRule);
    return { ...newRule };
  }

  async update(id, updateData) {
    await this.delay(300);
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index === -1) throw new Error('Rule not found');
    
    this.rules[index] = { ...this.rules[index], ...updateData };
    return { ...this.rules[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index === -1) throw new Error('Rule not found');
    
    this.rules.splice(index, 1);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const ruleService = new RuleService();