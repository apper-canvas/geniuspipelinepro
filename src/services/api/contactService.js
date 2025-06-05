const contactService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'created_at', 'updated_at'],
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await apperClient.fetchRecords('contact', params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching contacts:', error)
      throw new Error('Failed to fetch contacts')
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 'email', 'phone', 'company', 'position', 'created_at', 'updated_at']
      }

      const response = await apperClient.getRecordById('contact', id, params)
      return response?.data || null
    } catch (error) {
      console.error('Error fetching contact:', error)
      throw new Error('Failed to fetch contact')
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
      const contactData = {
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        position: data.position || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [contactData]
      }

      const response = await apperClient.createRecord('contact', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to create contact'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating contact:', error)
      throw new Error(error.message || 'Failed to create contact')
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
      const contactData = {
        Id: id,
        first_name: data.firstName || '',
        last_name: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        position: data.position || '',
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [contactData]
      }

      const response = await apperClient.updateRecord('contact', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to update contact'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating contact:', error)
      throw new Error(error.message || 'Failed to update contact')
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

      const response = await apperClient.deleteRecord('contact', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return true
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to delete contact'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw new Error(error.message || 'Failed to delete contact')
    }
  }
}

export default contactService