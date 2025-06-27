import { toast } from 'react-toastify';

class ServiceConnectionService {
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
          { field: { Name: "service_id" } },
          { field: { Name: "status" } },
          { field: { Name: "last_sync" } },
          { field: { Name: "settings" } }
        ],
        orderBy: [
          { fieldName: "last_sync", sorttype: "DESC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('service_connection', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching service connections:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "service_id" } },
          { field: { Name: "status" } },
          { field: { Name: "last_sync" } },
          { field: { Name: "settings" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('service_connection', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching service connection with ID ${id}:`, error);
      return null;
    }
  }

  async create(connectionData) {
    try {
      const params = {
        records: [{
          service_id: connectionData.serviceId || connectionData.service_id,
          status: connectionData.status,
          last_sync: connectionData.lastSync || connectionData.last_sync || new Date().toISOString(),
          settings: typeof connectionData.settings === 'string' ? connectionData.settings : JSON.stringify(connectionData.settings || {})
        }]
      };
      
      const response = await this.apperClient.createRecord('service_connection', params);
      
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
      console.error("Error creating service connection:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...Object.keys(updateData).reduce((acc, key) => {
            if (['service_id', 'status', 'last_sync', 'settings'].includes(key)) {
              if (key === 'settings' && typeof updateData[key] === 'object') {
                acc[key] = JSON.stringify(updateData[key]);
              } else if (key === 'lastSync') {
                acc['last_sync'] = updateData[key];
              } else if (key === 'serviceId') {
                acc['service_id'] = updateData[key];
              } else {
                acc[key] = updateData[key];
              }
            }
            return acc;
          }, {})
        }]
      };
      
      const response = await this.apperClient.updateRecord('service_connection', params);
      
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
      console.error("Error updating service connection:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('service_connection', params);
      
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
      console.error("Error deleting service connection:", error);
      throw error;
    }
  }
}

export const serviceConnectionService = new ServiceConnectionService();