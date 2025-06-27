import { toast } from 'react-toastify';

class TaskService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "service" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "status" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          { fieldName: "status", sorttype: "ASC" },
          { fieldName: "due_date", sorttype: "ASC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

// Helper method to validate ID parameters
validateId(id) {
    // Check for undefined, null, or empty values first
    if (id === undefined || id === null || id === '') {
      return false;
    }
    
    // Convert to string to handle numeric inputs safely
    const idString = String(id).trim();
    
    // Check if it's a valid number string
    if (idString === '' || isNaN(idString)) {
      return false;
    }
    
    const numericId = parseInt(idString, 10);
    return !isNaN(numericId) && numericId > 0 && Number.isInteger(numericId);
  }

  async getById(id) {
    try {
      // Validate ID parameter before making API call
      if (!this.validateId(id)) {
        console.error(`Invalid ID provided to getById: ${id}`);
        toast.error('Invalid task ID provided');
        return null;
      }

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "service" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "priority" } },
          { field: { Name: "due_date" } },
          { field: { Name: "status" } },
          { field: { Name: "project_id" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      const params = {
        records: [{
          service: taskData.service,
          title: taskData.title,
          description: taskData.description || '',
          priority: taskData.priority,
          due_date: taskData.dueDate || taskData.due_date,
          status: taskData.status,
          project_id: taskData.projectId || taskData.project_id ? parseInt(taskData.projectId || taskData.project_id) : null
        }]
      };
      
      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

async update(id, updateData) {
    try {
      // Validate ID parameter before making API call
      if (id === undefined || id === null || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        console.error(`Invalid ID provided to update: ${id}`);
        toast.error('Invalid task ID provided for update');
        return null;
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...Object.keys(updateData).reduce((acc, key) => {
            if (['service', 'title', 'description', 'priority', 'due_date', 'status', 'project_id'].includes(key)) {
              if (key === 'dueDate') {
                acc['due_date'] = updateData[key];
              } else if (key === 'projectId') {
                acc['project_id'] = updateData[key] ? parseInt(updateData[key]) : null;
              } else if (key === 'project_id' && updateData[key]) {
                acc[key] = parseInt(updateData[key]);
              } else {
                acc[key] = updateData[key];
              }
            }
            return acc;
          }, {})
        }]
      };
      
      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

async delete(id) {
    try {
      // Validate ID parameter before making API call
      if (!this.validateId(id)) {
        console.error(`Invalid ID provided to delete: ${id}`);
        toast.error('Invalid task ID provided for deletion');
        return false;
      }

      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export const taskService = new TaskService();