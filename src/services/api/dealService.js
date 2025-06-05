const dealService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'value', 'stage', 'probability', 'expected_close_date', 'created_at', 'updated_at', 'contact_id'],
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await apperClient.fetchRecords('deal', params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching deals:', error)
      throw new Error('Failed to fetch deals')
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'title', 'value', 'stage', 'probability', 'expected_close_date', 'created_at', 'updated_at', 'contact_id']
      }

      const response = await apperClient.getRecordById('deal', id, params)
      return response?.data || null
    } catch (error) {
      console.error('Error fetching deal:', error)
      throw new Error('Failed to fetch deal')
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
      const dealData = {
        title: data.title || '',
        value: parseFloat(data.value) || 0,
        stage: data.stage || 'lead',
        probability: data.probability || '0-6',
        expected_close_date: data.expectedCloseDate || '',
        contact_id: data.contactId || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [dealData]
      }

      const response = await apperClient.createRecord('deal', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to create deal'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating deal:', error)
      throw new Error(error.message || 'Failed to create deal')
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
      const dealData = {
        Id: id,
        title: data.title || '',
        value: parseFloat(data.value) || 0,
        stage: data.stage || 'lead',
        probability: data.probability || '0-6',
        expected_close_date: data.expectedCloseDate || data.expected_close_date || '',
        contact_id: data.contactId || data.contact_id || '',
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [dealData]
      }

      const response = await apperClient.updateRecord('deal', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to update deal'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating deal:', error)
      throw new Error(error.message || 'Failed to update deal')
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

      const response = await apperClient.deleteRecord('deal', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return true
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to delete deal'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error deleting deal:', error)
      throw new Error(error.message || 'Failed to delete deal')
    }
  }
}

export default dealService