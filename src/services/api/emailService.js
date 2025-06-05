const emailService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'to', 'from', 'subject', 'body', 'timestamp', 'status', 'is_read', 'reply_to'],
        orderBy: [{ fieldName: 'timestamp', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await apperClient.fetchRecords('email', params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching emails:', error)
      throw new Error('Failed to fetch emails')
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'to', 'from', 'subject', 'body', 'timestamp', 'status', 'is_read', 'reply_to']
      }

      const response = await apperClient.getRecordById('email', id, params)
      return response?.data || null
    } catch (error) {
      console.error('Error fetching email:', error)
      throw new Error('Failed to fetch email')
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
      const emailData = {
        to: data.to || '',
        from: data.from || '',
        subject: data.subject || '',
        body: data.body || '',
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'sent',
        is_read: data.isRead || false,
        reply_to: data.replyTo || null
      }

      const params = {
        records: [emailData]
      }

      const response = await apperClient.createRecord('email', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to create email'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating email:', error)
      throw new Error(error.message || 'Failed to create email')
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
      const emailData = {
        Id: id,
        to: data.to || '',
        from: data.from || '',
        subject: data.subject || '',
        body: data.body || '',
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'sent',
        is_read: data.isRead !== undefined ? data.isRead : false,
        reply_to: data.replyTo || data.reply_to || null
      }

      const params = {
        records: [emailData]
      }

      const response = await apperClient.updateRecord('email', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to update email'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating email:', error)
      throw new Error(error.message || 'Failed to update email')
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

      const response = await apperClient.deleteRecord('email', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return true
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to delete email'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error deleting email:', error)
      throw new Error(error.message || 'Failed to delete email')
    }
  }
}

export default emailService