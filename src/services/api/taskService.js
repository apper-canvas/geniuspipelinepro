const taskService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 'status', 'due_date', 'assigned_to', 'created_at', 'updated_at'],
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await apperClient.fetchRecords('task', params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      throw new Error('Failed to fetch tasks')
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'description', 'priority', 'status', 'due_date', 'assigned_to', 'created_at', 'updated_at']
      }

      const response = await apperClient.getRecordById('task', id, params)
      return response?.data || null
    } catch (error) {
      console.error('Error fetching task:', error)
      throw new Error('Failed to fetch task')
    }
  },

  async create(data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields
      const taskData = {
        title: data.title || '',
        description: data.description || '',
        priority: data.priority || 'medium',
        status: data.status || 'pending',
        due_date: data.dueDate || '',
        assigned_to: data.assignedTo || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [taskData]
      }

      const response = await apperClient.createRecord('task', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to create task'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      throw new Error(error.message || 'Failed to create task')
    }
  },

  async update(id, data) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Only include Updateable fields plus ID
      const taskData = {
        Id: id,
        title: data.title || '',
        description: data.description || '',
        priority: data.priority || 'medium',
        status: data.status || 'pending',
        due_date: data.dueDate || data.due_date || '',
        assigned_to: data.assignedTo || data.assigned_to || '',
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [taskData]
      }

      const response = await apperClient.updateRecord('task', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to update task'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw new Error(error.message || 'Failed to update task')
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord('task', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return true
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to delete task'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      throw new Error(error.message || 'Failed to delete task')
    }
  }
}

export default taskService