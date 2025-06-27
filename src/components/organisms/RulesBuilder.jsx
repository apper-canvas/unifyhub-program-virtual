import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { ruleService } from '@/services/api/ruleService';

const RulesBuilder = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    conditions: [{ field: 'sender', operator: 'contains', value: '' }],
    actions: [{ type: 'move_to_project', value: '' }],
    enabled: true
  });
  
  const conditionFields = [
    { value: 'sender', label: 'Sender' },
    { value: 'subject', label: 'Subject' },
    { value: 'service', label: 'Service' },
    { value: 'priority', label: 'Priority' },
    { value: 'date', label: 'Date' }
  ];
  
  const operators = [
    { value: 'contains', label: 'contains' },
    { value: 'equals', label: 'equals' },
    { value: 'starts_with', label: 'starts with' },
    { value: 'ends_with', label: 'ends with' }
  ];
  
  const actionTypes = [
    { value: 'move_to_project', label: 'Move to Project' },
    { value: 'mark_as_read', label: 'Mark as Read' },
    { value: 'archive', label: 'Archive' },
    { value: 'add_label', label: 'Add Label' },
    { value: 'set_priority', label: 'Set Priority' },
    { value: 'send_notification', label: 'Send Notification' }
  ];
  
  const loadRules = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ruleService.getAll();
      setRules(data);
    } catch (err) {
      setError('Failed to load rules. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadRules();
  }, []);
  
  const handleToggleRule = async (ruleId) => {
    try {
      const rule = rules.find(r => r.id === ruleId);
      const updatedRule = await ruleService.update(ruleId, { enabled: !rule.enabled });
      setRules(prev => prev.map(r => r.id === ruleId ? updatedRule : r));
      toast.success(updatedRule.enabled ? 'Rule enabled' : 'Rule disabled');
    } catch (err) {
      toast.error('Failed to update rule');
    }
  };
  
  const handleDeleteRule = async (ruleId) => {
    try {
      await ruleService.delete(ruleId);
      setRules(prev => prev.filter(r => r.id !== ruleId));
      toast.success('Rule deleted');
    } catch (err) {
      toast.error('Failed to delete rule');
    }
  };
  
  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.name.trim()) return;
    
    try {
      const rule = await ruleService.create(newRule);
      setRules(prev => [rule, ...prev]);
      setNewRule({
        name: '',
        conditions: [{ field: 'sender', operator: 'contains', value: '' }],
        actions: [{ type: 'move_to_project', value: '' }],
        enabled: true
      });
      setShowAddForm(false);
      toast.success('Rule created successfully');
    } catch (err) {
      toast.error('Failed to create rule');
    }
  };
  
  const updateCondition = (index, field, value) => {
    setNewRule(prev => ({
      ...prev,
      conditions: prev.conditions.map((cond, i) => 
        i === index ? { ...cond, [field]: value } : cond
      )
    }));
  };
  
  const updateAction = (index, field, value) => {
    setNewRule(prev => ({
      ...prev,
      actions: prev.actions.map((action, i) => 
        i === index ? { ...action, [field]: value } : action
      )
    }));
  };
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadRules} />;
  
  return (
    <div className="space-y-6">
      {/* Add Rule Form */}
      {showAddForm && (
        <Card className="p-6">
          <form onSubmit={handleAddRule} className="space-y-6">
            <Input
              label="Rule Name"
              value={newRule.name}
              onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name"
              autoFocus
            />
            
            {/* Conditions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">When (Conditions)</h4>
              {newRule.conditions.map((condition, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <select
                    value={condition.field}
                    onChange={(e) => updateCondition(index, 'field', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {conditionFields.map(field => (
                      <option key={field.value} value={field.value}>{field.label}</option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {operators.map(op => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={condition.value}
                    onChange={(e) => updateCondition(index, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
            </div>
            
            {/* Actions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Then (Actions)</h4>
              {newRule.actions.map((action, index) => (
                <div key={index} className="flex items-center space-x-3 mb-3">
                  <select
                    value={action.type}
                    onChange={(e) => updateAction(index, 'type', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {actionTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  {action.type !== 'mark_as_read' && action.type !== 'archive' && (
                    <input
                      type="text"
                      value={action.value}
                      onChange={(e) => updateAction(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <Button type="submit" variant="accent">
                Create Rule
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setShowAddForm(false)}
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
          <span>New Rule</span>
        </Button>
      )}
      
      {/* Rules List */}
      {rules.length === 0 ? (
        <Empty 
          title="No automation rules"
          description="Create your first rule to automate actions based on conditions across your services."
          icon="Zap"
          actionText="Create Rule"
          onAction={() => setShowAddForm(true)}
        />
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 ${rule.enabled ? '' : 'opacity-60'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-display font-semibold text-lg text-gray-900">
                        {rule.name}
                      </h3>
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          rule.enabled ? 'bg-accent' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            rule.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Conditions */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">When:</h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">{condition.field}</span>
                            <span>{condition.operator}</span>
                            <span className="bg-surface px-2 py-1 rounded font-mono">
                              "{condition.value}"
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Then:</h4>
                      <div className="space-y-1">
                        {rule.actions.map((action, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium">
                              {actionTypes.find(t => t.value === action.type)?.label}
                            </span>
                            {action.value && (
                              <span className="bg-surface px-2 py-1 rounded font-mono">
                                "{action.value}"
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Last Run */}
                    {rule.lastRun && (
                      <p className="text-xs text-gray-500">
                        Last run: {new Date(rule.lastRun).toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-gray-400 hover:text-error p-2"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RulesBuilder;