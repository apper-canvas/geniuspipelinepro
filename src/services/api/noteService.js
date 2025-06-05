const noteService = {
  async getByEntity(entityType, entityId) {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'content', 'entity_type', 'entity_id', 'author_name', 'created_at', 'updated_at'],
        where: [
          { fieldName: 'entity_type', operator: 'ExactMatch', values: [entityType] },
          { fieldName: 'entity_id', operator: 'ExactMatch', values: [entityId] }
        ],
        orderBy: [{ fieldName: 'created_at', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await apperClient.fetchRecords('note', params)
      return response?.data || []
    } catch (error) {
      console.error('Error fetching notes:', error)
      throw new Error('Failed to fetch notes')
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
      const noteData = {
        content: data.content || '',
        entity_type: data.entityType || '',
        entity_id: data.entityId || '',
        author_name: data.authorName || 'Current User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [noteData]
      }

      const response = await apperClient.createRecord('note', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to create note'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating note:', error)
      throw new Error(error.message || 'Failed to create note')
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
      const noteData = {
        Id: id,
        content: data.content || '',
        entity_type: data.entityType || data.entity_type || '',
        entity_id: data.entityId || data.entity_id || '',
        author_name: data.authorName || data.author_name || 'Current User',
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [noteData]
      }

      const response = await apperClient.updateRecord('note', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to update note'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating note:', error)
      throw new Error(error.message || 'Failed to update note')
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

      const response = await apperClient.deleteRecord('note', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return true
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to delete note'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      throw new Error(error.message || 'Failed to delete note')
    }
  }
}

export default noteService