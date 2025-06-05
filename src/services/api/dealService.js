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
      // Validate required data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid deal data provided')
      }

      if (!data.title || !data.title.trim()) {
        throw new Error('Deal title is required')
      }

      if (!data.value || isNaN(parseFloat(data.value))) {
        throw new Error('Valid deal value is required')
      }

      // Check if ApperSDK is available
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        throw new Error('ApperSDK is not available. Please check your connection.')
      }

      const { ApperClient } = window.ApperSDK
      
      // Validate environment variables
      if (!import.meta.env.VITE_APPER_PROJECT_ID || !import.meta.env.VITE_APPER_PUBLIC_KEY) {
        throw new Error('Apper configuration is missing. Please check environment variables.')
      }

      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      // Validate and prepare deal data
      const dealData = {
        title: String(data.title).trim(),
        value: parseFloat(data.value),
        stage: data.stage || 'lead',
        probability: data.probability || '0-6',
        expected_close_date: data.expectedCloseDate || '',
        contact_id: data.contactId || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log('Creating deal with data:', dealData)

const params = {
        records: [dealData]
      }

      const response = await apperClient.createRecord('deal', params)
      
      console.log('Deal creation response:', response)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response?.results?.[0]?.message || response?.message || 'Failed to create deal - unknown server error'
        console.error('Deal creation failed:', errorMsg, response)
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error in deal creation process:', error)
      
      // Re-throw with more context if it's a generic error
      if (error.message === 'Failed to create deal') {
        throw new Error('Failed to create deal - please check your connection and try again')
      }
      
      throw new Error(error.message || 'Unexpected error occurred while creating deal')
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