import { toast } from 'react-toastify';

class MessageService {
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
          { field: { Name: "from" } },
          { field: { Name: "subject" } },
          { field: { Name: "preview" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read" } },
          { field: { Name: "labels" } }
        ],
        orderBy: [
          { fieldName: "timestamp", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('message', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "service" } },
          { field: { Name: "from" } },
          { field: { Name: "subject" } },
          { field: { Name: "preview" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "read" } },
          { field: { Name: "labels" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('message', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching message with ID ${id}:`, error);
      return null;
    }
  }

  async create(messageData) {
    try {
      const params = {
        records: [{
          service: messageData.service,
          from: messageData.from,
          subject: messageData.subject,
          preview: messageData.preview,
          timestamp: messageData.timestamp || new Date().toISOString(),
          read: messageData.read || false,
          labels: Array.isArray(messageData.labels) ? messageData.labels.join(',') : messageData.labels || ''
        }]
      };
      
      const response = await this.apperClient.createRecord('message', params);
      
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
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...Object.keys(updateData).reduce((acc, key) => {
            if (['service', 'from', 'subject', 'preview', 'timestamp', 'read', 'labels'].includes(key)) {
              if (key === 'labels' && Array.isArray(updateData[key])) {
                acc[key] = updateData[key].join(',');
              } else {
                acc[key] = updateData[key];
              }
            }
            return acc;
          }, {})
        }]
      };
      
      const response = await this.apperClient.updateRecord('message', params);
      
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
      console.error("Error updating message:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('message', params);
      
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
      console.error("Error deleting message:", error);
      throw error;
    }
  }
}

export const messageService = new MessageService();