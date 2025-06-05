import mockQuotes from '../mockData/quotes.json'

// Utility function to create a delay for database simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for quotes (simulating a database table)
let quotes = [...mockQuotes]

const quoteService = {
  // Get all quotes with database-like operations
  async getAll() {
    await delay(320)
    try {
      // Simulate database query with sorting and data integrity
      const sortedQuotes = [...quotes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return sortedQuotes.map(quote => ({ ...quote }))
    } catch (error) {
      throw new Error('Failed to retrieve quotes from database')
    }
  },

  // Get quote by ID with enhanced error handling
  async getById(id) {
    await delay(280)
    try {
      const quote = quotes.find(q => q.id === parseInt(id))
      if (!quote) {
        throw new Error(`Quote with ID ${id} not found in database`)
      }
      return { ...quote }
    } catch (error) {
      if (error.message.includes('not found')) {
        throw error
      }
      throw new Error('Database error while retrieving quote')
    }
  },

  // Create new quote with comprehensive validation
  async create(quoteData) {
    await delay(380)
    
    try {
      // Enhanced validation for database integrity
      if (!quoteData.title?.trim()) {
        throw new Error('Quote title is required and cannot be empty')
      }
      if (!quoteData.amount || parseFloat(quoteData.amount) <= 0) {
        throw new Error('Quote amount must be a positive number greater than 0')
      }
      
      // Check for duplicate quote titles for the same company
      const existingQuote = quotes.find(q => 
        q.title.toLowerCase() === quoteData.title.toLowerCase() && 
        q.companyId === quoteData.companyId &&
        q.status !== 'rejected'
      )
      
      if (existingQuote) {
        throw new Error('A quote with this title already exists for this company')
      }

      const newQuote = {
        id: Date.now(),
        ...quoteData,
        amount: parseFloat(quoteData.amount),
        status: quoteData.status || 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: quoteData.items || [],
        quoteNumber: `QT-${new Date().getFullYear()}-${String(quotes.length + 1).padStart(4, '0')}`
      }

      quotes = [...quotes, newQuote]
      return { ...newQuote }
    } catch (error) {
      if (error.message.includes('required') || error.message.includes('positive') || error.message.includes('exists')) {
        throw error
      }
      throw new Error('Database error while creating quote')
    }
  },

  // Update quote with transaction-like behavior
  async update(id, quoteData) {
    await delay(340)
    
    try {
      const index = quotes.findIndex(q => q.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Quote with ID ${id} not found in database`)
      }

      // Enhanced validation
      if (quoteData.title !== undefined && !quoteData.title?.trim()) {
        throw new Error('Quote title cannot be empty')
      }
      if (quoteData.amount !== undefined && (parseFloat(quoteData.amount) <= 0 || isNaN(parseFloat(quoteData.amount)))) {
        throw new Error('Quote amount must be a positive number')
      }

      // Check for status transition validity
      const currentQuote = quotes[index]
      if (quoteData.status && currentQuote.status === 'accepted' && quoteData.status !== 'accepted') {
        throw new Error('Cannot change status of an accepted quote')
      }

      const updatedQuote = {
        ...quotes[index],
        ...quoteData,
        amount: quoteData.amount ? parseFloat(quoteData.amount) : quotes[index].amount,
        updatedAt: new Date().toISOString()
      }

      quotes = quotes.map(q => q.id === parseInt(id) ? updatedQuote : q)
      return { ...updatedQuote }
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('empty') || error.message.includes('positive') || error.message.includes('accepted')) {
        throw error
      }
      throw new Error('Database error while updating quote')
    }
  },

  // Delete quote with cascade checking
  async delete(id) {
    await delay(300)
    
    try {
      const index = quotes.findIndex(q => q.id === parseInt(id))
      if (index === -1) {
        throw new Error(`Quote with ID ${id} not found in database`)
      }

      const quoteToDelete = quotes[index]
      
      // Check if quote can be deleted (business logic)
      if (quoteToDelete.status === 'accepted') {
        throw new Error('Cannot delete an accepted quote. Please reject it first.')
      }

      const deletedQuote = { ...quotes[index] }
      quotes = quotes.filter(q => q.id !== parseInt(id))
      return deletedQuote
    } catch (error) {
      if (error.message.includes('not found') || error.message.includes('accepted')) {
        throw error
      }
      throw new Error('Database error while deleting quote')
    }
  },

  // Enhanced business methods for database-like operations
  async getByStatus(status) {
    await delay(220)
    try {
      const validStatuses = ['draft', 'sent', 'accepted', 'rejected']
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`)
      }
      return quotes.filter(q => q.status === status).map(q => ({ ...q }))
    } catch (error) {
      if (error.message.includes('Invalid status')) {
        throw error
      }
      throw new Error('Database error while filtering quotes by status')
    }
  },

  async getByCompany(companyId) {
    await delay(240)
    try {
      if (!companyId) {
        throw new Error('Company ID is required')
      }
      return quotes.filter(q => q.companyId === companyId).map(q => ({ ...q }))
    } catch (error) {
      if (error.message.includes('required')) {
        throw error
      }
      throw new Error('Database error while retrieving quotes by company')
    }
  },

  async getByContact(contactId) {
    await delay(240)
    try {
      if (!contactId) {
        throw new Error('Contact ID is required')
      }
      return quotes.filter(q => q.contactId === contactId).map(q => ({ ...q }))
    } catch (error) {
      if (error.message.includes('required')) {
        throw error
      }
      throw new Error('Database error while retrieving quotes by contact')
    }
  },

  async updateStatus(id, status) {
    await delay(280)
    try {
      const validStatuses = ['draft', 'sent', 'accepted', 'rejected']
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`)
      }
      return this.update(id, { status })
    } catch (error) {
      throw error
    }
  },

  // Advanced query methods for database-like functionality
  async searchQuotes(searchTerm) {
    await delay(300)
    try {
      if (!searchTerm?.trim()) {
        return this.getAll()
      }
      
      const term = searchTerm.toLowerCase()
      const filteredQuotes = quotes.filter(quote =>
        quote.title?.toLowerCase().includes(term) ||
        quote.description?.toLowerCase().includes(term) ||
        quote.contactId?.toLowerCase().includes(term) ||
        quote.companyId?.toLowerCase().includes(term)
      )
      
      return filteredQuotes.map(q => ({ ...q }))
    } catch (error) {
      throw new Error('Database error while searching quotes')
    }
  },

  async getQuotesByDateRange(startDate, endDate) {
    await delay(260)
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (start > end) {
        throw new Error('Start date must be before end date')
      }
      
      const filteredQuotes = quotes.filter(quote => {
        const quoteDate = new Date(quote.createdAt)
        return quoteDate >= start && quoteDate <= end
      })
      
      return filteredQuotes.map(q => ({ ...q }))
    } catch (error) {
      if (error.message.includes('Start date')) {
        throw error
      }
      throw new Error('Database error while filtering quotes by date range')
    }
  },

  async getQuoteStatistics() {
    await delay(200)
    try {
      const stats = {
        total: quotes.length,
        draft: quotes.filter(q => q.status === 'draft').length,
        sent: quotes.filter(q => q.status === 'sent').length,
        accepted: quotes.filter(q => q.status === 'accepted').length,
        rejected: quotes.filter(q => q.status === 'rejected').length,
        totalValue: quotes.reduce((sum, q) => sum + (q.amount || 0), 0),
        acceptedValue: quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.amount || 0), 0)
      }
      
      return stats
    } catch (error) {
      throw new Error('Database error while calculating quote statistics')
    }
  }
}

export default quoteService