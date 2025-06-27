import { toast } from 'react-toastify';

class EventService {
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
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "attendees" } },
          { field: { Name: "location" } },
          { field: { Name: "project_id" } }
        ],
        orderBy: [
          { fieldName: "start", sorttype: "ASC" }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('event', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "service" } },
          { field: { Name: "title" } },
          { field: { Name: "start" } },
          { field: { Name: "end" } },
          { field: { Name: "attendees" } },
          { field: { Name: "location" } },
          { field: { Name: "project_id" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById('event', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      return null;
    }
  }

  async create(eventData) {
    try {
      const params = {
        records: [{
          service: eventData.service,
          title: eventData.title,
          start: eventData.start,
          end: eventData.end,
          attendees: Array.isArray(eventData.attendees) ? eventData.attendees.join(',') : eventData.attendees || '',
          location: eventData.location || '',
          project_id: eventData.project_id ? parseInt(eventData.project_id) : null
        }]
      };
      
      const response = await this.apperClient.createRecord('event', params);
      
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
      console.error("Error creating event:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          ...Object.keys(updateData).reduce((acc, key) => {
            if (['service', 'title', 'start', 'end', 'attendees', 'location', 'project_id'].includes(key)) {
              if (key === 'attendees' && Array.isArray(updateData[key])) {
                acc[key] = updateData[key].join(',');
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
      
      const response = await this.apperClient.updateRecord('event', params);
      
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
      console.error("Error updating event:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('event', params);
      
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
      console.error("Error deleting event:", error);
      throw error;
    }
  }
}

export const eventService = new EventService();