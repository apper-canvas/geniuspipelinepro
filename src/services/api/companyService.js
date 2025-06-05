const companyService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'industry', 'size', 'employees', 'website', 'phone', 'email', 'address_street', 'address_city', 'address_state', 'address_zip_code', 'address_country', 'description', 'founded', 'revenue', 'created_at', 'updated_at'],
        orderBy: [{ fieldName: 'CreatedOn', SortType: 'DESC' }],
        pagingInfo: { limit: 100, offset: 0 }
      }

      const response = await apperClient.fetchRecords('company', params)
      return response?.data?.map(company => ({
        ...company,
        address: {
          street: company.address_street,
          city: company.address_city,
          state: company.address_state,
          zipCode: company.address_zip_code,
          country: company.address_country
        }
      })) || []
    } catch (error) {
      console.error('Error fetching companies:', error)
      throw new Error('Failed to fetch companies')
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
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'industry', 'size', 'employees', 'website', 'phone', 'email', 'address_street', 'address_city', 'address_state', 'address_zip_code', 'address_country', 'description', 'founded', 'revenue', 'created_at', 'updated_at']
      }

      const response = await apperClient.getRecordById('company', id, params)
      if (response?.data) {
        return {
          ...response.data,
          address: {
            street: response.data.address_street,
            city: response.data.address_city,
            state: response.data.address_state,
            zipCode: response.data.address_zip_code,
            country: response.data.address_country
          }
        }
      }
      return null
    } catch (error) {
      console.error('Error fetching company:', error)
      throw new Error('Failed to fetch company')
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
      const companyData = {
        Name: data.name || '',
        industry: data.industry || '',
        size: data.size || '',
        employees: parseInt(data.employees) || 0,
        website: data.website || '',
        phone: data.phone || '',
        email: data.email || '',
        address_street: data.address?.street || '',
        address_city: data.address?.city || '',
        address_state: data.address?.state || '',
        address_zip_code: data.address?.zipCode || '',
        address_country: data.address?.country || '',
        description: data.description || '',
        founded: data.founded || '',
        revenue: data.revenue || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [companyData]
      }

      const response = await apperClient.createRecord('company', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to create company'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error creating company:', error)
      throw new Error(error.message || 'Failed to create company')
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
      const companyData = {
        Id: id,
        Name: data.name || '',
        industry: data.industry || '',
        size: data.size || '',
        employees: parseInt(data.employees) || 0,
        website: data.website || '',
        phone: data.phone || '',
        email: data.email || '',
        address_street: data.address?.street || '',
        address_city: data.address?.city || '',
        address_state: data.address?.state || '',
        address_zip_code: data.address?.zipCode || '',
        address_country: data.address?.country || '',
        description: data.description || '',
        founded: data.founded || '',
        revenue: data.revenue || '',
        updated_at: new Date().toISOString()
      }

      const params = {
        records: [companyData]
      }

      const response = await apperClient.updateRecord('company', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return response.results[0].data
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to update company'
        throw new Error(errorMsg)
      }
    } catch (error) {
      console.error('Error updating company:', error)
      throw new Error(error.message || 'Failed to update company')
    }
  },

async delete(id) {
    try {
      // Validate input parameter
      if (!id) {
        throw new Error('Company ID is required for deletion')
      }

      const { ApperClient } = window.ApperSDK
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })

      const params = {
        RecordIds: [id]
      }

      const response = await apperClient.deleteRecord('company', params)
      
      if (response?.success && response.results?.[0]?.success) {
        return true
      } else {
        const errorMsg = response.results?.[0]?.message || 'Failed to delete company'
        throw new Error(errorMsg)
      }
    } catch (error) {
      // Safe error logging to prevent external script issues
      try {
        console.error('Company deletion error:', {
          companyId: id,
          error: error.message || error,
          timestamp: new Date().toISOString()
        })
      } catch (logError) {
        // Fallback if console operations fail
      }
      throw new Error(error.message || 'Failed to delete company')
    }
  }
}

export default companyService